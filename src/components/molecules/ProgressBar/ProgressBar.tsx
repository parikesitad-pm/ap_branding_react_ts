import React from 'react';
import { useLocale } from '../../../hooks/useLocale';
import './ProgressBar.css';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  className = '',
}) => {
  const { t } = useLocale();

  const safeMax = max > 0 ? max : 100;
  const clampedValue = Math.min(Math.max(0, value), safeMax);
  const ratio = clampedValue / safeMax;

  return (
    <div
      className={`app-progress ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(clampedValue)}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-label={label || t.a11y.progress}
    >
      <div
        className="app-progress__bar"
        style={{ transform: `scaleX(${ratio})` }}
      />
    </div>
  );
};
