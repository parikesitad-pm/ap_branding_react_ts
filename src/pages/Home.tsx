import React, { useState } from 'react';
import { PageLayout } from '../components/templates/PageLayout/PageLayout';
import { Preloader } from '../components/organisms/Preloader/Preloader';
import { Hero } from '../components/organisms/Hero/Hero';
import { Intro } from '../components/organisms/Intro/Intro';
import { Tag } from '../components/atoms/Tag/Tag';
import { siteMeta } from '../data/site';
import { useLocale } from '../hooks/useLocale';
import './Home.css';

export const Home: React.FC = () => {
  const { t } = useLocale();
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

          {/* Temporary Boundary for Selected Works (Scheduled for F3) */}
          <section id="work" className="future-work-boundary" aria-label="Work Rail">
            <div className="future-work-boundary__inner">
              <div className="future-work-boundary__badge">
                <Tag label="F3 SCHEDULED" variant="accent" />
              </div>
              <h2 className="future-work-title">{t.common.selectedWorksPlaceholder}</h2>
              <p className="future-work-desc">{t.reel.subtitle}</p>
            </div>
          </section>

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
