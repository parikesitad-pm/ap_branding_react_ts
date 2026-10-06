import React from 'react';
import './Chip.css';

export interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  onClick,
  className = '',
  'aria-label': ariaLabel,
}) => {
  return (
    <button
      type="button"
      className={`app-chip ${active ? 'app-chip--active' : ''} ${className}`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel || label}
    >
      <span className="app-chip__label">{label}</span>
    </button>
  );
};

