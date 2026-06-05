import React, { ElementType, HTMLAttributes } from 'react';
import './flex.css';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch';
export type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface FlexProps extends HTMLAttributes<HTMLElement> {
  direction?: FlexDirection;
  justify?: FlexJustify;
  align?: FlexAlign;
  gap?: Spacing;
  wrap?: boolean;
  maxWidth?: string | number;
  fullWidth?: boolean;
  as?: ElementType;
}

export const Flex = ({
  direction = 'row',
  justify,
  align,
  gap = 'none',
  wrap = false,
  maxWidth,
  fullWidth = false,
  as: Component = 'div',
  className = '',
  style,
  children,
  ...props
}: FlexProps) => {
  const baseClass = 'noria-flex';
  const directionClass = `noria-flex--direction-${direction}`;
  const justifyClass = justify ? `noria-flex--justify-${justify}` : '';
  const alignClass = align ? `noria-flex--align-${align}` : '';
  const gapClass = `noria-flex--gap-${gap}`;
  const wrapClass = wrap ? 'noria-flex--wrap' : 'noria-flex--nowrap';
  const widthClass = fullWidth ? 'noria-flex--full-width' : '';

  const finalClassName = `${baseClass} ${directionClass} ${justifyClass} ${alignClass} ${gapClass} ${wrapClass} ${widthClass} ${className}`.trim();

  const customStyle = maxWidth ? { ...style, maxWidth } : style;

  return (
    <Component className={finalClassName} style={customStyle} {...props}>
      {children}
    </Component>
  );
};
