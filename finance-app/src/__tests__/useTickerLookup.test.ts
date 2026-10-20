/**
 * useTickerLookup.test.ts
 * Unit tests for the useTickerLookup hook.
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTickerLookup } from '../hooks/useTickerLookup';
import type { TimeRange } from '../services/stockData';

describe('useTickerLookup', () => {
  it('sets an error and returns no series for an invalid ticker', () => {
    const { result } = renderHook(() => useTickerLookup('day'));

    act(() => {
      result.current.search('123');
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.series).toHaveLength(0);
    expect(result.current.loading).toBe(false);
  });

  it('clears the error and returns a series for a valid ticker', async () => {
    const { result } = renderHook(() => useTickerLookup('day'));

    act(() => {
      result.current.search('123');
    });
    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.search('aapl');
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.symbol).toBe('AAPL');
    expect(result.current.series).toHaveLength(1);
    expect(result.current.series[0].ticker).toBe('AAPL');
    expect(result.current.series[0].data).toHaveLength(78);
  });

  it('sets an error for an empty string', () => {
    const { result } = renderHook(() => useTickerLookup('day'));

    act(() => {
      result.current.search('');
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.series).toHaveLength(0);
  });

  it('re-fetches the last valid symbol when the range changes', async () => {
    const { result, rerender } = renderHook(
      ({ range }: { range: TimeRange }) => useTickerLookup(range),
      { initialProps: { range: 'day' as TimeRange } },
    );

    act(() => {
      result.current.search('AAPL');
    });
    await waitFor(() => expect(result.current.series).toHaveLength(1));
    expect(result.current.series[0].data).toHaveLength(78);

    rerender({ range: 'week' });

    await waitFor(() => expect(result.current.series[0]?.data).toHaveLength(5));
    expect(result.current.series[0].ticker).toBe('AAPL');
    expect(result.current.error).toBeNull();
  });
});
