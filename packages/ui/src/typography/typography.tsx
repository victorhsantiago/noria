import React, { ElementType, HTMLAttributes, ReactNode } from 'react';
import './typography.css';

export type TypographyVariant = 'h1' | 'h2-caps' | 'h3' | 'body' | 'body-small' | 'label';
export type TypographyColor = 'foreground' | 'muted' | 'primary' | 'success' | 'warning' | 'danger';
export type TypographyAlign = 'left' | 'center' | 'right';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  color?: TypographyColor;
  align?: TypographyAlign;
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

const defaultElementMap: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  'h2-caps': 'h2',
  h3: 'h3',
  body: 'p',
  'body-small': 'p',
  label: 'span',
};

const defaultColorMap: Record<TypographyVariant, TypographyColor> = {
  h1: 'foreground',
  'h2-caps': 'muted',
  h3: 'foreground',
  body: 'foreground',
  'body-small': 'muted',
  label: 'muted',
};

export const Typography = ({
  variant = 'body',
  color,
  align,
  as,
  className = '',
  children,
  ...props
}: TypographyProps) => {
  const Component = as || defaultElementMap[variant];
  const finalColor = color || defaultColorMap[variant];

  const baseClass = 'noria-typography';
  const variantClass = `noria-typography--variant-${variant}`;
  const colorClass = `noria-typography--color-${finalColor}`;
  const alignClass = align ? `noria-typography--align-${align}` : '';

  const finalClassName = `${baseClass} ${variantClass} ${colorClass} ${alignClass} ${className}`.trim();

  return (
    <Component className={finalClassName} {...props}>
      {children}
    </Component>
  );
};
