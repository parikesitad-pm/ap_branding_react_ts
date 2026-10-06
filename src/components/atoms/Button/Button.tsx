import React, { useRef } from 'react';
import { gsap } from '../../../lib/gsap';
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
  isMagnetic?: boolean;
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
  isMagnetic = false,
  ...rest
}) => {
  const wrapRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isMagnetic || typeof window === 'undefined') return;
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    if (!wrapRef.current || !innerRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2) * 0.32;
    const relY = (e.clientY - rect.top - rect.height / 2) * 0.32;
    gsap.to(innerRef.current, { x: relX, y: relY, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
  };

  const handlePointerLeave = () => {
    if (!isMagnetic || !innerRef.current) return;
    gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.35)', overwrite: 'auto' });
  };

  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    'magnetic-wrap',
    isMagnetic ? 'is-magnetic' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <span ref={innerRef} className="btn__content magnetic-inner">
      {icon && iconPosition === 'left' && <span className="btn__icon">{icon}</span>}
      {children && <span className="btn__text">{children}</span>}
      {icon && iconPosition === 'right' && <span className="btn__icon">{icon}</span>}
    </span>
  );

  if ('href' in rest && rest.href) {
    const { href, ...anchorRest } = rest as ButtonAsLink;
    return (
      <a
        ref={wrapRef}
        href={href}
        className={classes}
        aria-label={ariaLabel}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const { type = 'button', disabled, ...buttonRest } = rest as ButtonAsButton;
  return (
    <button
      ref={wrapRef}
      type={type}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...buttonRest}
    >
      {content}
    </button>
  );
};
