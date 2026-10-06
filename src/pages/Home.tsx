import React from 'react';
import { PageLayout } from '../components/templates/PageLayout/PageLayout';
import { siteMeta, disciplinesList } from '../data/site';
import { projects } from '../data/projects';
import { useLocale } from '../hooks/useLocale';
import './Home.css';

export const Home: React.FC = () => {
  const { t, locale } = useLocale();

  return (
    <PageLayout>
      <div className="home-container">
        {/* Foundation Hero Preview */}
        <section className="foundation-hero">
          <div className="foundation-badge">Phase F0 — Foundation Baseline</div>
          <h1 className="hero-name">{siteMeta.name}</h1>
          <p className="hero-title">{siteMeta.title}</p>
          <p className="hero-statement">{t.intro.statement}</p>
          <div className="locale-indicator">
            Active Locale: <code>{locale}</code>
          </div>
        </section>

        {/* Disciplines Data Verification */}
        <section className="foundation-section">
          <h2 className="section-heading">{t.disciplines.title}</h2>
          <div className="disciplines-grid">
            {disciplinesList.map((item) => (
              <div key={item.id} className="discipline-card">
                <span className="discipline-id">{item.id.toUpperCase()}</span>
                <h3 className="discipline-name">
                  {item.id === '3d' && t.disciplines.d3d.title}
                  {item.id === 'graphic' && t.disciplines.graphic.title}
                  {item.id === 'animation' && t.disciplines.animation.title}
                  {item.id === 'photo' && t.disciplines.photo.title}
                  {item.id === 'videography' && t.disciplines.videography.title}
                </h3>
                <p className="discipline-desc">
                  {item.id === '3d' && t.disciplines.d3d.desc}
                  {item.id === 'graphic' && t.disciplines.graphic.desc}
                  {item.id === 'animation' && t.disciplines.animation.desc}
                  {item.id === 'photo' && t.disciplines.photo.desc}
                  {item.id === 'videography' && t.disciplines.videography.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Typed Projects Data Verification */}
        <section className="foundation-section">
          <h2 className="section-heading">{t.reel.title}</h2>
          <p className="section-sub">{t.reel.subtitle}</p>
          <div className="projects-grid">
            {projects.map((proj) => (
              <article key={proj.id} className="project-card">
                <div className="project-media-placeholder">
                  <span className="placeholder-tag">[{proj.media.type.toUpperCase()}]</span>
                  <span className="placeholder-caption">{proj.caption}</span>
                </div>
                <div className="project-meta">
                  <h3 className="project-title">{proj.title}</h3>
                  <div className="project-details">
                    <span className="project-cat">{proj.category}</span>
                    <span className="project-year">{proj.year}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Contact Footer Baseline */}
        <footer className="foundation-footer">
          <h2 className="footer-title">{t.contact.title}</h2>
          <p className="footer-lead">{t.contact.lead}</p>
          <div className="footer-meta">
            <span className="footer-email">{siteMeta.email}</span>
            <div className="footer-socials">
              {siteMeta.socials.map((s) => (
                <span key={s.label} className="footer-social-item">
                  {s.label}: {s.url}
                </span>
              ))}
            </div>
          </div>

          {/* Canonical Creator Attribution & Subtle Developer CTA */}
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

            <aside className="developer-cta">
              <span className="developer-cta-lead">Need your own profile page?</span>
              <span className="developer-cta-types">
                Personal site · Online Business Card · Personal Branding
              </span>
              <a
                href="https://wa.me/6282298503412"
                target="_blank"
                rel="noopener noreferrer"
                className="developer-cta-link"
              >
                Let&apos;s build yours &rarr;
              </a>
            </aside>
          </div>
        </footer>
      </div>
    </PageLayout>
  );
};

