import React from 'react';
import { Header } from '../../organisms/Header/Header';
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
      <Header />
      <main className="page-main" id="main-content">
        {children}
      </main>
    </div>
  );
};
