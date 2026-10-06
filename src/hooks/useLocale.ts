import { useState, useCallback, useEffect } from 'react';
import {
  type Locale,
  type TranslationSchema,
  dictionaries,
  detectInitialLocale,
  saveLocalePreference,
} from '../i18n';

const EVENT_KEY = 'ap-locale-change';

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale);

  // Sync across hook instances when locale is switched
  useEffect(() => {
    const handleLocaleChange = (e: Event) => {
      const customEvent = e as CustomEvent<Locale>;
      if (customEvent.detail && dictionaries[customEvent.detail]) {
        setLocaleState(customEvent.detail);
      }
    };

    window.addEventListener(EVENT_KEY, handleLocaleChange);
    return () => window.removeEventListener(EVENT_KEY, handleLocaleChange);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    if (!dictionaries[nextLocale]) return;
    setLocaleState(nextLocale);
    saveLocalePreference(nextLocale);
    document.documentElement.setAttribute('lang', nextLocale);
    window.dispatchEvent(new CustomEvent<Locale>(EVENT_KEY, { detail: nextLocale }));
  }, []);

  const t: TranslationSchema = dictionaries[locale] || dictionaries.en;

  return {
    locale,
    t,
    setLocale,
  };
}
