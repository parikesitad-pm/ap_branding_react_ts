import React from 'react';
import './ConsoleTrigger.css';

export interface ConsoleTriggerProps {
  onClick: () => void;
  isVisible?: boolean;
  className?: string;
}

export const ConsoleTrigger: React.FC<ConsoleTriggerProps> = ({
  onClick,
  isVisible = true,
  className = '',
}) => {
  if (!isVisible) return null;

  return (
    <button
      type="button"
      className={`console-trigger-floating ${className}`}
      onClick={onClick}
      aria-label="Open developer console (Ctrl/⌘ + `)"
      title="Open developer console (Ctrl/⌘ + `)"
      data-cursor="pointer"
    >
      <span className="console-trigger-prompt">&gt;_</span>
    </button>
  );
};

