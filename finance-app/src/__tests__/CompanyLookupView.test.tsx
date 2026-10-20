/**
 * CompanyLookupView.test.tsx
 * Component tests for the CompanyLookupView.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CompanyLookupView } from '../views/CompanyLookupView';

describe('CompanyLookupView', () => {
  it('renders the search form with input and button', () => {
    render(<CompanyLookupView range="day" />);
    expect(screen.getByLabelText(/ticker symbol/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('shows an error with role="alert" when an invalid ticker is submitted', async () => {
    render(<CompanyLookupView range="day" />);

    fireEvent.change(screen.getByLabelText(/ticker symbol/i), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('renders a chart heading containing the ticker after a valid search', async () => {
    render(<CompanyLookupView range="day" />);

    fireEvent.change(screen.getByLabelText(/ticker symbol/i), {
      target: { value: 'AAPL' },
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() =>
      expect(screen.getByText(/AAPL/i)).toBeInTheDocument(),
    );
    expect(screen.getByText(/AAPL — Price History/i)).toBeInTheDocument();
  });
});
