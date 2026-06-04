"use client";

import React, { ReactNode, isValidElement, cloneElement } from 'react';
import { Button as RACButton, ButtonProps as RACButtonProps } from 'react-aria-components';
import './button.css';

export interface ButtonProps extends RACButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'icon-only';
  icon?: ReactNode;
}

export function Button({ variant = 'secondary', className, icon, children, ...props }: ButtonProps) {
  return (
    <RACButton
      className={(renderProps) => {
        const { isPressed, isFocusVisible } = renderProps;
        const baseClass = 'noria-button';
        const variantClass = `noria-button--${variant}`;
        const neuClass = isPressed ? 'neu-pressed' : 'neu-convex';
        const focusClass = isFocusVisible ? 'noria-button--focused' : '';

        const customClass = typeof className === 'function' ? className(renderProps) : className || '';

        return `${baseClass} ${variantClass} ${neuClass} ${focusClass} ${customClass}`.trim();
      }}
      {...props}
    >
      {(renderProps) => {
        const kids = typeof children === 'function' ? children(renderProps) : children;
        const iconSize = variant === 'icon-only' ? 20 : 18;

        return (
          <>
            {icon && isValidElement(icon)
              ? cloneElement(icon as React.ReactElement<any>, { 
                  width: iconSize, 
                  height: iconSize, 
                  className: "noria-button__icon" 
                })
              : icon}
            {variant !== 'icon-only' && kids && <span className="noria-button__text">{kids}</span>}
            {variant === 'icon-only' && !icon && kids}
          </>
        );
      }}
    </RACButton>
  );
}
