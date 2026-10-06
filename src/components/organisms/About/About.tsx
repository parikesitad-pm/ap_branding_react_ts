import React from 'react';
import { timelineEntries } from '../../../data/timeline';
import { useLocale } from '../../../hooks/useLocale';
import type { TimelineEntry } from '../../../data/types';
import './About.css';

export interface AboutProps {
  className?: string;
}

export const About: React.FC<AboutProps> = ({ className = '' }) => {
  const { t } = useLocale();

  const getTimelineCopy = (entry: TimelineEntry) => {
    switch (entry.id) {
      case 'timeline-01':
        return t.timeline.entry1;
      case 'timeline-02':
        return t.timeline.entry2;
      case 'timeline-03':
      default:
        return t.timeline.entry3;
    }
  };

  return (
    <section
      id="about"
      className={`about-section ${className}`.trim()}
      aria-labelledby="about-heading"
    >
      <div className="about-container">
        {/* Section Index & Eyebrow */}
        <header className="about-header">
          <span className="about-index">05 / PERSPECTIVE</span>
          <h2 id="about-heading" className="about-title sr-only">
            {t.about.title}
          </h2>
        </header>

        {/* Editorial Grid Layout */}
        <div className="about-grid">
          {/* Left Column: Big Editorial Statement & Facts */}
          <div className="about-editorial-col">
            <div className="about-subject-badge">
              <span className="about-subject-name">{t.about.eyebrow}</span>
              <span className="about-subject-divider">/</span>
              <span className="about-subject-role">{t.hero.eyebrow}</span>
            </div>

            <h3 className="about-statement">
              {t.about.headline}
            </h3>

            <p className="about-bio-text">
              {t.about.bio}
            </p>

            {/* Factual Highlights Box */}
            <div className="about-meta-grid">
              <div className="about-meta-item">
                <span className="about-meta-label">{t.about.locationLabel}</span>
                <span className="about-meta-val">{t.about.locationValue}</span>
              </div>
              <div className="about-meta-item">
                <span className="about-meta-label">{t.about.disciplinesLabel}</span>
                <span className="about-meta-val">3D · CGI · Motion · Graphic · Photo</span>
              </div>
            </div>
          </div>

          {/* Right Column: Minimal Editorial Timeline */}
          <div className="about-timeline-col">
            <h4 className="about-timeline-title">
              {t.about.milestonesTitle}
            </h4>

            <div className="about-timeline-list" role="list">
              {timelineEntries.map((entry) => {
                const entryCopy = getTimelineCopy(entry);
                return (
                  <article
                    key={entry.id}
                    className="timeline-item"
                    role="listitem"
                  >
                    <div className="timeline-item-meta">
                      <span className="timeline-year">{entry.year}</span>
                    </div>
                    <div className="timeline-item-content">
                      <h5 className="timeline-item-title">{entryCopy.title}</h5>
                      <span className="timeline-item-role">{entryCopy.role}</span>
                      <p className="timeline-item-desc">{entryCopy.desc}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

