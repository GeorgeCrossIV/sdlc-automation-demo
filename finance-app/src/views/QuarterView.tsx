/**
 * QuarterView.tsx
 * Shows the last ~65 trading days (one quarter) for IBM and the four tracked competitors.
 */
import { StockChart } from '../components/StockChart';
import { useStockData } from '../hooks/useStockData';

export function QuarterView() {
  const { series, loading, error } = useStockData('quarter');

  if (loading) return <p className="status">Loading quarterly data…</p>;
  if (error) return <p className="status error">Error: {error}</p>;

  return (
    <section>
      <h2>Last Quarter — IBM &amp; Competitors</h2>
      <p className="subtitle">Daily closing prices over the past quarter (~65 trading days)</p>
      <StockChart series={series} range="quarter" />
    </section>
  );
}
