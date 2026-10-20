/**
 * UserTickerView.tsx  (resolves Issue #1 — Add a graph for a user selected company)
 *
 * Lets the user type any stock ticker, choose a time range, and see
 * a comparison chart rendered without touching the existing IBM/competitor views.
 *
 * Gracefully handles invalid symbols with a clear error message.
 */
import { useState } from 'react';
import { TickerInput } from '../components/TickerInput';
import { TimeRangeTabs } from '../components/TimeRangeTabs';
import { StockChart } from '../components/StockChart';
import { useUserTicker } from '../hooks/useUserTicker';
import type { TimeRange } from '../services/stockData';

export function UserTickerView() {
  const [submittedTicker, setSubmittedTicker] = useState('');
  const [range, setRange] = useState<TimeRange>('week');
  const { series, loading, error } = useUserTicker(submittedTicker, range);

  return (
    <section>
      <h2>Company Lookup</h2>
      <p className="subtitle">
        Enter any stock ticker to see its historical price chart.
      </p>

      <TickerInput onSubmit={setSubmittedTicker} loading={loading} />

      {submittedTicker && (
        <>
          <TimeRangeTabs active={range} onChange={setRange} />

          {loading && (
            <p className="status">Loading data for {submittedTicker}…</p>
          )}

          {!loading && error && (
            <p className="status error" role="alert">
              {error}
            </p>
          )}

          {!loading && !error && series && (
            <StockChart series={[series]} range={range} />
          )}

          {!loading && !error && !series && (
            <p className="status">No data returned for {submittedTicker}.</p>
          )}
        </>
      )}

      {!submittedTicker && (
        <p className="status muted">
          Enter a ticker above to load its chart.
        </p>
      )}
    </section>
  );
}
