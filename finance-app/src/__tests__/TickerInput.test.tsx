/**
 * TickerInput.test.tsx
 * Tests for the TickerInput component — validation & submit behaviour.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TickerInput } from '../components/TickerInput';

describe('TickerInput', () => {
  it('renders the input and search button', () => {
    render(<TickerInput onSubmit={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls onSubmit with the uppercased symbol on valid input', () => {
    const onSubmit = vi.fn();
    render(<TickerInput onSubmit={onSubmit} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'aapl' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSubmit).toHaveBeenCalledWith('AAPL');
  });

  it('shows a validation error for an invalid symbol and does not call onSubmit', () => {
    const onSubmit = vi.fn();
    render(<TickerInput onSubmit={onSubmit} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows a validation error for an empty submit', () => {
    const onSubmit = vi.fn();
    render(<TickerInput onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('disables the button and input when loading=true', () => {
    render(<TickerInput onSubmit={vi.fn()} loading={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
