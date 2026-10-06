import React from 'react';
import { useLocale } from '../../../hooks/useLocale';
import { Button } from '../../atoms/Button/Button';
import './VideoModal.css';

export interface WatchIntroSectionProps {
  onOpenVideo: () => void;
  className?: string;
}

export const WatchIntroSection: React.FC<WatchIntroSectionProps> = ({
  onOpenVideo,
  className = '',
}) => {
  const { t } = useLocale();

  const handleTrigger = () => {
    onOpenVideo();
  };

  return (
    <section
      id="intro-video"
      className={`watch-intro-section ${className}`.trim()}
      aria-labelledby="watch-intro-heading"
    >
      <div className="watch-intro-container">
        {/* Facade Poster Card */}
        <div
          className="watch-intro-card"
          data-cursor="play"
          onClick={handleTrigger}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTrigger();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`${t.video.title}: ${t.video.subtitle}`}
        >
          {/* Atmospheric Background Geometry */}
          <div className="watch-intro-backdrop" aria-hidden="true">
            <svg
              className="intro-backdrop-grid"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="intro-grid-pattern"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="rgba(255, 61, 0, 0.08)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#intro-grid-pattern)" />
            </svg>
            <div className="intro-radial-glow" />
          </div>

          <div className="watch-intro-content">
            <div className="watch-intro-eyebrow-row">
              <span className="watch-intro-index">06 / INTRO</span>
              <span className="watch-intro-badge">45 SECONDS</span>
            </div>

            <div className="watch-intro-center">
              <div className="intro-play-disc" aria-hidden="true">
                <span className="intro-play-triangle">▶</span>
              </div>
              <h2 id="watch-intro-heading" className="watch-intro-title">
                {t.video.title}
              </h2>
              <p className="watch-intro-sub">{t.video.subtitle}</p>
            </div>

            <div className="watch-intro-action-wrap">
              <Button
                variant="primary"
                size="md"
                isMagnetic={true}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrigger();
                }}
                aria-label={t.video.cta}
              >
                {t.video.cta} ▶
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
