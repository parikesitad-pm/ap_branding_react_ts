import React from 'react';
import './Icon.css';

export type IconName =
  | 'arrow-up-right'
  | 'arrow-right'
  | 'arrow-left'
  | 'sun'
  | 'moon'
  | 'globe'
  | 'menu'
  | 'close';

export interface IconProps {
  name: IconName;
  size?: number | string;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = true,
}) => {
  const isAriaHidden = ariaLabel ? false : ariaHidden;

  const renderPath = () => {
    switch (name) {
      case 'arrow-up-right':
        return (
          <path
            d="M7 17L17 7M17 7H7M17 7V17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'arrow-right':
        return (
          <path
            d="M5 12H19M19 12L12 5M19 12L12 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'arrow-left':
        return (
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'sun':
        return (
          <>
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M6.34 17.66L4.93 19.07M19.07 4.93L17.66 6.34"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </>
        );
      case 'moon':
        return (
          <path
            d="M12 3A6 6 0 0 0 21 12A9 9 0 1 1 12 3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      case 'globe':
        return (
          <>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path
              d="M3.6 9H20.4M3.6 15H20.4M12 3C14.5 5.5 16 8.5 16 12C16 15.5 14.5 18.5 12 21C9.5 18.5 8 15.5 8 12C8 8.5 9.5 5.5 12 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        );
      case 'menu':
        return (
          <path
            d="M4 6H20M4 12H20M4 18H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      case 'close':
        return (
          <path
            d="M6 18L18 6M6 6L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      default:
        return null;
    }
  };

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={`app-icon app-icon--${name} ${className}`}
      aria-hidden={isAriaHidden ? 'true' : undefined}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : 'presentation'}
    >
      {renderPath()}
    </svg>
  );
};
