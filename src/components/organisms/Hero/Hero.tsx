import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../../lib/gsap';
import { useLocale } from '../../../hooks/useLocale';
import { Tag } from '../../atoms/Tag/Tag';
import { Icon } from '../../atoms/Icon/Icon';
import './Hero.css';

export interface HeroProps {
  isReady?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isReady = true }) => {
  const { t } = useLocale();
  const heroRef = useRef<HTMLElement | null>(null);
  const scribblePathRef = useRef<SVGPathElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const orbitalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isReady) return;

    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hero = heroRef.current;
    if (!hero) return;

    // Reduced motion branch: show elements immediately
    if (isReducedMotion) {
      if (scribblePathRef.current) {
        scribblePathRef.current.style.strokeDashoffset = '0';
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Eyebrow fade up
      tl.fromTo(
        '.hero-eyebrow',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );

      // 2. Name lines reveal through overflow masks
      tl.fromTo(
        '.hero-line',
        { yPercent: 110, rotateZ: 1 },
        { yPercent: 0, rotateZ: 0, duration: 0.9, stagger: 0.12 },
        '-=0.3'
      );

      // 3. Orange SVG scribble draw
      if (scribblePathRef.current) {
        tl.fromTo(
          scribblePathRef.current,
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' },
          '-=0.5'
        );
      }

      // 4. Role line & disciplines reveal
      tl.fromTo(
        ['.hero-disciplines', '.hero-role'],
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
        '-=0.6'
      );

      // 5. Scroll cue & 3D territory marker reveal
      tl.fromTo(
        ['.hero-scroll-cue', '.hero-3d-territory'],
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.8, stagger: 0.1 },
        '-=0.4'
      );

      // Subtle parallax response with ScrollTrigger
      if (titleRef.current) {
        ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          animation: gsap.to(titleRef.current, {
            y: 90,
            ease: 'none',
          }),
        });
      }

      if (orbitalRef.current) {
        ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          animation: gsap.to(orbitalRef.current, {
            y: -60,
            rotateZ: 25,
            ease: 'none',
          }),
        });
      }
    }, hero);

    return () => {
      ctx.revert();
    };
  }, [isReady]);

  return (
    <section ref={heroRef} className="hero-section" id="top" aria-label="Hero">
      <div className="hero-container">
        {/* Upper Positioning */}
        <div className="hero-eyebrow">
          <span className="hero-eyebrow__badge">AP // PORTFOLIO</span>
          <span className="hero-eyebrow__title">{t.hero.eyebrow}</span>
        </div>

        {/* Massive Name Headline with Scribble */}
        <div className="hero-headline-wrap">
          <h1 ref={titleRef} className="hero-name-massive">
            <div className="hero-line-mask">
              <span className="hero-line line-first">
                {t.hero.firstName}
                <svg
                  className="hero-scribble"
                  viewBox="0 0 300 70"
                  aria-hidden="true"
                >
                  <path
                    ref={scribblePathRef}
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset="1"
                    d="M6 44 C 40 6, 66 74, 104 34 S 168 8, 198 44 S 254 56, 294 16"
                  />
                </svg>
              </span>
            </div>
            <div className="hero-line-mask">
              <span className="hero-line line-last">
                {t.hero.lastName}
              </span>
            </div>
          </h1>

          {/* Temporary 3D Geometry Territory (No Three.js Canvas) */}
          <div ref={orbitalRef} className="hero-3d-territory" aria-hidden="true">
            <div className="hero-orbital-ring">
              <div className="hero-orbital-axis" />
              <div className="hero-orbital-core" />
            </div>
            <span className="hero-3d-tag">{t.hero.pending3D}</span>
          </div>
        </div>

        {/* Lower Disciplines & Scroll Cue */}
        <div className="hero-footer-row">
          <div className="hero-disciplines">
            <div className="disciplines-pills">
              <Tag label="3D / CGI" variant="accent" />
              <span className="disciplines-divider">·</span>
              <span className="disciplines-text">{t.hero.disciplinesLine}</span>
            </div>
            <p className="hero-role">{t.hero.roleLine}</p>
          </div>

          <div className="hero-scroll-cue">
            <span className="scroll-cue__text">{t.hero.scrollHint}</span>
            <span className="scroll-cue__icon">
              <Icon name="arrow-right" size={14} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
