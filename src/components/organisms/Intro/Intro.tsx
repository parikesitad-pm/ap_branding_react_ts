import React, { useEffect, useRef, useMemo } from 'react';
import { gsap } from '../../../lib/gsap';
import { useLocale } from '../../../hooks/useLocale';
import './Intro.css';

export const Intro: React.FC = () => {
  const { t } = useLocale();
  const introRef = useRef<HTMLElement | null>(null);

  const words = useMemo(() => {
    return t.intro.statement.split(/\s+/).filter(Boolean);
  }, [t.intro.statement]);

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
      const wordWraps = intro.querySelectorAll<HTMLElement>('.lando-word-wrap');
      if (wordWraps.length) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: intro,
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: 0.85,
          },
        });

        wordWraps.forEach((wrap, i) => {
          const box = wrap.querySelector<HTMLElement>('.lando-highlight-box');
          const text = wrap.querySelector<HTMLElement>('.lando-word-text');
          if (!box || !text) return;

          // 1. Box sweeps in across word, illuminates text
          tl.fromTo(
            box,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.35, ease: 'power2.out' },
            i === 0 ? '0' : '>-0.12'
          )
            .to(
              text,
              { color: '#EEF0FA', opacity: 1, duration: 0.2 },
              '<'
            )
            // 2. Highlight box fades out, leaving illuminated text
            .to(
              box,
              { opacity: 0, duration: 0.35, ease: 'power1.out' },
              '>+0.05'
            );
        });
      }

      gsap.fromTo(
        '.intro-secondary',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: intro,
            start: 'top 60%',
            once: true,
          },
        }
      );
    }, intro);

    return () => {
      ctx.revert();
    };
  }, [words]);

  return (
    <section ref={introRef} className="intro-section" aria-label="Manifesto">
      <div className="intro-container">
        <div className="intro-eyebrow-row">
          <span className="intro-eyebrow-badge text-strobo">01 / MANIFESTO</span>
        </div>

        <h2 className="intro-statement">
          {words.map((word, idx) => {
            const isHighlight =
              t.intro.highlightPhrase &&
              t.intro.highlightPhrase.toLowerCase().includes(word.toLowerCase().replace(/[^a-zA-Z]/g, ''));

            return (
              <span key={`${word}-${idx}`} className="lando-word-wrap">
                <span
                  className="lando-highlight-box"
                  style={{
                    backgroundColor: isHighlight ? 'var(--flare)' : 'rgba(36, 56, 255, 0.85)',
                  }}
                />
                <span className={`lando-word-text ${isHighlight ? 'is-accent' : ''}`}>
                  {word}
                </span>
              </span>
            );
          })}
        </h2>

        <p className="intro-secondary">
          {t.intro.secondaryStatement}
        </p>
      </div>
    </section>
  );
};
