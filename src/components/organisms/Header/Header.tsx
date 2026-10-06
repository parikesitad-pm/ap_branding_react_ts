import React, { useState } from 'react';
import { NavLink } from '../../molecules/NavLink/NavLink';
import { ThemeToggle } from '../../atoms/ThemeToggle/ThemeToggle';
import { LanguageSwitcher } from '../../atoms/LanguageSwitcher/LanguageSwitcher';
import { Icon } from '../../atoms/Icon/Icon';
import { useLocale } from '../../../hooks/useLocale';
import './Header.css';

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { t } = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`site-header ${className}`} role="banner">
      <div className="site-header__inner">
        {/* Brand Mark */}
        <a href="#top" className="site-header__brand" aria-label="Afrizal Pramudyan">
          AP
        </a>

        {/* Desktop Navigation */}
        <nav className="site-header__nav" aria-label="Main Navigation">
          <ul className="site-header__menu">
            <li>
              <NavLink href="#work" label={t.nav.work} />
            </li>
            <li>
              <NavLink href="#disciplines" label={t.nav.disciplines} />
            </li>
            <li>
              <NavLink href="#about" label={t.nav.about} />
            </li>
            <li>
              <NavLink href="#contact" label={t.nav.contact} />
            </li>
          </ul>
        </nav>

        {/* Actions (Language, Theme, Mobile toggle) */}
        <div className="site-header__actions">
          <LanguageSwitcher />
          <ThemeToggle />

          <button
            type="button"
            className="site-header__mobile-toggle"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? t.a11y.menuClose : t.a11y.menuOpen}
          >
            <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Disclosure Menu */}
      {isMobileMenuOpen && (
        <nav
          className="site-header__mobile-menu"
          aria-label="Mobile Navigation"
        >
          <ul className="site-header__mobile-list">
            <li>
              <NavLink href="#work" label={t.nav.work} onClick={closeMobileMenu} />
            </li>
            <li>
              <NavLink href="#disciplines" label={t.nav.disciplines} onClick={closeMobileMenu} />
            </li>
            <li>
              <NavLink href="#about" label={t.nav.about} onClick={closeMobileMenu} />
            </li>
            <li>
              <NavLink href="#contact" label={t.nav.contact} onClick={closeMobileMenu} />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};
