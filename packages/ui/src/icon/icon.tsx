import React from 'react';
import { LucideIcon } from 'lucide-react';
import './icon.css';

export interface IconProps {
	icon: LucideIcon;
	className?: string;
	size?: number | string;
}

export const Icon = ({ icon: IconComponent, className = '', size = 18 }: IconProps) => {
	return (
		<IconComponent
			className={['noria-icon', className].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()}
			size={size}
		/>
	);
};
