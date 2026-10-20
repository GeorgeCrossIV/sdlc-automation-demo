/**
 * TimeRangeTabs.tsx
 * Tab bar to switch between Day / Week / Quarter views.
 */
import type { TimeRange } from '../services/stockData';
import styles from './TimeRangeTabs.module.css';

interface Props {
  active: TimeRange;
  onChange: (range: TimeRange) => void;
}

const TABS: { label: string; value: TimeRange }[] = [
  { label: 'Today', value: 'day' },
  { label: '7 Days', value: 'week' },
  { label: 'Quarter', value: 'quarter' },
];

export function TimeRangeTabs({ active, onChange }: Props) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Time range">
      {TABS.map(({ label, value }) => (
        <button
          key={value}
          role="tab"
          aria-selected={active === value}
          className={`${styles.tab} ${active === value ? styles.active : ''}`}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
