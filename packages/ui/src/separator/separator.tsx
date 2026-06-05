"use client";

import React from 'react';
import { Separator as RACSeparator, SeparatorProps as RACSeparatorProps } from 'react-aria-components';
import './separator.css';

export interface SeparatorProps extends RACSeparatorProps {
  className?: string;
}

export const Separator = ({ className = '', ...props }: SeparatorProps) => {
  return (
    <RACSeparator
      className={`noria-separator ${className}`.trim()}
      {...props}
    />
  );
};
