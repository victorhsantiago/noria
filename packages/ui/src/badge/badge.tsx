import React, { HTMLAttributes } from 'react';
import './badge.css';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
}

export const Badge = ({ className = '', variant, children, ...props }: BadgeProps) => {
  return (
    <span
      className={`noria-badge noria-badge--${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
};
