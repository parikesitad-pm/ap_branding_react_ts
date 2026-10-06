import React, { useState } from 'react';
import type { Discipline, Category } from '../../../data/types';
import { disciplinesList } from '../../../data/site';
import { useLocale } from '../../../hooks/useLocale';
import './Disciplines.css';

export interface DisciplinesProps {
  className?: string;
}

export const Disciplines: React.FC<DisciplinesProps> = ({ className = '' }) => {
  const { t } = useLocale();
  const [hoveredDiscipline, setHoveredDiscipline] = useState<Discipline | null>(null);

  const handleRowClick = (disciplineId: Discipline) => {
    // Connect to Reel for available categories
    if (disciplineId === 'videography') {
      // Videography has no published standalone projects yet (no fake artwork policy).
      // Informational row, gently scroll to contact if intent is commissioning.
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    const categoryMap: Record<Exclude<Discipline, 'videography'>, Category> = {
      graphic: 'graphic',
      '3d': '3d',
      animation: 'animation',
      photo: 'photo',
    };

    const targetCategory = categoryMap[disciplineId];
    if (targetCategory) {
      window.dispatchEvent(
        new CustomEvent('ap-filter-reel', {
          detail: { category: targetCategory },
        })
      );

      const workSection = document.getElementById('work');
      if (workSection) {
        workSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getDisciplineCopy = (id: Discipline) => {
    switch (id) {
      case 'graphic':
        return t.disciplines.graphic;
      case '3d':
        return t.disciplines.d3d;
      case 'animation':
        return t.disciplines.animation;
      case 'photo':
        return t.disciplines.photo;
      case 'videography':
        return t.disciplines.videography;
    }
  };

  return (
    <section
      id="disciplines"
      className={`disciplines-section ${className}`.trim()}
      aria-labelledby="disciplines-heading"
    >
      <div className="disciplines-container">
        {/* Section Header */}
        <header className="disciplines-header">
          <div className="disciplines-eyebrow-wrap">
            <span className="disciplines-index text-strobo">04 / PRACTICE</span>
            <h2 id="disciplines-heading" className="disciplines-title">
              {t.disciplines.title}
            </h2>
          </div>
          <p className="disciplines-subhead">
            5 mediums. One cohesive visual vocabulary across print, dimension, motion, and lens.
          </p>
        </header>

        {/* Interactive Discipline Rows */}
        <div className="disciplines-list" role="list">
          {disciplinesList.map((item, index) => {
            const copy = getDisciplineCopy(item.id);
            const isHovered = hoveredDiscipline === item.id;
            const isVideo = item.id === 'videography';

            return (
              <div
                key={item.id}
                role="listitem"
                className={`discipline-row discipline-row--${item.id} ${
                  isHovered ? 'is-hovered' : ''
                }`}
                onPointerEnter={() => setHoveredDiscipline(item.id)}
                onPointerLeave={() => setHoveredDiscipline(null)}
                onClick={() => handleRowClick(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRowClick(item.id);
                  }
                }}
                tabIndex={0}
                aria-label={`${copy.title}: ${copy.desc}. ${
                  isVideo ? t.disciplines.infoOnly : t.disciplines.viewInReel
                }`}
              >
                {/* Index + Title Column */}
                <div className="discipline-col-left">
                  <span className="discipline-num">0{index + 1}</span>
                  <div className="discipline-title-wrap">
                    <h3 className="discipline-title">{copy.title}</h3>
                    {isVideo ? (
                      <span className="discipline-status-pill">{t.disciplines.infoOnly}</span>
                    ) : (
                      <span className="discipline-action-pill">{t.disciplines.viewInReel} ↗</span>
                    )}
                  </div>
                </div>

                {/* Unique Motion Graphic / Vocabulary Preview per Discipline */}
                <div className="discipline-col-visual" aria-hidden="true">
                  {item.id === 'graphic' && (
                    <div className="discipline-visual-graphic">
                      <div className="visual-graphic-layer layer-back" />
                      <div className="visual-graphic-layer layer-front">
                        <span className="visual-graphic-text">TYPE & GRID</span>
                      </div>
                    </div>
                  )}

                  {item.id === '3d' && (
                    <div className="discipline-visual-3d">
                      <svg viewBox="0 0 80 80" className="visual-3d-orbit">
                        <ellipse cx="40" cy="40" rx="34" ry="14" className="orbit-ring orbit-ring--a" />
                        <ellipse cx="40" cy="40" rx="14" ry="34" className="orbit-ring orbit-ring--b" />
                        <circle cx="40" cy="40" r="5" className="orbit-core" />
                      </svg>
                    </div>
                  )}

                  {item.id === 'animation' && (
                    <div className="discipline-visual-anim">
                      <span className="anim-bar anim-bar--1" />
                      <span className="anim-bar anim-bar--2" />
                      <span className="anim-bar anim-bar--3" />
                      <span className="anim-bar anim-bar--4" />
                    </div>
                  )}

                  {item.id === 'photo' && (
                    <div className="discipline-visual-photo">
                      <div className="photo-viewfinder">
                        <span className="corner corner--tl" />
                        <span className="corner corner--tr" />
                        <span className="corner corner--bl" />
                        <span className="corner corner--br" />
                        <div className="photo-focus-dot" />
                      </div>
                    </div>
                  )}

                  {item.id === 'videography' && (
                    <div className="discipline-visual-video">
                      <div className="video-letterbox">
                        <div className="video-bar-top" />
                        <div className="video-cue-play">▶</div>
                        <div className="video-bar-bottom" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Description Column */}
                <div className="discipline-col-right">
                  <p className="discipline-desc">{copy.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

