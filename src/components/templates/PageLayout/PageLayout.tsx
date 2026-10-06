import React from 'react';
import { Header } from '../../organisms/Header/Header';
import { Cursor } from '../../atoms/Cursor/Cursor';
import { useLenis } from '../../../hooks/useLenis';
import './PageLayout.css';

export interface PageLayoutProps {
  children: React.ReactNode;
  headerVariant?: 'default' | 'hero';
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  headerVariant = 'hero',
}) => {
  // Initialize Lenis smooth scroll synchronized with GSAP ticker & ScrollTrigger
  useLenis();

  return (
    <div className="page-layout">
      <Cursor />
      <Header variant={headerVariant} />
      <main className="page-main" id="main-content">
        {children}
      </main>
    </div>
  );
};
