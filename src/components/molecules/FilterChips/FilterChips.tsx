import React from 'react';
import { Chip } from '../../atoms/Chip/Chip';
import type { Category } from '../../../data/types';
import { useLocale } from '../../../hooks/useLocale';
import './FilterChips.css';

export interface FilterChipsProps {
  active: Category | 'all';
  onChange: (category: Category | 'all') => void;
  className?: string;
  labels?: Partial<Record<Category | 'all', string>>;
}

const CATEGORIES: (Category | 'all')[] = [
  'all',
  'graphic',
  '3d',
  'animation',
  'photo',
];

export const FilterChips: React.FC<FilterChipsProps> = ({
  active,
  onChange,
  className = '',
  labels,
}) => {
  const { t } = useLocale();

  const getLabel = (cat: Category | 'all'): string => {
    if (labels && labels[cat]) {
      return labels[cat]!;
    }
    switch (cat) {
      case 'all':
        return t.categories.all;
      case 'graphic':
        return t.categories.graphic;
      case '3d':
        return t.categories['3d'];
      case 'animation':
        return t.categories.animation;
      case 'photo':
        return t.categories.photo;
      default:
        return cat;
    }
  };

  return (
    <div
      className={`filter-chips ${className}`}
      role="group"
      aria-label={t.reel.filterAll}
    >
      {CATEGORIES.map((cat) => (
        <Chip
          key={cat}
          label={getLabel(cat)}
          active={active === cat}
          onClick={() => onChange(cat)}
        />
      ))}
    </div>
  );
};

