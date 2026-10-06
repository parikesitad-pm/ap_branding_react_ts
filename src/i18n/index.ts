import type { Locale, TranslationSchema } from './types';
import { en } from './en';
import { zhCN } from './zh-CN';
import { ja } from './ja';
import { ko } from './ko';

export * from './types';

export const dictionaries: Record<Locale, TranslationSchema> = {
  en,
  'zh-CN': zhCN,
  ja,
  ko,
};

export const SUPPORTED_LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'zh-CN', label: '简' },
  { code: 'ja', label: '日' },
  { code: 'ko', label: '한' },
];

const STORAGE_KEY = 'ap_locale';

export function detectInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && saved in dictionaries) {
      return saved;
    }
  } catch {
    // LocalStorage inaccessible
  }

  if (typeof navigator !== 'undefined' && navigator.language) {
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith('zh')) return 'zh-CN';
    if (lang.startsWith('ja')) return 'ja';
    if (lang.startsWith('ko')) return 'ko';
  }

  return 'en';
}

export function saveLocalePreference(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.setAttribute('lang', locale);
  } catch {
    // LocalStorage inaccessible
  }
}
