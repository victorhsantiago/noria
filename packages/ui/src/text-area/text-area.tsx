'use client';

import React from 'react';
import {
	TextField as RACTextField,
	Label,
	TextArea as RACTextArea,
	Text,
	FieldError,
	TextFieldProps as RACTextFieldProps,
	ValidationResult,
} from 'react-aria-components';
import './text-area.css';

export interface TextAreaProps extends RACTextFieldProps {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
	placeholder?: string;
	rows?: number;
}

export const TextArea = ({
	label,
	description,
	errorMessage,
	placeholder,
	className,
	rows = 4,
	...props
}: TextAreaProps) => {
	const handleInput = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
		const target = e.currentTarget;
		target.style.height = 'auto';
		target.style.height = `${Math.min(target.scrollHeight, 500)}px`;
	};

	return (
		<RACTextField
			className={(renderProps) => {
				const baseClass = 'noria-textarea';
				const customClass =
					typeof className === 'function' ? className(renderProps) : className || '';
				return `${baseClass} ${customClass}`.trim();
			}}
			{...props}
		>
			{label && <Label className="noria-textarea__label">{label}</Label>}

			<div className="noria-textarea__input-container">
				<RACTextArea
					placeholder={placeholder}
					rows={rows}
					onInput={handleInput}
					className={(renderProps) => {
						const { isFocusVisible } = renderProps;
						const baseClass = 'noria-textarea__input neu-pressed';
						const focusClass = isFocusVisible ? 'noria-textarea__input--focused' : '';
						return `${baseClass} ${focusClass}`.trim();
					}}
				/>
			</div>

			{description && (
				<Text slot="description" className="noria-textarea__description">
					{description}
				</Text>
			)}
			<FieldError className="noria-textarea__error">{errorMessage}</FieldError>
		</RACTextField>
	);
};
