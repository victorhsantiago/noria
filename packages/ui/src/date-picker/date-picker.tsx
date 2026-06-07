'use client';

import React from 'react';
import {
	DatePicker as RACDatePicker,
	Label,
	Group,
	DateInput,
	DateSegment,
	Button,
	Popover,
	Dialog,
	Calendar,
	CalendarGrid,
	CalendarCell,
	Heading,
	FieldError,
	Text,
	DatePickerProps as RACDatePickerProps,
	ValidationResult,
	DateValue,
	CalendarGridHeader,
	CalendarHeaderCell,
	CalendarGridBody,
} from 'react-aria-components';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Icon } from '../icon';
import './date-picker.css';

export interface DatePickerProps<T extends DateValue> extends RACDatePickerProps<T> {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
}

export const DatePicker = <T extends DateValue>({
	label,
	description,
	errorMessage,
	...props
}: DatePickerProps<T>) => {
	return (
		<RACDatePicker {...props} className="noria-date-picker">
			{label && <Label className="noria-date-picker__label">{label}</Label>}
			<Group className="noria-date-picker__group neu-pressed">
				<DateInput className="noria-date-picker__input">
					{(segment) => <DateSegment segment={segment} className="noria-date-picker__segment" />}
				</DateInput>
				<Button className="noria-date-picker__button">
					<Icon icon={CalendarIcon} />
				</Button>
			</Group>
			{description && (
				<Text slot="description" className="noria-date-picker__description">
					{description}
				</Text>
			)}
			<FieldError className="noria-date-picker__error">{errorMessage}</FieldError>
			<Popover className="noria-date-picker__popover neu-flat">
				<Dialog className="noria-date-picker__dialog">
					<Calendar className="noria-calendar">
						<header className="noria-calendar__header">
							<Button slot="previous" className="noria-calendar__nav-button">
								<Icon icon={ChevronLeft} />
							</Button>
							<Heading className="noria-calendar__heading" />
							<Button slot="next" className="noria-calendar__nav-button">
								<Icon icon={ChevronRight} />
							</Button>
						</header>
						<CalendarGrid className="noria-calendar__grid">
							<CalendarGridHeader>
								{(day) => (
									<CalendarHeaderCell className="noria-calendar__header-cell">
										{day}
									</CalendarHeaderCell>
								)}
							</CalendarGridHeader>
							<CalendarGridBody>
								{(date) => <CalendarCell date={date} className="noria-calendar__cell" />}
							</CalendarGridBody>
						</CalendarGrid>
					</Calendar>
				</Dialog>
			</Popover>
		</RACDatePicker>
	);
};
