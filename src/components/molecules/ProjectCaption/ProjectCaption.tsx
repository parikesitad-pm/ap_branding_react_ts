import React from 'react';
import type { Project } from '../../../data/types';
import { Tag } from '../../atoms/Tag/Tag';
import { useLocale } from '../../../hooks/useLocale';
import './ProjectCaption.css';

export interface ProjectCaptionProps {
  project: Project;
  className?: string;
}

export const ProjectCaption: React.FC<ProjectCaptionProps> = ({
  project,
  className = '',
}) => {
  const { t } = useLocale();

  const getCategoryLabel = (category: Project['category']): string => {
    switch (category) {
      case 'graphic':
        return t.categories.graphic;
      case '3d':
        return t.categories['3d'];
      case 'animation':
        return t.categories.animation;
      case 'photo':
        return t.categories.photo;
      default:
        return category;
    }
  };

  return (
    <div className={`project-caption ${className}`}>
      <div className="project-caption__header">
        <h3 className="project-caption__title">{project.title}</h3>
        <span className="project-caption__year">{project.year}</span>
      </div>

      {project.caption && (
        <p className="project-caption__desc">{project.caption}</p>
      )}

      <div className="project-caption__tags">
        <Tag label={getCategoryLabel(project.category)} variant="accent" />
        <Tag label={project.media.type.toUpperCase()} variant="default" />
      </div>
    </div>
  );
};
