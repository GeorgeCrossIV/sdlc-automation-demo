/**
 * useUserTicker.ts
 * Custom hook — fetches a single user-supplied ticker for a given time range.
 */
import { useState, useEffect } from 'react';
import { fetchUserTicker } from '../services/stockData';
import type { StockSeries, TimeRange } from '../services/stockData';

interface UseUserTickerResult {
  series: StockSeries | null;
  loading: boolean;
  error: string | null;
}

export function useUserTicker(
  ticker: string,
  range: TimeRange,
): UseUserTickerResult {
  const [state, setState] = useState<UseUserTickerResult>({
    series: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const symbol = ticker.toUpperCase().trim();

    if (!symbol) {
      setState({ series: null, loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState({ series: null, loading: true, error: null });

    fetchUserTicker(symbol, range)
      .then((data) => {
        if (!cancelled) {
          if (data === null) {
            setState({
              series: null,
              loading: false,
              error: `Symbol "${symbol}" not found or invalid.`,
            });
          } else {
            setState({ series: data, loading: false, error: null });
          }
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            series: null,
            loading: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [ticker, range]);

  return state;
}
