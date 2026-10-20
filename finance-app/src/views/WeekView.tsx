/**
 * WeekView.tsx
 * Shows the last 7 trading days for IBM and the four tracked competitors.
 */
import { StockChart } from '../components/StockChart';
import { useStockData } from '../hooks/useStockData';

export function WeekView() {
  const { series, loading, error } = useStockData('week');

  if (loading) return <p className="status">Loading 7-day data…</p>;
  if (error) return <p className="status error">Error: {error}</p>;

  return (
    <section>
      <h2>Last 7 Days — IBM &amp; Competitors</h2>
      <p className="subtitle">Daily closing prices over the past week</p>
      <StockChart series={series} range="week" />
    </section>
  );
}
