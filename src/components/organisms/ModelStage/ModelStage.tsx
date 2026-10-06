import React, { useState, useRef, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { useLocale } from '../../../hooks/useLocale';
import { useTheme } from '../../../hooks/useTheme';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useInView } from '../../../hooks/useInView';
import { projects } from '../../../data/projects';
import { gsap, ScrollTrigger } from '../../../lib/gsap';
import { ModelErrorBoundary } from './ModelErrorBoundary';
import { ModelViewerModal } from './ModelViewerModal';
import type { ModelStageProps, StageMode } from './types';
import './ModelStage.css';

// Lazy load 3D Canvas bundle to keep initial page bundle ultra-lean
const ModelCanvas = lazy(() => import('./ModelCanvas'));

export const ModelStage: React.FC<ModelStageProps> = ({ className = '' }) => {
  const { t } = useLocale();
  const { isDark } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Select typed 3D projects (only projects with category === '3d')
  const projects3D = useMemo(
    () => projects.filter((project) => project.category === '3d'),
    []
  );

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeProject = projects3D[activeProjectIndex] || projects3D[0];

  // Stage state & progress
  const [activeStageMode, setActiveStageMode] = useState<StageMode>('final');
  const currentStageModeRef = useRef<StageMode>('final');
  const stageProgressRef = useRef<number>(0);

  // Canvas readiness & modal states
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasTriggeredMount, setHasTriggeredMount] = useState(false);

  // DOM node references
  const sectionRef = useRef<HTMLElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const exploreBtnRef = useRef<HTMLButtonElement | null>(null);

  // Viewport observer: mount Canvas only when approaching viewport (~400px before)
  const [inViewRef, isInView] = useInView<HTMLElement>({
    rootMargin: '400px',
    triggerOnce: true,
  });

  // Keep track of active viewport intersection to pause demand rendering outside viewport
  const [, isCurrentlyInView] = useInView<HTMLElement>({
    rootMargin: '0px',
  });

  // Combine refs for section element
  const setSectionRefs = useCallback(
    (node: HTMLElement | null) => {
      sectionRef.current = node;
      inViewRef.current = node;
    },
    [inViewRef]
  );

  useEffect(() => {
    if (isInView || isModalOpen) {
      setHasTriggeredMount(true);
    }
  }, [isInView, isModalOpen]);

  // Handle stage change manually (via clicks on stage indicators)
  const handleStageSelect = useCallback((mode: StageMode) => {
    setActiveStageMode(mode);
    currentStageModeRef.current = mode;
    const targetProgress = mode === 'final' ? 0.0 : mode === 'shaded' ? 0.5 : 1.0;
    stageProgressRef.current = targetProgress;
  }, []);

  // GSAP ScrollTrigger desktop pinning and scrubbing
  useEffect(() => {
    const section = sectionRef.current;
    const shell = shellRef.current;
    if (!section || !shell || isMobile || reducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=200%',
        pin: shell,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          stageProgressRef.current = progress;

          // Determine stage state based on threshold intervals
          let mode: StageMode = 'final';
          if (progress >= 0.66) {
            mode = 'wireframe';
          } else if (progress >= 0.33) {
            mode = 'shaded';
          }

          if (mode !== currentStageModeRef.current) {
            currentStageModeRef.current = mode;
            setActiveStageMode(mode);
          }
        },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [isMobile, reducedMotion]);

  // Open modal and preserve focus
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Return focus to explore button for accessibility
    window.setTimeout(() => {
      exploreBtnRef.current?.focus();
    }, 50);
  };

  const handleExplorePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const btn = exploreBtnRef.current;
    if (!btn) return;
    const inner = btn.querySelector<HTMLElement>('.magnetic-inner');
    if (!inner) return;
    const rect = btn.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const relY = (e.clientY - rect.top - rect.height / 2) * 0.3;
    gsap.to(inner, { x: relX, y: relY, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
  };

  const handleExplorePointerLeave = () => {
    const btn = exploreBtnRef.current;
    if (!btn) return;
    const inner = btn.querySelector<HTMLElement>('.magnetic-inner');
    if (!inner) return;
    gsap.to(inner, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.35)', overwrite: 'auto' });
  };

  return (
    <section
      id="3d"
      className={`model-stage-section ${className}`.trim()}
      ref={setSectionRefs}
      aria-labelledby="model-stage-heading"
    >
      <div className="model-stage-shell" ref={shellRef}>
        {/* Editorial Atmospheric Background Elements */}
        <div className="model-stage-backdrop-art" aria-hidden="true">
          <div className="stage-ambient-glow" />
          <div className="stage-watermark-num">03</div>
        </div>

        {/* Top Header Bar */}
        <header className="model-stage-topbar">
          <div className="stage-eyebrow-group">
            <span className="stage-eyebrow-index">03 / {t.stage3d.featuredIn3D}</span>
            <h2 id="model-stage-heading" className="stage-eyebrow-title">
              {t.stage3d.featuredIn3D}
            </h2>
          </div>

          <div className="stage-meta-group">
            <span className="stage-project-title">{activeProject.title}</span>
            <div className="stage-meta-badges">
              <span className="stage-badge-cat">3D / CGI</span>
              <span className="stage-badge-pending">{t.stage3d.assetPending}</span>
            </div>
          </div>
        </header>

        {/* Center Stage: Poster-First Shell & Lazy WebGL Canvas */}
        <div className="model-stage-center">
          {/* Poster-First Fallback Layer */}
          <div
            className={`model-stage-poster ${isCanvasReady ? 'is-hidden' : ''}`}
            aria-hidden={isCanvasReady}
          >
            <svg
              className="poster-wireframe-svg"
              viewBox="0 0 200 200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <ellipse cx="100" cy="100" rx="75" ry="32" strokeDasharray="3 3" />
              <ellipse cx="100" cy="100" rx="32" ry="75" strokeDasharray="4 2" />
              <circle cx="100" cy="100" r="46" />
              <circle cx="100" cy="100" r="4" fill="currentColor" />
            </svg>
            <div className="poster-caption">
              <span className="poster-pending-label">{t.stage3d.assetPending}</span>
              <span className="poster-loading-text">{t.stage3d.loading3D}</span>
            </div>
          </div>

          {/* Code-split WebGL Canvas */}
          {hasTriggeredMount && (
            <div
              className={`model-stage-canvas-wrap ${isCanvasReady ? 'is-ready' : ''}`}
              data-cursor="drag"
            >
              <ModelErrorBoundary
                fallback={
                  <div className="model-modal-fallback">
                    <div className="model-modal-fallback-box">
                      <p className="model-modal-fallback-text">{t.stage3d.assetPending}</p>
                      <p className="model-modal-fallback-sub">{t.stage3d.webglUnavailable}</p>
                    </div>
                  </div>
                }
              >
                <Suspense fallback={null}>
                  <ModelCanvas
                    activeProject={activeProject}
                    stageMode={activeStageMode}
                    stageProgressRef={stageProgressRef}
                    isDark={isDark}
                    inView={isCurrentlyInView}
                    reducedMotion={reducedMotion}
                    onReady={() => setIsCanvasReady(true)}
                  />
                </Suspense>
              </ModelErrorBoundary>
            </div>
          )}
        </div>

        {/* Stage Indicator Rail (FINAL / SHADED / WIREFRAME) */}
        <nav
          className="model-stage-rail"
          aria-label="3D visual stage switcher"
          role="tablist"
        >
          {(['final', 'shaded', 'wireframe'] as StageMode[]).map((mode, idx) => (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={activeStageMode === mode}
              className={`stage-mode-btn ${activeStageMode === mode ? 'is-active' : ''}`}
              onClick={() => handleStageSelect(mode)}
            >
              <span className="stage-btn-num">0{idx + 1}</span>
              <span className="stage-btn-label">{t.stage3d[mode]}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Bar: Interaction hints + Explore in 3D CTA */}
        <footer className="model-stage-bottombar">
          <div className="stage-hints-group" aria-hidden="true">
            <span>{t.stage3d.dragToRotate}</span>
            <span className="stage-hint-dot">·</span>
            <span>{t.stage3d.scrollToExplore}</span>
          </div>

          <button
            ref={exploreBtnRef}
            type="button"
            className="stage-explore-cta magnetic-wrap"
            onClick={handleOpenModal}
            onPointerMove={handleExplorePointerMove}
            onPointerLeave={handleExplorePointerLeave}
            aria-label={`${t.stage3d.exploreIn3D} - ${activeProject.title}`}
          >
            <span className="magnetic-inner">{t.stage3d.exploreIn3D}</span>
            <span className="cta-arrow" aria-hidden="true">↗</span>
          </button>
        </footer>
      </div>

      {/* Fullscreen Explore Modal */}
      <ModelViewerModal
        isOpen={isModalOpen}
        projects={projects3D}
        activeIndex={activeProjectIndex}
        stageMode={activeStageMode}
        isDark={isDark}
        onClose={handleCloseModal}
        onSelectProject={(index) => setActiveProjectIndex(index)}
        onStageModeChange={handleStageSelect}
      />
    </section>
  );
};

