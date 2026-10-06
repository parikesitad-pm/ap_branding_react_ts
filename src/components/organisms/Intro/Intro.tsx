import React, { useEffect, useRef } from 'react';
import { gsap } from '../../../lib/gsap';
import { useLocale } from '../../../hooks/useLocale';
import './Intro.css';

export const Intro: React.FC = () => {
  const { t } = useLocale();
  const introRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const intro = introRef.current;
    if (!intro) return;

    if (isReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      // Split text or words reveal using ScrollTrigger
      const lines = intro.querySelectorAll('.intro-statement-line');

      gsap.fromTo(
        lines,
        {
          yPercent: 60,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: intro,
            start: 'top 80%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.intro-secondary',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: intro,
            start: 'top 65%',
            once: true,
          },
        }
      );
    }, intro);

    return () => {
      ctx.revert();
    };
  }, []);

  // Highlight key phrase in statement
  const renderHighlightedStatement = () => {
    const full = t.intro.statement;
    const highlight = t.intro.highlightPhrase;

    if (!highlight || !full.includes(highlight)) {
      return <span className="intro-statement-line">{full}</span>;
    }

    const parts = full.split(highlight);
    return (
      <>
        <span className="intro-statement-line">{parts[0]}</span>
        <span className="intro-statement-line intro-accent">{highlight}</span>
        <span className="intro-statement-line">{parts.slice(1).join(highlight)}</span>
      </>
    );
  };

  return (
    <section ref={introRef} className="intro-section" aria-label="Manifesto">
      <div className="intro-container">
        <div className="intro-eyebrow-row">
          <span className="intro-eyebrow-badge text-strobo">01 / MANIFESTO</span>
        </div>

        <p ref={textRef} className="intro-statement">
          {renderHighlightedStatement()}
        </p>

        <p className="intro-secondary">
          {t.intro.secondaryStatement}
        </p>
      </div>
    </section>
  );
};
