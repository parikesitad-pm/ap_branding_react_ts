import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { Category } from '../../../data/types';
import { projects } from '../../../data/projects';
import { useLocale } from '../../../hooks/useLocale';
import { FilterChips } from '../../molecules/FilterChips/FilterChips';
import { ProgressBar } from '../../molecules/ProgressBar/ProgressBar';
import { SectionTitle } from '../../molecules/SectionTitle/SectionTitle';
import { Button } from '../../atoms/Button/Button';
import { Tag } from '../../atoms/Tag/Tag';
import { ReelCard } from './ReelCard';
import { gsap, ScrollTrigger, Flip } from '../../../lib/gsap';
import './Reel.css';

export const Reel: React.FC = () => {
  const { t } = useLocale();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [progress, setProgress] = useState<number>(0);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(1);
  const [isNativeScroll, setIsNativeScroll] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef<number>(1);
  activeIndexRef.current = activeCardIndex;

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Calculate nearest project card based on horizontal position
  const updateActiveIndexFromTrack = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = track.querySelectorAll<HTMLElement>('.reel-card');
    if (!cards.length) return;

    const viewportCenter = window.innerWidth / 2;
    let closestIndex = 1;
    let minDiff = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const diff = Math.abs(cardCenter - viewportCenter);
      if (diff < minDiff) {
        minDiff = diff;
        const idx = parseInt(card.dataset.index || '1', 10);
        closestIndex = idx;
      }
    });

    if (closestIndex !== activeIndexRef.current) {
      setActiveCardIndex(closestIndex);
    }
  }, []);

  // Check if reduced-motion or mobile layout is active
  useEffect(() => {
    const checkMode = () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.innerWidth < 768;
      setIsNativeScroll(prefersReduced || isMobile);
    };

    checkMode();
    window.addEventListener('resize', checkMode, { passive: true });
    return () => window.removeEventListener('resize', checkMode);
  }, []);

  // Desktop ScrollTrigger Pinned Horizontal Rail
  useEffect(() => {
    if (isNativeScroll || typeof window === 'undefined') return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let ctx: gsap.Context | null = null;

    // Small delay to ensure layout measurements are ready
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        const getScrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            id: 'reel-horizontal',
            trigger: section,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const currentProgress = Math.round(self.progress * 100);
              setProgress(currentProgress);
              updateActiveIndexFromTrack();
            },
          },
        });
      }, sectionRef);
    }, 50);

    // Refresh ScrollTrigger on resize or layout changes
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(track);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      if (ctx) ctx.revert();
    };
  }, [isNativeScroll, filteredProjects, updateActiveIndexFromTrack]);

  // Mobile / Reduced-Motion Native Horizontal Scroll Listener
  useEffect(() => {
    if (!isNativeScroll) return;

    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll > 0) {
        const currentProgress = Math.round((track.scrollLeft / maxScroll) * 100);
        setProgress(currentProgress);
      }
      updateActiveIndexFromTrack();
    };

    track.addEventListener('scroll', handleScroll, { passive: true });
    return () => track.removeEventListener('scroll', handleScroll);
  }, [isNativeScroll, updateActiveIndexFromTrack]);

  // Filter change handler with predictable reset & Flip transition
  const handleFilterChange = (cat: Category | 'all') => {
    if (cat === activeCategory) return;

    const track = trackRef.current;
    const cards = track ? track.querySelectorAll('.reel-card') : null;
    const flipState = cards ? Flip.getState(cards) : null;

    setActiveCategory(cat);
    setActiveCardIndex(1);
    setProgress(0);

    // Reset scroll if pinned
    const st = ScrollTrigger.getById('reel-horizontal');
    if (st && st.progress > 0) {
      st.scroll(st.start);
    }

    if (isNativeScroll && track) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    }

    // Flip animation on updated cards
    requestAnimationFrame(() => {
      if (flipState && track) {
        const updatedCards = track.querySelectorAll('.reel-card');
        Flip.from(flipState, {
          targets: updatedCards,
          duration: 0.45,
          ease: 'power2.out',
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        });
      } else {
        ScrollTrigger.refresh();
      }
    });
  };

  // Split projects for editorial process note insertion
  const midpoint = Math.max(1, Math.ceil(filteredProjects.length / 2));
  const firstHalf = filteredProjects.slice(0, midpoint);
  const secondHalf = filteredProjects.slice(midpoint);

  return (
    <section
      id="work"
      ref={sectionRef}
      className={`reel-section ${isNativeScroll ? 'reel-section--native' : 'reel-section--pinned'}`}
      aria-label={t.reel.title}
    >
      {/* Pinned Top Bar: Section Header + FilterChips + Project Counter */}
      <header className="reel-top-bar">
        <div className="reel-top-bar__header">
          <SectionTitle
            index="02"
            title={t.reel.title}
            description={t.reel.subtitle}
            className="reel-top-bar__title"
          />
        </div>

        <div className="reel-top-bar__controls">
          <FilterChips
            active={activeCategory}
            onChange={handleFilterChange}
            className="reel-top-bar__chips"
          />

          <div className="reel-counter-top" aria-live="polite" aria-atomic="true">
            <span className="reel-counter-current">
              {String(activeCardIndex).padStart(2, '0')}
            </span>
            <span className="reel-counter-sep">/</span>
            <span className="reel-counter-total">
              {String(filteredProjects.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </header>

      {/* Horizontal Rail Container */}
      <div className="reel-track-viewport">
        <div ref={trackRef} className="reel-track" role="region" aria-label="Horizontal project track">
          {/* Start Editorial Panel */}
          <div className="reel-panel reel-panel--start" aria-label="Reel introduction panel">
            <div className="reel-panel__inner">
              <span className="reel-panel__eyebrow">{t.reel.startPanelEyebrow}</span>
              <h3 className="reel-panel__heading">{t.reel.startPanelTitle}</h3>
              <p className="reel-panel__desc">{t.reel.startPanelDesc}</p>
              <div className="reel-panel__accent-line" />
            </div>
          </div>

          {/* First Group of Project Cards */}
          {firstHalf.map((project, idx) => (
            <ReelCard
              key={project.id}
              project={project}
              index={idx}
            />
          ))}

          {/* Intermixed Editorial Process Note Panel */}
          <div className="reel-panel reel-panel--process" aria-label="Process editorial note">
            <div className="reel-panel__inner">
              <div className="reel-panel__badge">
                <Tag label={t.reel.processTag} variant="accent" />
              </div>
              <blockquote className="reel-panel__quote">
                "{t.reel.processNote}"
              </blockquote>
              <div className="reel-panel__accent-line" />
            </div>
          </div>

          {/* Second Group of Project Cards */}
          {secondHalf.map((project, idx) => (
            <ReelCard
              key={project.id}
              project={project}
              index={firstHalf.length + idx}
            />
          ))}

          {/* Closing Editorial Panel */}
          <div className="reel-panel reel-panel--end" aria-label="Reel closing panel">
            <div className="reel-panel__inner">
              <h3 className="reel-panel__heading">{t.reel.endTitle}</h3>
              <p className="reel-panel__desc">{t.reel.endSubtitle}</p>
              <Button
                href="#contact"
                variant="primary"
                className="reel-panel__cta"
              >
                {t.reel.startProject}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Bottom Bar: Scroll Hint + Flare ProgressBar + Bottom Counter */}
      <footer className="reel-bottom-bar">
        <div className="reel-scroll-hint" aria-hidden="true">
          <span className="reel-hint-text">{t.reel.scrollHint}</span>
          <div className="reel-hint-track">
            <span className="reel-hint-dot" />
          </div>
        </div>

        <div className="reel-progress-wrap">
          <ProgressBar
            value={progress}
            max={100}
            label={t.a11y.progress}
            className="reel-progress-bar"
          />
        </div>

        <div className="reel-counter-bottom" aria-hidden="true">
          <span>
            {String(activeCardIndex).padStart(2, '0')} — {String(filteredProjects.length).padStart(2, '0')}
          </span>
        </div>
      </footer>
    </section>
  );
};

