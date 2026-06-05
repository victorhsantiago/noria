'use client';

import React from 'react';
import {
	TimeField as RACTimeField,
	Label,
	DateInput,
	DateSegment,
	FieldError,
	Text,
	TimeFieldProps as RACTimeFieldProps,
	ValidationResult,
	TimeValue,
} from 'react-aria-components';
import './time-field.css';

export interface TimeFieldProps<T extends TimeValue> extends RACTimeFieldProps<T> {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
}

export const TimeField = <T extends TimeValue>({
	label,
	description,
	errorMessage,
	...props
}: TimeFieldProps<T>) => {
	return (
		<RACTimeField {...props} className="noria-time-field">
			{label && <Label className="noria-time-field__label">{label}</Label>}
			<DateInput className="noria-time-field__input neu-pressed">
				{(segment) => <DateSegment segment={segment} className="noria-time-field__segment" />}
			</DateInput>
			{description && (
				<Text slot="description" className="noria-time-field__description">
					{description}
				</Text>
			)}
			<FieldError className="noria-time-field__error">{errorMessage}</FieldError>
		</RACTimeField>
	);
};
