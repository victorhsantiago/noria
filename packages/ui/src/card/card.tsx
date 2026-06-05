import React, { ElementType, ComponentPropsWithoutRef, CSSProperties } from 'react';
import './card.css';
import { Spacing } from '../layout/flex';

export type CardProps<T extends ElementType> = {
  /** The HTML element or React component to render the card as. Defaults to 'div'. */
  as?: T;
  /** Whether to apply interactive styling (hover/active states). Defaults to true if `as` is 'a' or 'button'. */
  interactive?: boolean;
  p?: Spacing;
  gap?: Spacing;
  maxWidth?: string | number;
  fullWidth?: boolean;
} & ComponentPropsWithoutRef<T>;

export const Card = <T extends ElementType = 'div'>({
  as,
  interactive,
  p,
  gap,
  maxWidth,
  fullWidth,
  className,
  style,
  children,
  ...props
}: CardProps<T>) => {
  const Component = as || 'div';
  
  // Implicitly interactive if rendered as an 'a' or 'button', or if explicitly requested.
  const isInteractive = interactive ?? (as === 'a' || as === 'button');
  
  const baseClass = 'noria-card neu-flat';
  const interactiveClass = isInteractive ? 'noria-card--interactive' : '';
  const pClass = p ? `noria-card--p-${p}` : '';
  const gapClass = gap ? `noria-card--gap-${gap}` : '';
  const fullWidthClass = fullWidth ? 'noria-card--full-width' : '';

  const finalClassName = [baseClass, interactiveClass, pClass, gapClass, fullWidthClass, className].filter(Boolean).join(' ').trim();
  const customStyle: CSSProperties = maxWidth ? { ...style, maxWidth } : { ...(style as CSSProperties) };

  return (
    <Component className={finalClassName} style={customStyle} {...props}>
      {children}
    </Component>
  );
};
