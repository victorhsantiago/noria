import React, { CSSProperties } from 'react';
import './skeleton.css';

export interface SkeletonProps {
	className?: string;
	style?: CSSProperties;
	width?: string | number;
	height?: string | number;
	borderRadius?: string | number;
	mt?: string;
}

export const Skeleton = ({
	className = '',
	style,
	width,
	height,
	borderRadius,
	mt,
}: SkeletonProps) => {
	const customStyle = {
		width,
		height,
		borderRadius,
		marginTop: mt ? `var(--space-${mt})` : undefined,
		...style,
	};
	return <div className={`noria-skeleton ${className}`.trim()} style={customStyle} />;
};
