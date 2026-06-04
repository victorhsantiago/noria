"use client";

import React, { ReactNode, isValidElement, cloneElement } from 'react';
import {
  TextField as RACTextField,
  Label,
  Input,
  Text,
  FieldError,
  TextFieldProps as RACTextFieldProps,
  ValidationResult
} from 'react-aria-components';
import './text-field.css';

export interface TextFieldProps extends RACTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  placeholder?: string;
}

export function TextField({
  label,
  description,
  errorMessage,
  startIcon,
  endIcon,
  placeholder,
  className,
  ...props
}: TextFieldProps) {
  const iconSize = 18;

  const renderIcon = (icon: ReactNode, position: 'start' | 'end') => {
    if (!icon) return null;
    
    return (
      <div className={`noria-textfield__icon noria-textfield__icon--${position}`}>
        {isValidElement(icon)
          ? cloneElement(icon as React.ReactElement<any>, { 
              width: iconSize, 
              height: iconSize 
            })
          : icon}
      </div>
    );
  };

  return (
    <RACTextField
      className={(renderProps) => {
        const baseClass = 'noria-textfield';
        const customClass = typeof className === 'function' ? className(renderProps) : className || '';
        return `${baseClass} ${customClass}`.trim();
      }}
      {...props}
    >
      {label && <Label className="noria-textfield__label">{label}</Label>}
      
      <div className="noria-textfield__input-container">
        {renderIcon(startIcon, 'start')}
        
        <Input 
          placeholder={placeholder}
          className={(renderProps) => {
          const { isFocusVisible } = renderProps;
          const baseClass = 'noria-textfield__input neu-pressed';
          const focusClass = isFocusVisible ? 'noria-textfield__input--focused' : '';
          const startIconClass = startIcon ? 'noria-textfield__input--has-start-icon' : '';
          const endIconClass = endIcon ? 'noria-textfield__input--has-end-icon' : '';
          
          return `${baseClass} ${focusClass} ${startIconClass} ${endIconClass}`.trim();
        }} />
        
        {renderIcon(endIcon, 'end')}
      </div>

      {description && <Text slot="description" className="noria-textfield__description">{description}</Text>}
      <FieldError className="noria-textfield__error">{errorMessage}</FieldError>
    </RACTextField>
  );
}
