import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './button';

describe('Button Component', () => {
	it('should render children text correctly', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('should trigger onPress callback when clicked', () => {
		const handlePress = vi.fn();
		render(<Button onPress={handlePress}>Press me</Button>);
		
		const button = screen.getByRole('button');
		fireEvent.click(button);
		
		expect(handlePress).toHaveBeenCalledTimes(1);
	});

	it('should support primary variant class', () => {
		render(<Button variant="primary">Primary Button</Button>);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('noria-button--primary');
	});

	it('should support full width style', () => {
		render(<Button fullWidth>Full Width</Button>);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('noria-button--full-width');
	});
});
