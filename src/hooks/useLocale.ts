import { useState, useCallback, useEffect } from 'react';
import {
  type Locale,
  type TranslationSchema,
  dictionaries,
  detectInitialLocale,
  saveLocalePreference,
} from '../i18n';

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale);

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    saveLocalePreference(nextLocale);
  }, []);

  const t: TranslationSchema = dictionaries[locale] || dictionaries.en;

  return {
    locale,
    t,
    setLocale,
  };
}

