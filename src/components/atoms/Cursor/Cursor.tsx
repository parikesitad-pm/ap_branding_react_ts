import React from 'react';
import './Cursor.css';

export type CursorMode = 'default' | 'view' | 'drag' | 'play' | 'external';

export interface CursorProps {
  mode?: CursorMode;
  label?: string;
  visible?: boolean;
  className?: string;
}

export const Cursor: React.FC<CursorProps> = ({
  mode = 'default',
  label,
  visible = true,
  className = '',
}) => {
  if (!visible) return null;

  const displayLabel = label || (mode !== 'default' ? mode.toUpperCase() : undefined);

  return (
    <div
      className={`app-cursor app-cursor--${mode} ${className}`}
      aria-hidden="true"
    >
      <div className="app-cursor__pointer" />
      {displayLabel && (
        <span className="app-cursor__label">{displayLabel}</span>
      )}
    </div>
  );
};

