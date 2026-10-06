import React from 'react';
import './SectionTitle.css';

export interface SectionTitleProps {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  index,
  eyebrow,
  title,
  description,
  className = '',
  as: Component = 'h2',
}) => {
  return (
    <div className={`section-title ${className}`}>
      <div className="section-title__top">
        {index && <span className="section-title__index">{index}</span>}
        {eyebrow && <span className="section-title__eyebrow">{eyebrow}</span>}
      </div>
      <Component className="section-title__heading">{title}</Component>
      {description && (
        <p className="section-title__description">{description}</p>
      )}
    </div>
  );
};

