'use client';

import React from 'react';
import {
	Select as RACSelect,
	Label,
	Button,
	SelectValue,
	Popover,
	ListBox,
	ListBoxItem,
	FieldError,
	Text,
	SelectProps as RACSelectProps,
	ValidationResult,
	ListBoxItemProps,
} from 'react-aria-components';
import { ChevronDown } from 'lucide-react';
import { Icon } from '../icon';
import './select.css';

export interface SelectProps<T extends object> extends Omit<RACSelectProps<T>, 'children'> {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
	items?: Iterable<T>;
	children: React.ReactNode | ((item: T) => React.ReactNode);
}

export const Select = <T extends object>({
	label,
	description,
	errorMessage,
	children,
	items,
	...props
}: SelectProps<T>) => {
	return (
		<RACSelect {...props} className="noria-select">
			{label && <Label className="noria-select__label">{label}</Label>}
			<Button className="noria-select__button neu-pressed">
				<SelectValue className="noria-select__value" />
				<span aria-hidden="true" className="noria-select__icon">
					<Icon icon={ChevronDown} />
				</span>
			</Button>
			{description && (
				<Text slot="description" className="noria-select__description">
					{description}
				</Text>
			)}
			<FieldError className="noria-select__error">{errorMessage}</FieldError>
			<Popover className="noria-select__popover neu-flat">
				<ListBox items={items} className="noria-select__listbox">
					{children}
				</ListBox>
			</Popover>
		</RACSelect>
	);
};

export const SelectItem = (props: ListBoxItemProps) => {
	return <ListBoxItem {...props} className="noria-select__item" />;
};
