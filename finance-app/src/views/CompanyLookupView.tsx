/**
 * CompanyLookupView.tsx
 * Lets the user search for any ticker symbol and view its historical price chart.
 */
import { StockChart } from '../components/StockChart';
import { useTickerLookup } from '../hooks/useTickerLookup';
import type { TimeRange } from '../services/stockData';

export function CompanyLookupView({ range }: { range: TimeRange }) {
  const { symbol, setSymbol, search, series, loading, error } = useTickerLookup(range);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(symbol);
  }

  return (
    <section>
      <h2>Company Lookup</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="ticker-input">Ticker symbol</label>{' '}
        <input
          id="ticker-input"
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          maxLength={5}
          placeholder="e.g. AAPL"
        />
        {' '}
        <button type="submit">Search</button>
      </form>

      {error && (
        <p role="alert" className="status error">
          {error}
        </p>
      )}

      {loading && <p className="status">Searching…</p>}

      {!loading && series.length > 0 && (
        <>
          <h2>{series[0].ticker} — Price History</h2>
          <StockChart series={series} range={range} />
        </>
      )}
    </section>
  );
}
