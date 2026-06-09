import React, { ElementType, HTMLAttributes } from 'react';
import './container.css';
import { Spacing } from '../types';

export type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | string;

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
	maxWidth?: MaxWidth;
	padding?: Spacing;
	as?: ElementType;
}

export const Container = ({
	maxWidth = 'lg',
	padding = 'none',
	as: Component = 'div',
	className = '',
	style,
	children,
	...props
}: ContainerProps) => {
	const baseClass = 'noria-container';

	const isPredefinedWidth = ['sm', 'md', 'lg', 'xl'].includes(maxWidth);
	const maxWidthClass = isPredefinedWidth ? `noria-container--max-width-${maxWidth}` : '';
	const customStyle = !isPredefinedWidth ? { maxWidth, ...style } : style;

	const paddingClass = `noria-container--padding-${padding}`;

	const finalClassName = `${baseClass} ${maxWidthClass} ${paddingClass} ${className}`.trim();

	return (
		<Component className={finalClassName} style={customStyle} {...props}>
			{children}
		</Component>
	);
};
