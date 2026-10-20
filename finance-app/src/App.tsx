/**
 * App.tsx
 * Shell: top nav + time-range tabs for the tracked-company views,
 * plus a dedicated "Company Lookup" tab backed by UserTickerView.
 */
import { useState } from 'react';
import { CurrentDayView } from './views/CurrentDayView';
import { WeekView } from './views/WeekView';
import { QuarterView } from './views/QuarterView';
import { UserTickerView } from './views/UserTickerView';
import type { TimeRange } from './services/stockData';
import './App.css';

type AppTab = TimeRange | 'lookup';

const APP_TABS: { label: string; value: AppTab }[] = [
  { label: 'Today', value: 'day' },
  { label: '7 Days', value: 'week' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Company Lookup', value: 'lookup' },
];

function AppTabs({
  active,
  onChange,
}: {
  active: AppTab;
  onChange: (v: AppTab) => void;
}) {
  return (
    <nav className="app-tabs" role="tablist" aria-label="Dashboard view">
      {APP_TABS.map(({ label, value }) => (
        <button
          key={value}
          role="tab"
          aria-selected={active === value}
          className={`app-tab ${active === value ? 'app-tab--active' : ''}`}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('day');

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <span className="app-logo">📈</span>
          <h1 className="app-title">Finance Analytics Dashboard</h1>
          <span className="app-badge">Mock Mode</span>
        </div>
      </header>

      <main className="app-main">
        <AppTabs active={activeTab} onChange={setActiveTab} />

        <div className="app-panel" role="tabpanel">
          {activeTab === 'day' && <CurrentDayView />}
          {activeTab === 'week' && <WeekView />}
          {activeTab === 'quarter' && <QuarterView />}
          {activeTab === 'lookup' && <UserTickerView />}
        </div>
      </main>
    </div>
  );
}
