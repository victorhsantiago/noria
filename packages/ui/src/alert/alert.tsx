import React, { ReactNode } from 'react';
import './alert.css';

export interface AlertProps {
	children: ReactNode;
	variant?: 'danger' | 'success' | 'info' | 'warning';
	className?: string;
}

export const Alert = ({ children, variant = 'danger', className = '' }: AlertProps) => {
	return (
		<div className={`noria-alert noria-alert--${variant} ${className}`.trim()} role="alert">
			{children}
		</div>
	);
};
