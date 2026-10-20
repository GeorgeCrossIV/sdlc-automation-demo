/**
 * StockChart.tsx
 * Reusable Recharts line chart for one or more StockSeries.
 */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { StockSeries, TimeRange } from '../services/stockData';

const COLORS = [
  '#3b82f6', // blue  — IBM
  '#10b981', // green — MSFT
  '#f59e0b', // amber — GOOGL
  '#ef4444', // red   — AMZN
  '#8b5cf6', // purple— ORCL
  '#06b6d4', // cyan  — user ticker
];

interface Props {
  series: StockSeries[];
  range: TimeRange;
  height?: number;
}

function formatLabel(iso: string, range: TimeRange): string {
  const d = new Date(iso);
  if (range === 'day') {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/**
 * Merge all series into a flat array of objects keyed by timestamp so
 * Recharts can render multiple lines on the same x-axis.
 */
function mergeSeriesData(series: StockSeries[]) {
  const map = new Map<string, Record<string, number | string>>();

  series.forEach(({ ticker, data }) => {
    data.forEach(({ timestamp, price }) => {
      if (!map.has(timestamp)) {
        map.set(timestamp, { timestamp });
      }
      (map.get(timestamp) as Record<string, number | string>)[ticker] = price;
    });
  });

  return Array.from(map.values()).sort((a, b) =>
    (a.timestamp as string).localeCompare(b.timestamp as string),
  );
}

export function StockChart({ series, range, height = 380 }: Props) {
  if (!series.length) return null;

  const data = mergeSeriesData(series);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(v) => formatLabel(v as string, range)}
          tick={{ fontSize: 11 }}
          minTickGap={40}
        />
        <YAxis
          tickFormatter={(v) => `$${(v as number).toFixed(0)}`}
          tick={{ fontSize: 11 }}
          width={56}
        />
        <Tooltip
          formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name as string]}
          labelFormatter={(label) => formatLabel(label as string, range)}
        />
        <Legend />
        {series.map(({ ticker }, idx) => (
          <Line
            key={ticker}
            type="monotone"
            dataKey={ticker}
            stroke={COLORS[idx % COLORS.length]}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
