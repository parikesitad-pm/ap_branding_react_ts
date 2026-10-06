import React, { useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { useLocale } from '../../../hooks/useLocale';
import { ModelErrorBoundary } from './ModelErrorBoundary';
import type { ModelViewerModalProps, StageMode } from './types';

const ModelCanvas = lazy(() => import('./ModelCanvas'));

export const ModelViewerModal: React.FC<ModelViewerModalProps> = ({
  isOpen,
  projects,
  activeIndex,
  stageMode,
  isDark,
  onClose,
  onSelectProject,
  onStageModeChange,
}) => {
  const { t } = useLocale();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const stageProgressRef = useRef<number>(
    stageMode === 'final' ? 0 : stageMode === 'shaded' ? 0.5 : 1
  );

  // Sync internal progress ref when stageMode changes
  useEffect(() => {
    stageProgressRef.current = stageMode === 'final' ? 0 : stageMode === 'shaded' ? 0.5 : 1;
  }, [stageMode]);

  // Body scroll locking & focus management
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    const timer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.clearTimeout(timer);
    };
  }, [isOpen]);

  // Keyboard navigation: Escape to close, ArrowLeft/Right to switch models
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (activeIndex - 1 + projects.length) % projects.length;
        onSelectProject(prevIndex);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (activeIndex + 1) % projects.length;
        onSelectProject(nextIndex);
      }
    },
    [isOpen, activeIndex, projects.length, onClose, onSelectProject]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const currentProject = projects[activeIndex] || projects[0];

  const handlePrev = () => {
    const prev = (activeIndex - 1 + projects.length) % projects.length;
    onSelectProject(prev);
  };

  const handleNext = () => {
    const next = (activeIndex + 1) % projects.length;
    onSelectProject(next);
  };

  return (
    <div
      ref={modalRef}
      className="model-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${currentProject.title} - 3D Viewer`}
    >
      {/* Background backdrop blur */}
      <div className="model-modal-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="model-modal-content">
        {/* Top Header Bar */}
        <header className="model-modal-header">
          <div className="model-modal-meta">
            <span className="model-modal-eyebrow">{t.stage3d.featuredIn3D}</span>
            <h2 className="model-modal-title">{currentProject.title}</h2>
            <div className="model-modal-tags">
              <span className="model-modal-badge">3D / CGI</span>
              <span className="model-modal-pending">{t.stage3d.assetPending}</span>
            </div>
          </div>

          <div className="model-modal-actions">
            {/* Project Navigation (if multiple 3D projects exist) */}
            {projects.length > 1 && (
              <div className="model-modal-nav">
                <button
                  type="button"
                  className="model-modal-nav-btn"
                  onClick={handlePrev}
                  aria-label={t.stage3d.previous}
                >
                  ← {t.stage3d.previous}
                </button>
                <span className="model-modal-nav-indicator">
                  {activeIndex + 1} / {projects.length}
                </span>
                <button
                  type="button"
                  className="model-modal-nav-btn"
                  onClick={handleNext}
                  aria-label={t.stage3d.next}
                >
                  {t.stage3d.next} →
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              ref={closeButtonRef}
              type="button"
              className="model-modal-close-btn"
              onClick={onClose}
              aria-label={t.stage3d.closeViewer}
            >
              <span className="close-icon" aria-hidden="true">✕</span>
              <span className="close-label">{t.stage3d.closeViewer}</span>
            </button>
          </div>
        </header>

        {/* 3D Canvas Area */}
        <div className="model-modal-canvas-wrap" data-cursor="drag">
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
            <Suspense
              fallback={
                <div className="model-modal-loading">
                  <span className="model-loading-indicator" />
                  <span className="model-loading-text">{t.stage3d.loading3D}</span>
                </div>
              }
            >
              <ModelCanvas
                activeProject={currentProject}
                stageMode={stageMode}
                stageProgressRef={stageProgressRef}
                isModal={true}
                isDark={isDark}
                inView={true}
                reducedMotion={false}
              />
            </Suspense>
          </ModelErrorBoundary>
        </div>

        {/* Bottom Toolbar: Stage Selector & Interaction Hints */}
        <footer className="model-modal-footer">
          <div className="model-modal-stages" role="radiogroup" aria-label="Visual stage switcher">
            {(['final', 'shaded', 'wireframe'] as StageMode[]).map((mode, idx) => (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={stageMode === mode}
                className={`model-modal-stage-btn ${stageMode === mode ? 'is-active' : ''}`}
                onClick={() => onStageModeChange(mode)}
              >
                <span className="stage-num">0{idx + 1}</span>
                <span className="stage-name">{t.stage3d[mode]}</span>
              </button>
            ))}
          </div>

          <div className="model-modal-hint" aria-hidden="true">
            <span>{t.stage3d.dragToRotate}</span>
            <span className="hint-divider">·</span>
            <span>SCROLL TO ZOOM</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

