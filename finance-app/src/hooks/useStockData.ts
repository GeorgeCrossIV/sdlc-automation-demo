/**
 * useStockData.ts
 * Custom hook — fetches tracked company series for a given time range.
 */
import { useState, useEffect } from 'react';
import {
  fetchStockSeries,
  TRACKED_COMPANIES,
} from '../services/stockData';
import type { StockSeries, TimeRange } from '../services/stockData';

interface UseStockDataResult {
  series: StockSeries[];
  loading: boolean;
  error: string | null;
}

export function useStockData(range: TimeRange): UseStockDataResult {
  const [state, setState] = useState<{
    series: StockSeries[];
    loading: boolean;
    error: string | null;
  }>({ series: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ series: [], loading: true, error: null });

    fetchStockSeries(TRACKED_COMPANIES, range)
      .then((data) => {
        if (!cancelled) {
          setState({ series: data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            series: [],
            loading: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [range]);

  return state;
}
