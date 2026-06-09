import React, { ElementType, HTMLAttributes } from 'react';
import './flex.css';

import { Spacing, TextAlign } from '../types';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch';

export interface FlexProps extends HTMLAttributes<HTMLElement> {
	direction?: FlexDirection;
	justify?: FlexJustify;
	align?: FlexAlign;
	gap?: Spacing;
	wrap?: boolean;
	maxWidth?: string | number;
	fullWidth?: boolean;
	as?: ElementType;

	// Spacing Props
	mt?: Spacing;
	mb?: Spacing;
	ml?: Spacing;
	mr?: Spacing;
	p?: Spacing;
	px?: Spacing;
	py?: Spacing;
	pt?: Spacing;
	pb?: Spacing;

	// Flex Layout Props
	grow?: boolean;
	shrink?: boolean;
	alignSelf?: FlexAlign;
	textAlign?: TextAlign;
	inline?: boolean;
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
	mt,
	mb,
	ml,
	mr,
	p,
	px,
	py,
	pt,
	pb,
	grow,
	shrink,
	alignSelf,
	textAlign,
	inline,
	className = '',
	style,
	children,
	...props
}: FlexProps) => {
	const baseClass = inline ? 'noria-flex-inline' : 'noria-flex';
	const directionClass = `noria-flex--direction-${direction}`;
	const justifyClass = justify ? `noria-flex--justify-${justify}` : '';
	const alignClass = align ? `noria-flex--align-${align}` : '';
	const gapClass = `noria-flex--gap-${gap}`;
	const wrapClass = wrap ? 'noria-flex--wrap' : 'noria-flex--nowrap';
	const widthClass = fullWidth ? 'noria-flex--full-width' : '';

	const growClass = grow ? 'noria-flex--grow' : '';
	const shrinkClass = shrink ? 'noria-flex--shrink' : '';
	const alignSelfClass = alignSelf ? `noria-flex--align-self-${alignSelf}` : '';
	const textAlignClass = textAlign ? `noria-flex--text-align-${textAlign}` : '';

	const mtClass = mt ? `noria-spacing--mt-${mt}` : '';
	const mbClass = mb ? `noria-spacing--mb-${mb}` : '';
	const mlClass = ml ? `noria-spacing--ml-${ml}` : '';
	const mrClass = mr ? `noria-spacing--mr-${mr}` : '';
	const pClass = p ? `noria-spacing--p-${p}` : '';
	const pxClass = px ? `noria-spacing--px-${px}` : '';
	const pyClass = py ? `noria-spacing--py-${py}` : '';
	const ptClass = pt ? `noria-spacing--pt-${pt}` : '';
	const pbClass = pb ? `noria-spacing--pb-${pb}` : '';

	const finalClassName = [
		baseClass,
		directionClass,
		justifyClass,
		alignClass,
		gapClass,
		wrapClass,
		widthClass,
		growClass,
		shrinkClass,
		alignSelfClass,
		textAlignClass,
		mtClass,
		mbClass,
		mlClass,
		mrClass,
		pClass,
		pxClass,
		pyClass,
		ptClass,
		pbClass,
		className,
	]
		.filter(Boolean)
		.join(' ')
		.trim();

	const customStyle = maxWidth ? { ...style, maxWidth } : style;

	return (
		<Component className={finalClassName} style={customStyle} {...props}>
			{children}
		</Component>
	);
};
