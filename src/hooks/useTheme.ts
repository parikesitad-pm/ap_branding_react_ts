import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ap_theme';

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

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // Ensure document attribute is in sync
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
          setTheme(newTheme);
          document.documentElement.setAttribute('data-theme', newTheme);
        }
      } catch {
        // LocalStorage inaccessible
      }
    };

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // LocalStorage inaccessible
      }
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  const setThemeExplicit = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // LocalStorage inaccessible
    }
    document.documentElement.setAttribute('data-theme', newTheme);
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme: setThemeExplicit,
  };
}
