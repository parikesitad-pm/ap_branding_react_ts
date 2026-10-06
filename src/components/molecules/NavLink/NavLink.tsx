import React from 'react';
import './NavLink.css';

export interface NavLinkProps {
  href: string;
  label: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  external?: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  active = false,
  onClick,
  className = '',
  external = false,
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`nav-link ${active ? 'nav-link--active' : ''} ${className}`}
      aria-current={active ? 'page' : undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <span className="nav-link__text">{label}</span>
    </a>
  );
};

