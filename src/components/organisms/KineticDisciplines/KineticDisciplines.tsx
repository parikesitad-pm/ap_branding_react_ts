import React, { useEffect, useRef } from 'react';
import { gsap } from '../../../lib/gsap';
import './KineticDisciplines.css';

interface KineticRowData {
  id: string;
  category?: '3d' | 'graphic' | 'animation' | 'photo';
  title: string;
  direction: 'right-to-left' | 'left-to-right';
  duration: number;
}

const ROWS: KineticRowData[] = [
  { id: 'row-1', category: '3d', title: '3D / CGI', direction: 'right-to-left', duration: 28 },
  { id: 'row-2', category: 'graphic', title: 'GRAPHIC DESIGN', direction: 'left-to-right', duration: 32 },
  { id: 'row-3', category: 'animation', title: 'MOTION', direction: 'right-to-left', duration: 26 },
  { id: 'row-4', category: 'photo', title: 'PHOTOGRAPHY', direction: 'left-to-right', duration: 34 },
  { id: 'row-5', title: 'FILM', direction: 'right-to-left', duration: 30 },
];

export const KineticDisciplines: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const firstSetRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) return;

    let isDestroyed = false;
    let isVisible = false;
    let observer: IntersectionObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let resizeTimeout: number | undefined;
    let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    const tweens: gsap.core.Tween[] = [];

    const killTweens = () => {
      tweens.forEach((t) => t.kill());
      tweens.length = 0;
    };

    const buildLoops = () => {
      if (isDestroyed) return;
      killTweens();

      trackRefs.current.forEach((track, idx) => {
        const firstSet = firstSetRefs.current[idx];
        const rowData = ROWS[idx];
        if (!track || !firstSet || !rowData) return;

        // Measure actual rendered width of the first set
        const setWidth = firstSet.offsetWidth;
        if (setWidth <= 0) return;

        const isRightToLeft = rowData.direction === 'right-to-left';

        if (isRightToLeft) {
          gsap.set(track, { x: 0 });
          const tween = gsap.to(track, {
            x: -setWidth,
            duration: rowData.duration,
            ease: 'none',
            repeat: -1,
            paused: !isVisible,
          });
          tweens.push(tween);
        } else {
          gsap.set(track, { x: -setWidth });
          const tween = gsap.to(track, {
            x: 0,
            duration: rowData.duration,
            ease: 'none',
            repeat: -1,
            paused: !isVisible,
          });
          tweens.push(tween);
        }
      });
    };

    const setupMarquee = () => {
      if (isDestroyed) return;
      buildLoops();

      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              isVisible = entry.isIntersecting;
              if (isVisible) {
                tweens.forEach((t) => t.play());
              } else {
                tweens.forEach((t) => t.pause());
              }
            });
          },
          { rootMargin: '200px 0px 200px 0px' }
        );
        observer.observe(section);
      } else {
        isVisible = true;
        tweens.forEach((t) => t.play());
      }

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          if (isDestroyed) return;
          const currentWidth = window.innerWidth;
          // Avoid rebuilding if width hasn't changed
          if (Math.abs(currentWidth - lastWidth) < 2) return;
          lastWidth = currentWidth;

          window.clearTimeout(resizeTimeout);
          resizeTimeout = window.setTimeout(() => {
            buildLoops();
          }, 150);
        });
        resizeObserver.observe(section);
      }
    };

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (!isDestroyed) {
          setupMarquee();
        }
      });
    } else {
      setupMarquee();
    }

    return () => {
      isDestroyed = true;
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      if (observer) observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      killTweens();
    };
  }, []);

  const handleRowClick = (cat?: '3d' | 'graphic' | 'animation' | 'photo') => {
    if (cat) {
      window.dispatchEvent(
        new CustomEvent('ap-filter-reel', {
          detail: { category: cat },
        })
      );
    }
    const workEl = document.getElementById('work');
    if (workEl) {
      workEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderRepeatedItems = (title: string) => {
    // Repeat item string 5 times per set to ensure set spans beyond typical screen width
    const items = Array.from({ length: 5 }, (_, i) => i);
    return items.map((num) => (
      <span key={num} className="kinetic-marquee-item">
        <span className="kinetic-dot">·</span>
        <span className="kinetic-marquee-text">{title}</span>
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      className="kinetic-marquee-section"
      aria-label="Discipline Mediums Ticker"
    >
      <div className="kinetic-marquee-container">
        {ROWS.map((row, idx) => (
          <div
            key={row.id}
            className={`kinetic-marquee-row kinetic-row--${idx + 1}`}
            onClick={() => handleRowClick(row.category)}
            data-cursor="view"
            title={`Explore ${row.title}`}
          >
            <div
              ref={(el) => {
                trackRefs.current[idx] = el;
              }}
              className="kinetic-marquee-track"
            >
              <div
                ref={(el) => {
                  firstSetRefs.current[idx] = el;
                }}
                className="kinetic-marquee-set"
              >
                {renderRepeatedItems(row.title)}
              </div>
              <div className="kinetic-marquee-set" aria-hidden="true">
                {renderRepeatedItems(row.title)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KineticDisciplines;

