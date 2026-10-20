/**
 * CurrentDayView.tsx
 * Shows today's intraday price movement for IBM and the four tracked competitors.
 */
import { StockChart } from '../components/StockChart';
import { useStockData } from '../hooks/useStockData';

export function CurrentDayView() {
  const { series, loading, error } = useStockData('day');

  if (loading) return <p className="status">Loading today's data…</p>;
  if (error) return <p className="status error">Error: {error}</p>;

  return (
    <section>
      <h2>Today — IBM &amp; Competitors</h2>
      <p className="subtitle">Intraday price movement (5-minute intervals)</p>
      <StockChart series={series} range="day" />
    </section>
  );
}
