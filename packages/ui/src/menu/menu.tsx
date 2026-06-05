'use client';

import {
	Menu as RACMenu,
	MenuItem as RACMenuItem,
	MenuTrigger as RACMenuTrigger,
	Popover as RACPopover,
	MenuProps,
	MenuItemProps,
	MenuTriggerProps,
	PopoverProps
} from 'react-aria-components';
import './menu.css';

export const MenuTrigger = (props: MenuTriggerProps) => {
	return <RACMenuTrigger {...props} />;
};

export const Popover = (props: PopoverProps) => {
	return (
		<RACPopover {...props} className={props.className || 'noria-Popover'}>
			{props.children}
		</RACPopover>
	);
};

export const Menu = <T extends object>(props: MenuProps<T>) => {
	return <RACMenu {...props} className={props.className || 'noria-Menu'} />;
};

export const MenuItem = (props: MenuItemProps) => {
	return <RACMenuItem {...props} className={props.className || 'noria-MenuItem'} />;
};
