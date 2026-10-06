import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ap_theme';
const EVENT_KEY = 'ap-theme-change';

function getSystemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    // LocalStorage inaccessible
  }
  return getSystemTheme();
}

function applyThemeWithTransition(nextTheme: Theme, callback: () => void) {
  // If View Transitions API is supported, use it for circular / smooth transition
  const doc = document as unknown as {
    startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
  };

  if (typeof doc.startViewTransition === 'function') {
    doc.startViewTransition(() => {
      callback();
      document.documentElement.setAttribute('data-theme', nextTheme);
    });
  } else {
    // Graceful fallback with short class-based fade
    document.documentElement.classList.add('theme-transitioning');
    callback();
    document.documentElement.setAttribute('data-theme', nextTheme);
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 250);
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Sync across instances via window custom event
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<Theme>;
      if (customEvent.detail && (customEvent.detail === 'light' || customEvent.detail === 'dark')) {
        setThemeState(customEvent.detail);
      }
    };

    window.addEventListener(EVENT_KEY, handleThemeChange);
    return () => window.removeEventListener(EVENT_KEY, handleThemeChange);
  }, []);

  // Ensure document attribute is in sync on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Listen for OS scheme changes if not explicitly overridden by user
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
          const newTheme = e.matches ? 'dark' : 'light';
          setThemeState(newTheme);
          document.documentElement.setAttribute('data-theme', newTheme);
          window.dispatchEvent(new CustomEvent<Theme>(EVENT_KEY, { detail: newTheme }));
        }
      } catch {
        // LocalStorage inaccessible
      }
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const setThemeExplicit = useCallback((newTheme: Theme) => {
    applyThemeWithTransition(newTheme, () => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch {
        // LocalStorage inaccessible
      }
      window.dispatchEvent(new CustomEvent<Theme>(EVENT_KEY, { detail: newTheme }));
    });
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setThemeExplicit(next);
  }, [theme, setThemeExplicit]);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme: setThemeExplicit,
  };
}
