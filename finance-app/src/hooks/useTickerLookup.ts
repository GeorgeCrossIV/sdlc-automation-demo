/**
 * useTickerLookup.ts
 * Custom hook — manages input, validation and fetching for a user-entered ticker.
 */
import { useState, useEffect, useRef } from 'react';
import { fetchStockSeries } from '../services/stockData';
import type { StockSeries, TimeRange } from '../services/stockData';

const TICKER_PATTERN = /^[A-Z]{1,5}$/;

interface UseTickerLookupResult {
  symbol: string;
  setSymbol: (s: string) => void;
  search: (raw: string) => void;
  series: StockSeries[];
  loading: boolean;
  error: string | null;
}

export function useTickerLookup(range: TimeRange): UseTickerLookupResult {
  const [symbol, setSymbol] = useState('');
  const [request, setRequest] = useState(0);
  const lastTicker = useRef<string | null>(null);
  const [state, setState] = useState<{
    series: StockSeries[];
    loading: boolean;
    error: string | null;
  }>({ series: [], loading: false, error: null });

  function search(raw: string): void {
    const ticker = raw.trim().toUpperCase();
    if (!TICKER_PATTERN.test(ticker)) {
      setState({
        series: [],
        loading: false,
        error: 'Enter a ticker symbol of 1–5 letters (e.g. AAPL).',
      });
      return;
    }
    lastTicker.current = ticker;
    setSymbol(ticker);
    setRequest((n) => n + 1);
  }

  useEffect(() => {
    const ticker = lastTicker.current;
    if (ticker === null) return;

    let cancelled = false;
    setState({ series: [], loading: true, error: null });

    fetchStockSeries([{ ticker, name: ticker }], range)
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
  }, [request, range]);

  return { symbol, setSymbol, search, ...state };
}
