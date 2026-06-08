'use client';

import React from 'react';
import { Button as RACButton, ButtonProps as RACButtonProps } from 'react-aria-components';
import { LucideIcon } from 'lucide-react';
import { Icon } from '../icon';
import './button.css';

export interface ButtonProps extends RACButtonProps {
	variant?: 'primary' | 'secondary' | 'danger' | 'icon-only' | 'link';
	icon?: LucideIcon;
	fullWidth?: boolean;
}

export const Button = ({
	variant = 'secondary',
	className,
	icon,
	fullWidth,
	children,
	...props
}: ButtonProps) => {
	return (
		<RACButton
			className={(renderProps) => {
				const { isPressed, isFocusVisible } = renderProps;
				const baseClass = 'noria-button';
				const variantClass = `noria-button--${variant}`;
				const neuClass = variant === 'link' ? '' : isPressed ? 'neu-pressed' : 'neu-convex';
				const focusClass = isFocusVisible ? 'noria-button--focused' : '';
				const widthClass = fullWidth ? 'noria-button--full-width' : '';

				const customClass =
					typeof className === 'function' ? className(renderProps) : className || '';

				return `${baseClass} ${variantClass} ${widthClass} ${neuClass} ${focusClass} ${customClass}`.trim();
			}}
			{...props}
		>
			{(renderProps) => {
				const kids = typeof children === 'function' ? children(renderProps) : children;
				const iconSize = variant === 'icon-only' ? 20 : 18;

				return (
					<>
						{icon && <Icon size={iconSize} className="noria-button__icon" icon={icon} />}
						{variant !== 'icon-only' && kids && <span className="noria-button__text">{kids}</span>}
						{variant === 'icon-only' && !icon && kids}
					</>
				);
			}}
		</RACButton>
	);
};
