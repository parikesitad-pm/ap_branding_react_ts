import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../../../lib/gsap';
import { useLocale } from '../../../hooks/useLocale';
import { getPreloadableAssetUrls, preloadImage } from './preloaderAssets';
import type { ReadinessTask, LoadState } from './preloaderTypes';
import './Preloader.css';

export interface PreloaderProps {
  onComplete?: () => void;
}

const MIN_LOADER_DURATION_MS = 900;
const TASK_WATCHDOG_MS = 15000;
const GLOBAL_SAFETY_CEILING_MS = 30000;

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const { t } = useLocale();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const numberRef = useRef<HTMLSpanElement | null>(null);

  const [isCompleted, setIsCompleted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Strict mode & idempotency guards
  const onCompleteCalledRef = useRef(false);
  const exitStartedRef = useRef(false);

  useEffect(() => {
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Body scroll lock
    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const restoreBodyOverflow = () => {
      document.body.style.overflow = originalBodyOverflow;
    };

    const container = containerRef.current;
    if (!container) {
      restoreBodyOverflow();
      return;
    }

    // 1. Initialize Readiness Task Manifest
    const preloadUrls = getPreloadableAssetUrls();
    const tasks: ReadinessTask[] = [
      { id: 'app_mount', weight: 10, state: 'pending' },
      { id: 'dom_ready', weight: 10, state: 'pending' },
      { id: 'fonts_ready', weight: 25, state: 'pending' },
      { id: 'first_paint', weight: 15, state: 'pending' },
      ...preloadUrls.map((url) => ({
        id: `asset_${url}`,
        weight: 10,
        state: 'pending' as LoadState,
      })),
    ];

    const totalWeight = tasks.reduce((sum, task) => sum + task.weight, 0);
    const progressObj = { value: 0 };
    const startTime = performance.now();

    const updateDisplayNumber = (val: number) => {
      if (numberRef.current) {
        const floored = Math.floor(val);
        numberRef.current.textContent = floored.toString().padStart(3, '0');
      }
    };

    let activeTween: gsap.core.Tween | null = null;

    const executeExit = () => {
      if (exitStartedRef.current) return;
      exitStartedRef.current = true;
      setIsReady(true);

      const finishAndNotify = () => {
        restoreBodyOverflow();
        setIsCompleted(true);
        if (!onCompleteCalledRef.current) {
          onCompleteCalledRef.current = true;
          onComplete?.();
        }
      };

      if (isReducedMotion) {
        gsap.to(container, {
          opacity: 0,
          duration: 0.3,
          ease: 'power1.inOut',
          onComplete: finishAndNotify,
        });
      } else {
        // Standard exit transition for Commit A
        gsap.to(container, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.65,
          ease: 'power3.inOut',
          delay: 0.1,
          onComplete: finishAndNotify,
        });
      }
    };

    const triggerFinalCompletion = () => {
      const elapsed = performance.now() - startTime;
      const remainingMinTime = Math.max(0, MIN_LOADER_DURATION_MS - elapsed);

      window.setTimeout(() => {
        activeTween?.kill();
        activeTween = gsap.to(progressObj, {
          value: 100,
          duration: 0.25,
          ease: 'power1.out',
          onUpdate: () => updateDisplayNumber(progressObj.value),
          onComplete: () => {
            updateDisplayNumber(100);
            executeExit();
          },
        });
      }, remainingMinTime);
    };

    const recomputeProgress = () => {
      const resolvedWeight = tasks.reduce((sum, task) => {
        return task.state !== 'pending' ? sum + task.weight : sum;
      }, 0);

      const allResolved = tasks.every((t) => t.state !== 'pending');

      if (allResolved) {
        triggerFinalCompletion();
      } else {
        const rawTarget = (resolvedWeight / totalWeight) * 100;
        const cappedTarget = Math.min(99, Math.round(rawTarget));

        activeTween?.kill();
        activeTween = gsap.to(progressObj, {
          value: cappedTarget,
          duration: 0.4,
          ease: 'power2.out',
          onUpdate: () => updateDisplayNumber(progressObj.value),
        });
      }
    };

    const resolveTask = (id: string, state: LoadState) => {
      const task = tasks.find((t) => t.id === id);
      if (!task || task.state !== 'pending') return;
      task.state = state;
      recomputeProgress();
    };

    // 2. Start Task Resolution Signals
    // A. app_mount
    window.setTimeout(() => {
      resolveTask('app_mount', 'fulfilled');
    }, 16);

    // B. dom_ready
    if (document.readyState !== 'loading') {
      resolveTask('dom_ready', 'fulfilled');
    } else {
      const onDomReady = () => {
        resolveTask('dom_ready', 'fulfilled');
        document.removeEventListener('DOMContentLoaded', onDomReady);
      };
      document.addEventListener('DOMContentLoaded', onDomReady);
    }

    // C. first_paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolveTask('first_paint', 'fulfilled');
      });
    });

    // D. fonts_ready (with 15s watchdog)
    let fontSettled = false;
    const fontWatchdog = window.setTimeout(() => {
      if (!fontSettled) {
        fontSettled = true;
        console.warn('[Preloader] Font readiness timed out (15s)');
        resolveTask('fonts_ready', 'timed-out');
      }
    }, TASK_WATCHDOG_MS);

    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          if (!fontSettled) {
            fontSettled = true;
            window.clearTimeout(fontWatchdog);
            resolveTask('fonts_ready', 'fulfilled');
          }
        })
        .catch(() => {
          if (!fontSettled) {
            fontSettled = true;
            window.clearTimeout(fontWatchdog);
            resolveTask('fonts_ready', 'failed');
          }
        });
    } else {
      fontSettled = true;
      window.clearTimeout(fontWatchdog);
      resolveTask('fonts_ready', 'fulfilled');
    }

    // E. future image/poster assets
    preloadUrls.forEach((url) => {
      preloadImage(url, TASK_WATCHDOG_MS).then((success) => {
        resolveTask(`asset_${url}`, success ? 'fulfilled' : 'failed');
      });
    });

    // F. Global safety ceiling (30s)
    const globalCeilingTimer = window.setTimeout(() => {
      const pendingTasks = tasks.filter((t) => t.state === 'pending');
      if (pendingTasks.length > 0) {
        console.warn(
          `[Preloader] Global safety ceiling reached (30s). Force-resolving ${pendingTasks.length} pending task(s).`
        );
        pendingTasks.forEach((t) => {
          t.state = 'timed-out';
        });
        recomputeProgress();
      }
    }, GLOBAL_SAFETY_CEILING_MS);

    return () => {
      window.clearTimeout(fontWatchdog);
      window.clearTimeout(globalCeilingTimer);
      activeTween?.kill();
      restoreBodyOverflow();
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
      aria-busy={!isReady}
    >
      {/* Visually hidden a11y status announcement that flips to ready once complete */}
      <span className="preloader-sr-status" aria-live="polite">
        {isReady ? t.preloader.ready : t.preloader.status}
      </span>

      <div className="preloader-content">
        <div className="preloader-brand">AP</div>
        <div className="preloader-counter" aria-hidden="true">
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
