import React, { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from '../../../lib/gsap';
import { useLocale } from '../../../hooks/useLocale';
import { getPreloadableAssetUrls, preloadImage } from './preloaderAssets';
import type { ReadinessTask, LoadState } from './preloaderTypes';
import './Preloader.css';

export interface PreloaderProps {
  onComplete?: () => void;
}

interface HoneycombCell {
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
  distanceFromCenter: number;
  directionX: number;
  directionY: number;
  fill: string;
  stroke: string;
}

interface HoneycombGrid {
  radius: number;
  cellWidth: number;
  cellHeight: number;
  polygonPoints: string;
  cells: HoneycombCell[];
}

const MIN_LOADER_DURATION_MS = 900;
const TASK_WATCHDOG_MS = 15000;
const GLOBAL_SAFETY_CEILING_MS = 30000;

function getCellColors(row: number, col: number) {
  // Deterministic brand tonal variation (Ink/Cobalt palette)
  const parity = (Math.abs(row) + Math.abs(col)) % 3;
  let fill = '#0a0c2b'; // base brand ink
  if (parity === 0) {
    fill = '#07081f'; // deep ink
  } else if (parity === 2) {
    fill = '#0e123a'; // subtle cobalt-tinted ink
  }

  // Subtle stroke with occasional haze accent
  const isAccent = (Math.abs(row) * 3 + Math.abs(col)) % 7 === 0;
  const stroke = isAccent ? 'rgba(185, 188, 255, 0.35)' : 'rgba(36, 56, 255, 0.32)';

  return { fill, stroke };
}

function calculateHexRadius(width: number, height: number): number {
  const area = width * height;
  const targetCount = width < 768 ? 45 : width < 1200 ? 75 : 95;
  const calculatedR = Math.sqrt(area / (2.598 * targetCount));

  if (width < 768) {
    return Math.max(34, Math.min(50, Math.round(calculatedR)));
  }
  return Math.max(42, Math.min(68, Math.round(calculatedR)));
}

function buildHoneycombGrid(width: number, height: number): HoneycombGrid {
  const r = calculateHexRadius(width, height);
  const W = Math.round(Math.sqrt(3) * r * 10) / 10;
  const H = 2 * r;
  const rowStep = 1.5 * r;
  const colStep = W;

  const centerX = width / 2;
  const centerY = height / 2;

  // Margin ensures full coverage beyond viewport boundaries
  const margin = Math.ceil(H * 1.5);
  const startRow = Math.floor(-margin / rowStep);
  const endRow = Math.ceil((height + margin) / rowStep);
  const startCol = Math.floor(-margin / colStep);
  const endCol = Math.ceil((width + margin) / colStep);

  const polygonPoints = `${W * 0.5},0 ${W},${H * 0.25} ${W},${H * 0.75} ${W * 0.5},${H} 0,${H * 0.75} 0,${H * 0.25}`;

  const cells: HoneycombCell[] = [];

  for (let row = startRow; row <= endRow; row++) {
    const rowOffset = Math.abs(row) % 2 === 1 ? W / 2 : 0;
    for (let col = startCol; col <= endCol; col++) {
      const x = col * colStep + rowOffset;
      const y = row * rowStep;

      const cellCenterX = x + W / 2;
      const cellCenterY = y + H / 2;

      const dx = cellCenterX - centerX;
      const dy = cellCenterY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const dirX = dist > 0.001 ? dx / dist : 0;
      const dirY = dist > 0.001 ? dy / dist : 0;

      const { fill, stroke } = getCellColors(row, col);

      cells.push({
        id: `hex_${row}_${col}`,
        row,
        col,
        x,
        y,
        distanceFromCenter: dist,
        directionX: dirX,
        directionY: dirY,
        fill,
        stroke,
      });
    }
  }

  return {
    radius: r,
    cellWidth: W,
    cellHeight: H,
    polygonPoints,
    cells,
  };
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const { t } = useLocale();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const [isCompleted, setIsCompleted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Initialize honeycomb grid state
  const initialWidth = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const initialHeight = typeof window !== 'undefined' ? window.innerHeight : 900;
  const [grid, setGrid] = useState<HoneycombGrid>(() =>
    buildHoneycombGrid(initialWidth, initialHeight)
  );
  const gridRef = useRef<HoneycombGrid>(grid);
  gridRef.current = grid;

  // Strict mode & idempotency guards
  const onCompleteCalledRef = useRef(false);
  const exitStartedRef = useRef(false);
  const ctxRef = useRef<gsap.Context | null>(null);

  // Responsive resize handler (freezes once exit starts)
  useEffect(() => {
    let resizeTimer: number;

    const handleResize = () => {
      if (exitStartedRef.current) return;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!exitStartedRef.current) {
          const newGrid = buildHoneycombGrid(window.innerWidth, window.innerHeight);
          setGrid(newGrid);
        }
      }, 120);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Readiness orchestration & exit sequence
  useEffect(() => {
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Body scroll lock (idempotent restoration)
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

    // 1. Task Manifest
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

    const finishAndNotify = () => {
      restoreBodyOverflow();
      setIsCompleted(true);
      if (!onCompleteCalledRef.current) {
        onCompleteCalledRef.current = true;
        onComplete?.();
      }
    };

    const executeFractureExit = () => {
      if (exitStartedRef.current) return;
      exitStartedRef.current = true;
      setIsReady(true);

      const ctx = gsap.context(() => {
        if (isReducedMotion) {
          // Reduced-motion fallback: short clean fade, no fracture stagger
          gsap.to(container, {
            opacity: 0,
            duration: 0.3,
            ease: 'power1.inOut',
            onComplete: finishAndNotify,
          });
        } else {
          // 3D Honeycomb Fracture Reveal Sequence
          const tl = gsap.timeline({
            onComplete: finishAndNotify,
          });

          // Step A: Brand & counter content softly fades and scales down
          if (contentRef.current) {
            tl.to(
              contentRef.current,
              {
                opacity: 0,
                scale: 0.95,
                duration: 0.22,
                ease: 'power2.in',
              },
              0
            );
          }

          // Step B: Solid backdrop fades transparent quickly so underlying site shows through departing cells
          if (backdropRef.current) {
            tl.to(
              backdropRef.current,
              {
                opacity: 0,
                duration: 0.18,
                ease: 'power1.out',
              },
              0.04
            );
          }

          // Step C: Hex cells fracture with deterministic center-out ripple
          const currentGrid = gridRef.current;
          const maxDist = Math.max(...currentGrid.cells.map((c) => c.distanceFromCenter), 1);

          currentGrid.cells.forEach((cell) => {
            const el = cellRefs.current.get(cell.id);
            if (!el) return;

            const normDist = cell.distanceFromCenter / maxDist;
            const cellDelay = 0.08 + normDist * 0.42;

            const push = 40 + normDist * 60;
            const targetX = cell.directionX * push;
            const targetY = cell.directionY * push;
            const rotX = cell.directionY * 36;
            const rotY = -cell.directionX * 36;
            const rotZ = cell.directionX * cell.directionY * 24;

            tl.to(
              el,
              {
                x: targetX,
                y: targetY,
                z: -140 - normDist * 100,
                rotationX: rotX,
                rotationY: rotY,
                rotationZ: rotZ,
                scale: 0.38,
                opacity: 0,
                duration: 0.62,
                ease: 'power2.inOut',
              },
              cellDelay
            );
          });
        }
      }, container);

      ctxRef.current = ctx;
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
            executeFractureExit();
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

    // 2. Start Task Signals
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

    // D. fonts_ready (15s watchdog)
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
      ctxRef.current?.revert();
      restoreBodyOverflow();
    };
  }, [onComplete]);

  const cellElements = useMemo(() => {
    return grid.cells.map((cell) => (
      <div
        key={cell.id}
        ref={(el) => {
          if (el) cellRefs.current.set(cell.id, el);
          else cellRefs.current.delete(cell.id);
        }}
        className="hex-cell"
        style={{
          width: `${grid.cellWidth + 1.2}px`,
          height: `${grid.cellHeight + 1.2}px`,
          left: `${cell.x}px`,
          top: `${cell.y}px`,
        }}
      >
        <svg
          viewBox={`0 0 ${grid.cellWidth} ${grid.cellHeight}`}
          className="hex-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points={grid.polygonPoints}
            fill={cell.fill}
            stroke={cell.stroke}
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    ));
  }, [grid]);

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

      {/* Solid background plane behind honeycomb */}
      <div ref={backdropRef} className="preloader-backdrop" />

      {/* 3D Honeycomb Scene */}
      <div ref={sceneRef} className="honeycomb-scene" aria-hidden="true">
        {cellElements}
      </div>

      {/* Preloader Brand & Counter Content */}
      <div ref={contentRef} className="preloader-content">
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
