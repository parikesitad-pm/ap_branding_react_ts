import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../../../lib/gsap';
import { useLocale } from '../../../hooks/useLocale';
import './Preloader.css';

export interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReducedMotion) {
      setIsCompleted(true);
      onComplete?.();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const progressObj = { value: 0 };
    const startTime = performance.now();
    const MIN_DURATION = 900; // ms

    const ctx = gsap.context(() => {
      // Step 1: Smoothly tween counter from 0 to 75 while loading assets
      const tween = gsap.to(progressObj, {
        value: 75,
        duration: 0.8,
        ease: 'power2.out',
        onUpdate: () => {
          if (numberRef.current) {
            const current = Math.floor(progressObj.value);
            numberRef.current.textContent = current.toString().padStart(3, '0');
          }
        },
      });

      // Step 2: Check fonts readiness
      const fontPromise =
        typeof document !== 'undefined' && document.fonts && document.fonts.ready
          ? document.fonts.ready
          : Promise.resolve();

      fontPromise.then(() => {
        const elapsed = performance.now() - startTime;
        const remainingTime = Math.max(0, MIN_DURATION - elapsed);

        setTimeout(() => {
          tween.kill();
          // Finish from current progress to 100
          gsap.to(progressObj, {
            value: 100,
            duration: 0.35,
            ease: 'power1.inOut',
            onUpdate: () => {
              if (numberRef.current) {
                const current = Math.floor(progressObj.value);
                numberRef.current.textContent = current.toString().padStart(3, '0');
              }
            },
            onComplete: () => {
              if (numberRef.current) {
                numberRef.current.textContent = '100';
              }

              // Cinematic vertical clip-path reveal
              gsap.to(container, {
                clipPath: 'inset(0 0 100% 0)',
                duration: 0.75,
                ease: 'power4.inOut',
                delay: 0.1,
                onComplete: () => {
                  setIsCompleted(true);
                  onComplete?.();
                },
              });
            },
          });
        }, remainingTime);
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, [onComplete]);

  if (isCompleted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="preloader-overlay"
      role="status"
      aria-label={t.preloader.status}
    >
      <div className="preloader-content">
        <div className="preloader-brand">AP</div>
        <div className="preloader-counter">
          <span ref={numberRef} className="preloader-number">
            000
          </span>
          <span className="preloader-loading-text">
            — {t.preloader.loading}
          </span>
        </div>
      </div>
    </div>
  );
};

