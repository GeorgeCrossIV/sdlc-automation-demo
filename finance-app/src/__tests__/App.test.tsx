/**
 * App.test.tsx
 * Integration tests for the App component and top-level navigation.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App navigation', () => {
  it('shows the dashboard view by default', async () => {
    render(<App />);
    expect(
      await screen.findByRole(
        'heading',
        { name: /today — ibm & competitors/i },
        { timeout: 4000 },
      ),
    ).toBeInTheDocument();
  });

  it('shows the company lookup search form when "Company Lookup" is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('tab', { name: /company lookup/i }));

    expect(screen.getByLabelText(/ticker symbol/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('stays on lookup view when a time range tab is clicked after navigating to lookup', () => {
    render(<App />);

    // First navigate to 7 Days, then to Company Lookup
    fireEvent.click(screen.getByRole('tab', { name: /7 days/i }));
    fireEvent.click(screen.getByRole('tab', { name: /company lookup/i }));
    expect(screen.getByLabelText(/ticker symbol/i)).toBeInTheDocument();

    // Click "Today" tab
    fireEvent.click(screen.getByRole('tab', { name: /today/i }));

    // Search form is still visible (still on lookup)
    expect(screen.getByLabelText(/ticker symbol/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();

    // The Today tab is selected
    expect(screen.getByRole('tab', { name: /today/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
