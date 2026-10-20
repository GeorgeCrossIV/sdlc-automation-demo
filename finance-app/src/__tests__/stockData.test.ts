/**
 * stockData.test.ts
 * Unit tests for the mock data service.
 */
import { describe, it, expect } from 'vitest';
import { fetchStockSeries, TRACKED_COMPANIES } from '../services/stockData';

describe('fetchStockSeries (mock)', () => {
  it('returns a series for each requested company', async () => {
    const result = await fetchStockSeries(TRACKED_COMPANIES, 'day');
    expect(result).toHaveLength(TRACKED_COMPANIES.length);
    result.forEach((s, i) => {
      expect(s.ticker).toBe(TRACKED_COMPANIES[i].ticker);
    });
  });

  it('returns 78 data points for day range', async () => {
    const result = await fetchStockSeries([{ ticker: 'IBM', name: 'IBM' }], 'day');
    expect(result[0].data).toHaveLength(78);
  });

  it('returns 5 data points for week range', async () => {
    const result = await fetchStockSeries([{ ticker: 'IBM', name: 'IBM' }], 'week');
    expect(result[0].data).toHaveLength(5);
  });

  it('returns 65 data points for quarter range', async () => {
    const result = await fetchStockSeries([{ ticker: 'IBM', name: 'IBM' }], 'quarter');
    expect(result[0].data).toHaveLength(65);
  });

  it('returns deterministic data (same result on repeated calls)', async () => {
    const a = await fetchStockSeries([{ ticker: 'MSFT', name: 'Microsoft' }], 'week');
    const b = await fetchStockSeries([{ ticker: 'MSFT', name: 'Microsoft' }], 'week');
    expect(a[0].data.map((d) => d.price)).toEqual(b[0].data.map((d) => d.price));
  });

  it('each data point has a valid ISO timestamp and positive price', async () => {
    const result = await fetchStockSeries([{ ticker: 'IBM', name: 'IBM' }], 'quarter');
    result[0].data.forEach(({ timestamp, price }) => {
      expect(new Date(timestamp).getTime()).not.toBeNaN();
      expect(price).toBeGreaterThan(0);
    });
  });
});

describe('fetchStockSeries — arbitrary ticker (mock)', () => {
  it('returns 78 data points for day range', async () => {
    const result = await fetchStockSeries([{ ticker: 'AAPL', name: 'AAPL' }], 'day');
    expect(result[0].data).toHaveLength(78);
  });

  it('returns 5 data points for week range', async () => {
    const result = await fetchStockSeries([{ ticker: 'AAPL', name: 'AAPL' }], 'week');
    expect(result[0].data).toHaveLength(5);
  });

  it('returns 65 data points for quarter range', async () => {
    const result = await fetchStockSeries([{ ticker: 'AAPL', name: 'AAPL' }], 'quarter');
    expect(result[0].data).toHaveLength(65);
  });

  it('all prices are positive and timestamps are valid ISO strings', async () => {
    const result = await fetchStockSeries([{ ticker: 'AAPL', name: 'AAPL' }], 'quarter');
    result[0].data.forEach(({ timestamp, price }) => {
      expect(new Date(timestamp).getTime()).not.toBeNaN();
      expect(price).toBeGreaterThan(0);
    });
  });
});
