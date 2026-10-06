import React, { useState } from 'react';
import { PageLayout } from '../components/templates/PageLayout/PageLayout';
import { Button } from '../components/atoms/Button/Button';
import { Tag } from '../components/atoms/Tag/Tag';
import { Icon } from '../components/atoms/Icon/Icon';
import { Cursor } from '../components/atoms/Cursor/Cursor';
import { SectionTitle } from '../components/molecules/SectionTitle/SectionTitle';
import { FilterChips } from '../components/molecules/FilterChips/FilterChips';
import { ProjectCaption } from '../components/molecules/ProjectCaption/ProjectCaption';
import { ProgressBar } from '../components/molecules/ProgressBar/ProgressBar';
import { siteMeta, disciplinesList } from '../data/site';
import { projects } from '../data/projects';
import type { Category } from '../data/types';
import { useLocale } from '../hooks/useLocale';
import './Home.css';

export const Home: React.FC = () => {
  const { t, locale } = useLocale();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((proj) => proj.category === activeCategory);

  const filterRatio = Math.round((filteredProjects.length / projects.length) * 100);

  return (
    <PageLayout>
      <div className="home-container" id="top">
        {/* Foundation Hero Preview */}
        <section className="foundation-hero" id="about">
          <div className="foundation-badge">
            <Tag label="F1 — Atoms & Molecules Complete" variant="accent" />
          </div>
          <h1 className="hero-name">{siteMeta.name}</h1>
          <p className="hero-title">{siteMeta.title}</p>
          <p className="hero-statement">{t.intro.statement}</p>

          <div className="hero-actions">
            <Button
              href="#work"
              variant="primary"
              size="md"
              icon={<Icon name="arrow-right" size={16} />}
            >
              {t.common.viewWork}
            </Button>
            <Button
              href="#contact"
              variant="secondary"
              size="md"
              icon={<Icon name="arrow-up-right" size={16} />}
            >
              {t.common.startProject}
            </Button>
            <Button
              variant="ghost"
              size="md"
              icon={<Icon name="globe" size={16} />}
            >
              Locale: {locale.toUpperCase()}
            </Button>
          </div>
        </section>

        {/* Disciplines Section with SectionTitle */}
        <section className="foundation-section" id="disciplines">
          <SectionTitle
            index="01"
            eyebrow="Capabilities"
            title={t.disciplines.title}
            description="From high-fidelity 3D modeling and CGI to complete multidisciplinary visual identity systems."
          />
          <div className="disciplines-grid">
            {disciplinesList.map((item) => (
              <div key={item.id} className="discipline-card">
                <div className="discipline-card__top">
                  <span className="discipline-id">{item.id.toUpperCase()}</span>
                  <Tag label="Core" variant="muted" />
                </div>
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

        {/* Selected Work Section with FilterChips, ProgressBar, and ProjectCaption */}
        <section className="foundation-section" id="work">
          <SectionTitle
            index="02"
            eyebrow="Portfolio"
            title={t.reel.title}
            description={t.reel.subtitle}
          />

          <div className="work-controls">
            <FilterChips
              active={activeCategory}
              onChange={setActiveCategory}
            />
            <div className="work-progress-wrap">
              <span className="work-progress-count">
                {filteredProjects.length} / {projects.length}
              </span>
              <ProgressBar value={filterRatio} max={100} />
            </div>
          </div>

          <div className="projects-grid">
            {filteredProjects.map((proj) => (
              <article key={proj.id} className="project-card">
                <div className="project-media-placeholder">
                  <span className="placeholder-tag">[{proj.media.type.toUpperCase()}]</span>
                  <span className="placeholder-caption">{proj.caption}</span>
                </div>
                <div className="project-meta">
                  <ProjectCaption project={proj} />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* F1 Atomic Component Showcase & Presentational Shells */}
        <section className="foundation-section atomic-showcase" aria-label="Atomic UI Verification">
          <SectionTitle
            index="03"
            eyebrow="Atomic Architecture"
            title="Design System & Shells"
            description="Verified presentational atoms, molecules, and state shells ready for future motion phases."
          />

          <div className="showcase-grid">
            <div className="showcase-box">
              <span className="showcase-box__label">Cursor Shell (F5 Ready)</span>
              <div className="cursor-demo-row">
                <div className="cursor-demo-item">
                  <Cursor mode="default" />
                  <span className="cursor-demo-title">Default</span>
                </div>
                <div className="cursor-demo-item">
                  <Cursor mode="view" />
                  <span className="cursor-demo-title">View</span>
                </div>
                <div className="cursor-demo-item">
                  <Cursor mode="drag" />
                  <span className="cursor-demo-title">Drag</span>
                </div>
                <div className="cursor-demo-item">
                  <Cursor mode="play" />
                  <span className="cursor-demo-title">Play</span>
                </div>
              </div>
            </div>

            <div className="showcase-box">
              <span className="showcase-box__label">Tag Variants</span>
              <div className="tags-demo-row">
                <Tag label="3D Modeling" variant="accent" />
                <Tag label="Graphic Design" variant="default" />
                <Tag label="Animation" variant="muted" />
                <Tag label="2026" variant="default" />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Footer Baseline */}
        <footer className="foundation-footer" id="contact">
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
