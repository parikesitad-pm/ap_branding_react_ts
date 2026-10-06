import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '../../../lib/gsap';
import './Cursor.css';

export type CursorMode = 'default' | 'view' | 'drag' | 'play' | 'external';

export interface CursorProps {
  className?: string;
}

export const Cursor: React.FC<CursorProps> = ({ className = '' }) => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<CursorMode>('default');
  const [label, setLabel] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Desktop fine pointer check and reduced-motion check
    const isFinePointer =
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer) {
      return;
    }

    setIsEnabled(true);
    document.documentElement.classList.add('custom-cursor-enabled');

    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    // Use GSAP quickTo for smooth performance without continuous RAF loops
    const xTo = gsap.quickTo(cursorEl, 'x', { duration: 0.18, ease: 'power2.out' });
    const yTo = gsap.quickTo(cursorEl, 'y', { duration: 0.18, ease: 'power2.out' });

    const handlePointerMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Resolve cursor mode based on target element hierarchy
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Modal or dialog check: fallback to default to avoid obstructing controls
      if (target.closest('[role="dialog"]') || target.closest('.cli-dialog-backdrop')) {
        setMode('default');
        setLabel(null);
        return;
      }

      const cursorTarget = target.closest<HTMLElement>('[data-cursor]');
      if (cursorTarget) {
        const targetMode = cursorTarget.getAttribute('data-cursor') as CursorMode;
        const targetLabel = cursorTarget.getAttribute('data-cursor-label');
        setMode(targetMode || 'default');
        setLabel(targetLabel || null);
        return;
      }

      // Check for external links
      const link = target.closest<HTMLAnchorElement>('a');
      if (link && (link.target === '_blank' || link.getAttribute('rel')?.includes('external'))) {
        setMode('external');
        setLabel(null);
        return;
      }

      // Reset to default
      setMode('default');
      setLabel(null);
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
    };

    const handlePointerEnter = () => {
      setIsVisible(true);
    };

    // Custom event to allow components to request modes programmatically
    const handleCustomCursorMode = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode: CursorMode; label?: string }>;
      if (customEvent.detail) {
        setMode(customEvent.detail.mode || 'default');
        setLabel(customEvent.detail.label || null);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('pointerenter', handlePointerEnter);
    window.addEventListener('ap-cursor-mode', handleCustomCursorMode);

    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled');
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
      window.removeEventListener('ap-cursor-mode', handleCustomCursorMode);
    };
  }, [isVisible]);

  if (!isEnabled) {
    return null;
  }

  const displayLabel = label || (mode !== 'default' ? mode.toUpperCase() : undefined);

  return (
    <div
      ref={cursorRef}
      className={`app-cursor app-cursor--${mode} ${isVisible ? 'is-visible' : 'is-hidden'} ${className}`}
      aria-hidden="true"
    >
      <div className="app-cursor__pointer" />
      {displayLabel && (
        <span className="app-cursor__label">{displayLabel}</span>
      )}
    </div>
  );
};
