import React, { useEffect, useRef, useMemo } from 'react';
import { gsap, ScrollTrigger } from '../../../lib/gsap';
import { useLocale } from '../../../hooks/useLocale';
import './Intro.css';

export const Intro: React.FC = () => {
  const { t } = useLocale();
  const introRef = useRef<HTMLElement | null>(null);

  const { words, highlightIndices } = useMemo(() => {
    const statement = t.intro.statement;
    const highlight = t.intro.highlightPhrase || '';
    const tokens = statement.split(/\s+/).filter(Boolean);

    const hlStart = highlight ? statement.indexOf(highlight) : -1;
    const hlEnd = hlStart !== -1 ? hlStart + highlight.length : -1;

    let currentPos = 0;
    const hlSet = new Set<number>();

    tokens.forEach((token, idx) => {
      const tokenStart = statement.indexOf(token, currentPos);
      const tokenEnd = tokenStart !== -1 ? tokenStart + token.length : -1;
      if (tokenStart !== -1) {
        currentPos = tokenEnd;
        if (tokens.length > 1 && hlStart !== -1 && tokenStart < hlEnd && tokenEnd > hlStart) {
          hlSet.add(idx);
        }
      }
    });

    return { words: tokens, highlightIndices: hlSet };
  }, [t.intro.statement, t.intro.highlightPhrase]);

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
      const secondary = intro.querySelector<HTMLElement>('.intro-secondary');

      const tl = gsap.timeline({ paused: true });

      wordWraps.forEach((wrap, i) => {
        const box = wrap.querySelector<HTMLElement>('.lando-highlight-box');
        const text = wrap.querySelector<HTMLElement>('.lando-word-text');
        if (!box || !text) return;

        const wordStartTime = i * 0.09;

        // 1. Box sweeps 0 -> 1
        tl.fromTo(
          box,
          { scaleX: 0, opacity: 0.9 },
          { scaleX: 1, opacity: 1, duration: 0.28, ease: 'power2.out' },
          wordStartTime
        )
          // 2. Word floats up and illuminates: opacity lower -> 1, y slightly positive -> 0
          .fromTo(
            text,
            { opacity: 0.22, y: 6 },
            { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' },
            wordStartTime + 0.04
          )
          // 3. Highlight box disappears (opacity -> 0)
          .to(
            box,
            { opacity: 0, duration: 0.24, ease: 'power1.out' },
            wordStartTime + 0.22
          );
      });

      if (secondary) {
        const secondaryStartTime =
          wordWraps.length > 0 ? (wordWraps.length - 1) * 0.09 + 0.15 : 0;
        tl.fromTo(
          secondary,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
          secondaryStartTime
        );
      }

      const st = ScrollTrigger.create({
        trigger: intro,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          tl.play();
        },
      });

      if (st.progress > 0) {
        tl.play();
      }
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
            const isHighlight = highlightIndices.has(idx);

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
