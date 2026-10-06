import React from 'react';
import { ThemeToggle } from '../../atoms/ThemeToggle/ThemeToggle';
import { LanguageSwitcher } from '../../atoms/LanguageSwitcher/LanguageSwitcher';
import { useLenis } from '../../../hooks/useLenis';
import './PageLayout.css';

export interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  // Initialize Lenis smooth scroll
  useLenis();

  return (
    <div className="page-layout">
      <header className="page-header" role="banner">
        <div className="header-left">
          <span className="brand-badge">AP</span>
        </div>
        <div className="header-right">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>
      <main className="page-main" id="main-content">
        {children}
      </main>
    </div>
  );
};

