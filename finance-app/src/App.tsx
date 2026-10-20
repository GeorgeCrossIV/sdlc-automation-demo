/**
 * App.tsx
 * Shell: top nav + time-range tabs for the tracked-company views and company lookup.
 */
import { useState } from 'react';
import { CurrentDayView } from './views/CurrentDayView';
import { WeekView } from './views/WeekView';
import { QuarterView } from './views/QuarterView';
import { CompanyLookupView } from './views/CompanyLookupView';
import type { TimeRange } from './services/stockData';
import './App.css';

const APP_TABS: { label: string; value: TimeRange }[] = [
  { label: 'Today', value: 'day' },
  { label: '7 Days', value: 'week' },
  { label: 'Quarter', value: 'quarter' },
];

function AppTabs({
  activeTab,
  activeView,
  onTabChange,
  onLookupClick,
}: {
  activeTab: TimeRange;
  activeView: 'dashboard' | 'lookup';
  onTabChange: (v: TimeRange) => void;
  onLookupClick: () => void;
}) {
  return (
    <nav className="app-tabs" role="tablist" aria-label="Dashboard view">
      {APP_TABS.map(({ label, value }) => (
        <button
          key={value}
          role="tab"
          aria-selected={activeTab === value}
          className={`app-tab ${activeTab === value ? 'app-tab--active' : ''}`}
          onClick={() => onTabChange(value)}
        >
          {label}
        </button>
      ))}
      <button
        role="tab"
        aria-selected={activeView === 'lookup'}
        className={`app-tab app-tab--lookup ${activeView === 'lookup' ? 'app-tab--active' : ''}`}
        onClick={onLookupClick}
      >
        Company Lookup
      </button>
    </nav>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TimeRange>('day');
  const [activeView, setActiveView] = useState<'dashboard' | 'lookup'>('dashboard');

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
        <AppTabs
          activeTab={activeTab}
          activeView={activeView}
          onTabChange={(range) => setActiveTab(range)}
          onLookupClick={() => setActiveView('lookup')}
        />

        <div className="app-panel" role="tabpanel">
          {activeView === 'lookup' ? (
            <CompanyLookupView range={activeTab} />
          ) : (
            <>
              {activeTab === 'day' && <CurrentDayView />}
              {activeTab === 'week' && <WeekView />}
              {activeTab === 'quarter' && <QuarterView />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
