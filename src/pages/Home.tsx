import React, { useState } from 'react';
import { PageLayout } from '../components/templates/PageLayout/PageLayout';
import { Preloader } from '../components/organisms/Preloader/Preloader';
import { Hero } from '../components/organisms/Hero/Hero';
import { Intro } from '../components/organisms/Intro/Intro';
import { Reel } from '../components/organisms/Reel/Reel';
import { siteMeta } from '../data/site';
import './Home.css';

export const Home: React.FC = () => {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setPreloaderDone(true)} />

      <PageLayout headerVariant="hero">
        <div className="home-page-flow">
          {/* F2: Hero Section */}
          <Hero isReady={preloaderDone} />

          {/* F2: Intro Section */}
          <Intro />

          {/* F3: Selected Works / Horizontal Reel */}
          <Reel />

          {/* Anchor for Disciplines (Scheduled for F5) */}
          <div id="disciplines" className="section-anchor-marker" aria-hidden="true" />
          <div id="about" className="section-anchor-marker" aria-hidden="true" />

          {/* Minimal Baseline Footer & Creator Attribution */}
          <footer id="contact" className="site-footer-baseline">
            <div className="footer-baseline-inner">
              <div className="footer-contact-brief">
                <span className="footer-owner">{siteMeta.name}</span>
                <span className="footer-email">{siteMeta.email}</span>
              </div>

              <div className="footer-attribution-section">
                <div className="attribution-colophon">
                  <span>crafted by </span>
                  <a
                    href="https://github.com/parikesitad-pm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attribution-link"
                  >
                    parikesitad-pm
                  </a>
                  <span> for Afrizal Pramudyan — a MODULA project</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </PageLayout>
    </>
  );
};
