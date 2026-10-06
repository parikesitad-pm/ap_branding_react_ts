import { useState, useEffect } from 'react';

/**
 * Lightweight custom hook for typewriter text animation
 * @param text The complete string to type out
 * @param speedMs Interval between characters in milliseconds
 * @param startDelayMs Delay before typing starts in milliseconds
 */
export function useTypewriter(
  text: string,
  speedMs: number = 35,
  startDelayMs: number = 0
): string {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    // If reduced-motion is preferred, render text immediately
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayText(text);
      return;
    }

    let index = 0;
    let intervalId: number | null = null;
    setDisplayText('');

    const delayId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          if (intervalId) window.clearInterval(intervalId);
        }
      }, speedMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(delayId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [text, speedMs, startDelayMs]);

  return displayText;
}

