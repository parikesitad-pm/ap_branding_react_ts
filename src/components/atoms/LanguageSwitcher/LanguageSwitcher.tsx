import React from 'react';
import { useLocale } from '../../../hooks/useLocale';
import { SUPPORTED_LOCALES, type Locale } from '../../../i18n';
import './LanguageSwitcher.css';

export interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { locale, setLocale, t } = useLocale();

  return (
    <nav
      className={`language-switcher ${className}`}
      aria-label={t.a11y.switchLanguage}
    >
      {SUPPORTED_LOCALES.map(({ code, label }) => {
        const isActive = locale === code;
        return (
          <button
            key={code}
            type="button"
            className={`lang-btn ${isActive ? 'is-active' : ''}`}
            onClick={() => setLocale(code as Locale)}
            aria-pressed={isActive}
            aria-label={`${label} (${code})`}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
};

