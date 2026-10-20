/**
 * TimeRangeTabs.test.tsx
 * Tests for the TimeRangeTabs component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimeRangeTabs } from '../components/TimeRangeTabs';

describe('TimeRangeTabs', () => {
  it('renders three tab buttons', () => {
    render(<TimeRangeTabs active="day" onChange={vi.fn()} />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('marks the active tab as selected', () => {
    render(<TimeRangeTabs active="week" onChange={vi.fn()} />);
    const selected = screen.getAllByRole('tab').filter(
      (t) => t.getAttribute('aria-selected') === 'true',
    );
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent('7 Days');
  });

  it('calls onChange with the correct value when a tab is clicked', () => {
    const onChange = vi.fn();
    render(<TimeRangeTabs active="day" onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: /quarter/i }));
    expect(onChange).toHaveBeenCalledWith('quarter');
  });
});
