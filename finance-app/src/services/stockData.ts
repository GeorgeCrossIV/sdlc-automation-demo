/**
 * stockData.ts
 * Unified data service for stock price history.
 * When VITE_USE_MOCK=true (or the env var is absent in test), returns
 * deterministic mock data so the app runs fully offline.
 */

export type TimeRange = 'day' | 'week' | 'quarter';

export interface DataPoint {
  timestamp: string; // ISO date string
  price: number;
}

export interface StockSeries {
  ticker: string;
  name: string;
  data: DataPoint[];
}

// ─── Tracked companies ──────────────────────────────────────────────────────

export const TRACKED_COMPANIES: { ticker: string; name: string }[] = [
  { ticker: 'IBM', name: 'IBM' },
  { ticker: 'MSFT', name: 'Microsoft' },
  { ticker: 'GOOGL', name: 'Alphabet' },
  { ticker: 'AMZN', name: 'Amazon' },
  { ticker: 'ORCL', name: 'Oracle' },
];

// ─── Mock data generation ────────────────────────────────────────────────────

const BASE_PRICES: Record<string, number> = {
  IBM: 172,
  MSFT: 415,
  GOOGL: 178,
  AMZN: 195,
  ORCL: 132,
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateMockSeries(
  ticker: string,
  name: string,
  range: TimeRange,
): StockSeries {
  const base = BASE_PRICES[ticker] ?? 100;
  const seed = ticker.charCodeAt(0) * 31 + ticker.charCodeAt(1 % ticker.length);
  const rand = seededRandom(seed + range.length);

  const now = new Date('2025-05-09T16:00:00Z');
  const points: DataPoint[] = [];

  let count: number;
  let stepMs: number;

  if (range === 'day') {
    count = 78; // ~78 5-min candles in a trading day
    stepMs = 5 * 60 * 1000;
  } else if (range === 'week') {
    count = 5; // 5 trading days
    stepMs = 24 * 60 * 60 * 1000;
  } else {
    count = 65; // ~65 trading days in a quarter
    stepMs = 24 * 60 * 60 * 1000;
  }

  let price = base;
  for (let i = count - 1; i >= 0; i--) {
    const ts = new Date(now.getTime() - i * stepMs);
    price = +(price * (1 + (rand() - 0.5) * 0.015)).toFixed(2);
    points.push({ timestamp: ts.toISOString(), price });
  }

  return { ticker, name, data: points };
}

// ─── Public API ──────────────────────────────────────────────────────────────

const useMock =
  import.meta.env.VITE_USE_MOCK === 'true' ||
  import.meta.env.MODE === 'test' ||
  import.meta.env.MODE === 'development';

/**
 * Fetch historical price series for a list of tickers over the given range.
 * In mock mode, returns deterministic synthetic data immediately.
 */
export async function fetchStockSeries(
  tickers: { ticker: string; name: string }[],
  range: TimeRange,
): Promise<StockSeries[]> {
  if (useMock) {
    // Simulate a brief async delay so the loading state is testable
    await new Promise((r) => setTimeout(r, 50));
    return tickers.map(({ ticker, name }) =>
      generateMockSeries(ticker, name, range),
    );
  }

  // Real Yahoo Finance fetch would go here.
  // Keeping as a stub — CI always runs with VITE_USE_MOCK=true.
  throw new Error(
    'Live data fetching is not implemented. Set VITE_USE_MOCK=true.',
  );
}

/**
 * Fetch historical price series for a single user-supplied ticker.
 * Returns null if the ticker is unknown / returns no data in mock mode.
 */
export async function fetchUserTicker(
  ticker: string,
  range: TimeRange,
): Promise<StockSeries | null> {
  const symbol = ticker.toUpperCase().trim();
  if (!symbol) return null;

  if (useMock) {
    await new Promise((r) => setTimeout(r, 50));
    // Any 1-5 letter symbol is accepted in mock mode
    if (!/^[A-Z]{1,5}$/.test(symbol)) return null;
    return generateMockSeries(symbol, symbol, range);
  }

  throw new Error(
    'Live data fetching is not implemented. Set VITE_USE_MOCK=true.',
  );
}
