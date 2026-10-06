import React, { useEffect, useRef } from 'react';
import { gsap } from '../../../lib/gsap';
import './KineticDisciplines.css';

interface KineticRowData {
  id: string;
  category?: '3d' | 'graphic' | 'animation' | 'photo';
  title: string;
  direction: 'right-to-left' | 'left-to-right';
}

const ROWS: KineticRowData[] = [
  { id: 'row-1', category: '3d', title: '3D / CGI', direction: 'right-to-left' },
  { id: 'row-2', category: 'graphic', title: 'GRAPHIC DESIGN', direction: 'left-to-right' },
  { id: 'row-3', category: 'animation', title: 'MOTION', direction: 'right-to-left' },
  { id: 'row-4', category: 'photo', title: 'PHOTOGRAPHY', direction: 'left-to-right' },
  { id: 'row-5', title: 'FILM', direction: 'right-to-left' },
];

export const KineticDisciplines: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) return;

    const ctx = gsap.context(() => {
      rowRefs.current.forEach((row, idx) => {
        if (!row) return;

        const rowData = ROWS[idx];
        const isRightToLeft = rowData?.direction === 'right-to-left';

        // Alternating directional motion scrubbed with scroll progress
        const startX = isRightToLeft ? 120 : -260;
        const endX = isRightToLeft ? -260 : 120;

        gsap.fromTo(
          row,
          { x: startX },
          {
            x: endX,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
            },
          }
        );
      });
    }, section);

    return () => {
      ctx.revert();
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

  const renderRepeatedText = (title: string) => {
    // Repeat item string 8 times to ensure seamless wide-screen overflow
    const items = Array.from({ length: 8 }, (_, i) => i);
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
                rowRefs.current[idx] = el;
              }}
              className="kinetic-marquee-track"
            >
              {renderRepeatedText(row.title)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KineticDisciplines;
