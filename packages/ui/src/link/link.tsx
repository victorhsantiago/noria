import React, { ComponentPropsWithoutRef } from 'react';
import NextLink from 'next/link';
import './link.css';
import { Spacing } from '../layout/flex';

export type LinkProps = ComponentPropsWithoutRef<typeof NextLink> & {
  mt?: Spacing;
  mb?: Spacing;
  ml?: Spacing;
  mr?: Spacing;
  inlineBlock?: boolean;
};

export const Link = ({
  className = '',
  mt,
  mb,
  ml,
  mr,
  inlineBlock,
  children,
  ...props
}: LinkProps) => {
  const baseClass = 'noria-link';
  const displayClass = inlineBlock ? 'noria-link--inline-block' : '';
  const mtClass = mt ? `noria-spacing--mt-${mt}` : '';
  const mbClass = mb ? `noria-spacing--mb-${mb}` : '';
  const mlClass = ml ? `noria-spacing--ml-${ml}` : '';
  const mrClass = mr ? `noria-spacing--mr-${mr}` : '';

  const finalClassName = [baseClass, displayClass, mtClass, mbClass, mlClass, mrClass, className].filter(Boolean).join(' ').trim();

  return (
    <NextLink className={finalClassName} {...props}>
      {children}
    </NextLink>
  );
};
