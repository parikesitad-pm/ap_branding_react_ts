import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
  'aria-label'?: string;
}

export type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

export type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className = '',
  children,
  'aria-label': ariaLabel,
  ...rest
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    'magnetic-wrap',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <span className="btn__content magnetic-inner">
      {icon && iconPosition === 'left' && <span className="btn__icon">{icon}</span>}
      {children && <span className="btn__text">{children}</span>}
      {icon && iconPosition === 'right' && <span className="btn__icon">{icon}</span>}
    </span>
  );

  if ('href' in rest && rest.href) {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const { type = 'button', disabled, ...buttonRest } = rest as ButtonAsButton;
  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
      {...buttonRest}
    >
      {content}
    </button>
  );
};
