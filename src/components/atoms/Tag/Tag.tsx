import React from 'react';
import './Tag.css';

export type TagVariant = 'default' | 'accent' | 'muted';

export interface TagProps {
  label: string;
  variant?: TagVariant;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  label,
  variant = 'default',
  className = '',
}) => {
  return (
    <span className={`app-tag app-tag--${variant} ${className}`}>
      {label}
    </span>
  );
};
