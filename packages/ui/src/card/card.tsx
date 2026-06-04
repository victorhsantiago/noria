import React, { ElementType, ComponentPropsWithoutRef } from 'react';
import './card.css';

export type CardProps<T extends ElementType> = {
  /** The HTML element or React component to render the card as. Defaults to 'div'. */
  as?: T;
  /** Whether to apply interactive styling (hover/active states). Defaults to true if `as` is 'a' or 'button'. */
  interactive?: boolean;
} & ComponentPropsWithoutRef<T>;

export const Card = <T extends ElementType = 'div'>({
  as,
  interactive,
  className,
  children,
  ...props
}: CardProps<T>) => {
  const Component = as || 'div';
  
  // Implicitly interactive if rendered as an 'a' or 'button', or if explicitly requested.
  const isInteractive = interactive ?? (as === 'a' || as === 'button');
  
  const baseClass = 'noria-card neu-flat';
  const interactiveClass = isInteractive ? 'noria-card--interactive' : '';
  const finalClassName = `${baseClass} ${interactiveClass} ${className || ''}`.trim();

  return (
    <Component className={finalClassName} {...props}>
      {children}
    </Component>
  );
};
