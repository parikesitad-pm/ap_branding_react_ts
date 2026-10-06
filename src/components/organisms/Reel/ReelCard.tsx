import React from 'react';
import type { Project } from '../../../data/types';
import { ProjectCaption } from '../../molecules/ProjectCaption/ProjectCaption';
import './Reel.css';

export interface ReelCardProps {
  project: Project;
  index: number;
}

export const ReelCard: React.FC<ReelCardProps> = ({ project, index }) => {
  const is3D = project.category === '3d';
  const layout = project.reelLayout || 'portrait';
  const alignment = project.alignment || 'center';

  return (
    <article
      className={`reel-card reel-card--${layout} reel-card--align-${alignment} ${
        is3D ? 'reel-card--3d' : ''
      }`}
      data-category={project.category}
      data-layout={layout}
      data-index={index + 1}
      data-cursor="view"
      tabIndex={0}
      aria-label={`${project.title} (${project.year})`}
    >
      <div className="reel-card__inner">
        {/* Visual Media Placeholder Box */}
        <div className="reel-card__media" aria-hidden="true">
          <div className="reel-card__media-surface">
            {/* Architectural Wireframe Grid Overlay */}
            <svg
              className="reel-card__grid-svg"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id={`grid-${project.id}`}
                  width="32"
                  height="32"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 32 0 L 0 0 0 32"
                    fill="none"
                    stroke="rgba(185, 188, 255, 0.08)"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#grid-${project.id})`} />
            </svg>

            {/* Geometry Silhouette based on Category */}
            <div className="reel-card__placeholder-graphic">
              {is3D ? (
                /* 3D Wireframe Cube Vector */
                <svg
                  className="reel-card__wireframe-icon reel-card__wireframe-icon--3d"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <polygon points="50,15 85,32 50,50 15,32" stroke="var(--flare)" />
                  <polygon points="15,32 50,50 50,85 15,68" stroke="var(--haze)" />
                  <polygon points="85,32 50,50 50,85 85,68" stroke="var(--haze)" />
                  <line x1="50" y1="50" x2="50" y2="85" stroke="var(--flare)" strokeDasharray="3 3" />
                  {/* Focus corners */}
                  <path d="M 5,20 L 5,5 L 20,5" stroke="var(--flare)" strokeWidth="1.5" />
                  <path d="M 80,5 L 95,5 L 95,20" stroke="var(--flare)" strokeWidth="1.5" />
                  <path d="M 5,80 L 5,95 L 20,95" stroke="var(--flare)" strokeWidth="1.5" />
                  <path d="M 80,95 L 95,95 L 95,80" stroke="var(--flare)" strokeWidth="1.5" />
                </svg>
              ) : project.category === 'animation' ? (
                /* Animation Keyframe Timeline Vector */
                <svg
                  className="reel-card__wireframe-icon"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <rect x="18" y="25" width="64" height="50" rx="4" stroke="var(--haze)" />
                  <polygon points="44,40 62,50 44,60" fill="rgba(185, 188, 255, 0.2)" stroke="var(--haze)" />
                  <circle cx="28" cy="85" r="3" fill="var(--flare)" />
                  <line x1="31" y1="85" x2="72" y2="85" stroke="var(--haze)" strokeDasharray="4 4" />
                  <circle cx="72" cy="85" r="3" fill="var(--haze)" />
                </svg>
              ) : project.category === 'photo' ? (
                /* Photography Aperture/Frame Vector */
                <svg
                  className="reel-card__wireframe-icon"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <circle cx="50" cy="50" r="32" stroke="var(--haze)" />
                  <circle cx="50" cy="50" r="16" stroke="var(--flare)" strokeDasharray="4 2" />
                  <line x1="18" y1="50" x2="82" y2="50" stroke="rgba(185, 188, 255, 0.2)" />
                  <line x1="50" y1="18" x2="50" y2="82" stroke="rgba(185, 188, 255, 0.2)" />
                </svg>
              ) : (
                /* Graphic Typography / Swiss Grid Vector */
                <svg
                  className="reel-card__wireframe-icon"
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <rect x="20" y="15" width="60" height="70" stroke="var(--haze)" />
                  <line x1="30" y1="30" x2="70" y2="30" stroke="var(--flare)" strokeWidth="2" />
                  <line x1="30" y1="42" x2="60" y2="42" stroke="var(--haze)" />
                  <line x1="30" y1="52" x2="65" y2="52" stroke="var(--haze)" />
                  <line x1="30" y1="62" x2="50" y2="62" stroke="var(--haze)" />
                </svg>
              )}

              {/* Literal Placeholder Label */}
              <div className="reel-card__placeholder-label">
                <span className="reel-card__placeholder-badge">
                  {project.caption || project.title}
                </span>
                <span className="reel-card__placeholder-type text-strobo-glitch">
                  {is3D ? 'GLB POSTER PREVIEW' : `${project.category.toUpperCase()} ASSET PENDING`}
                </span>
              </div>
            </div>

            {/* Index Watermark */}
            <div className="reel-card__watermark" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Typed Metadata Caption */}
        <div className="reel-card__caption-wrap">
          <ProjectCaption project={project} className="reel-card__caption" />
        </div>
      </div>
    </article>
  );
};

