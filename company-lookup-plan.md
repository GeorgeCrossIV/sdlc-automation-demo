# Company Lookup Feature — Implementation Plan

## Top-Level Overview

**Goal:** Add a "Company Lookup" tab to the Finance Analytics Dashboard that allows a user to type any stock ticker symbol (1–5 uppercase letters) and view its historical price chart across the existing Today / 7 Days / Quarter time ranges.

**Scope:** Four focused changes — (1) extend the mock data service to support arbitrary tickers, (2) build a new hook and view for user-entered tickers, (3) wire a new top-level tab into `App.tsx`, and (4) add tests and update the existing tab-count assertion. Existing views must remain completely untouched.

**Approach:** Reuse all existing abstractions (`fetchStockSeries`, `StockChart`, `TimeRangeTabs`, `useStockData` pattern). The new feature adds a thin lookup layer on top of them. No changes to `TRACKED_COMPANIES`, existing hooks, or existing views.

**Navigation layout:** The "Company Lookup" button lives in a visually distinct, separate section of the nav bar (e.g. right-aligned or separated by a divider) — not grouped with the time-range tabs.

**Time-range interaction:** While on the Lookup tab, clicking a time-range button (Today / 7 Days / Quarter) keeps the user on the Lookup tab and re-fetches the last searched ticker for the new range — the chart updates in place.

---

## Sub-Tasks

---

### Sub-Task 1 — Extend mock data service to support arbitrary tickers

**Intent**
`generateMockSeries` already handles unknown tickers via a `BASE_PRICES[ticker] ?? 100` fallback, so any ticker already produces valid mock data. However, `fetchStockSeries` will also be called by the new hook with a single user-supplied ticker (not from `TRACKED_COMPANIES`). No code change is strictly required in the service itself — but this sub-task validates that assumption with a focused test and documents the behavior so later sub-tasks can rely on it.

**Expected Outcomes**
- A test confirms `fetchStockSeries` returns valid series data (correct data-point counts, positive prices, valid timestamps) for an arbitrary ticker like `AAPL` or `XYZ` in all three ranges.
- No changes to `stockData.ts` are needed (the fallback already works).

**Todo List**
1. Add a new `describe` block in `finance-app/src/__tests__/stockData.test.ts` titled `"fetchStockSeries — arbitrary ticker (mock)"`.
2. Add tests for `AAPL` (not in `BASE_PRICES`) across all three ranges: verify data-point counts (78 / 5 / 65) and that prices are positive.
3. Run `npm run validate` inside `finance-app/` to confirm all tests pass.

**Relevant Context**
- [`stockData.ts` — `generateMockSeries()`](finance-app/src/services/stockData.ts:49) — fallback `BASE_PRICES[ticker] ?? 100` means unknown tickers work as-is.
- [`stockData.test.ts`](finance-app/src/__tests__/stockData.test.ts) — existing test file to extend.

**Status:** [x] done

---

### Sub-Task 2 — Build `useTickerLookup` hook

**Intent**
Create a dedicated hook that manages the full lifecycle for a user-entered ticker search: input state, validation, fetch trigger, loading/error/result state. Keeping this logic in a hook (not in the view) maintains the same separation of concerns used by `useStockData`.

**Expected Outcomes**
- New file `finance-app/src/hooks/useTickerLookup.ts` is created.
- The hook exports: `{ symbol, setSymbol, search, series, loading, error }`.
- Client-side validation: reject symbols that are not 1–5 uppercase letters (regex `/^[A-Z]{1,5}$/`) before any fetch; set a validation error instead.
- On valid submit, calls `fetchStockSeries([{ ticker, name: ticker }], range)`.
- Cancellation on unmount and range-change follow the same `cancelled` flag pattern as `useStockData`.
- A unit test file `finance-app/src/__tests__/useTickerLookup.test.ts` is created covering: (a) validation rejects bad input, (b) valid submit triggers fetch and returns series, (c) cancellation on unmount does not update state.

**Todo List**
1. Create `finance-app/src/hooks/useTickerLookup.ts` — export `useTickerLookup(range: TimeRange)`.
2. State: `symbol` (controlled input string), `pending` (symbol submitted but not yet validated/fetched), `series`, `loading`, `error`.
3. Expose a `search(raw: string)` function that: uppercases input, validates against `/^[A-Z]{1,5}$/`, sets error on failure, otherwise triggers a fetch.
4. On `range` change, re-fetch the last valid symbol if one exists (consistent with the existing views' behavior).
5. Create `finance-app/src/__tests__/useTickerLookup.test.ts` — use `renderHook` from `@testing-library/react`.
6. Run `npm run validate` to confirm green.

**Relevant Context**
- [`useStockData.ts`](finance-app/src/hooks/useStockData.ts) — the cancellation and error-handling pattern to replicate.
- [`stockData.ts` — `fetchStockSeries()`](finance-app/src/services/stockData.ts:96) — the function to call.

**Status:** [x] done

---

### Sub-Task 3 — Build `CompanyLookupView` component

**Intent**
Create the UI for the new tab: a search form (text input + button), validation/error display, and a chart panel that renders when a result is available. The view delegates all state logic to `useTickerLookup` and all charting to the existing `StockChart`.

**Expected Outcomes**
- New file `finance-app/src/views/CompanyLookupView.tsx` is created.
- Renders a labeled text input (accessible `<label>`) and a "Search" `<button>`.
- Input is controlled; pressing the button or Enter submits via the hook's `search()` function.
- Shows a validation/fetch error with `role="alert"` for accessibility.
- Shows a loading state while fetching.
- Renders `<StockChart series={series} range={range} />` once data is available.
- The displayed heading shows the resolved ticker, e.g. `"AAPL — Price History"`.
- A component test `finance-app/src/__tests__/CompanyLookupView.test.tsx` is created covering: (a) renders the form, (b) shows error for invalid ticker, (c) renders a chart after a valid search.

**Todo List**
1. Create `finance-app/src/views/CompanyLookupView.tsx`.
2. Accept a `range: TimeRange` prop so the parent (`App`) controls the time range.
3. Use `useTickerLookup(range)` for all state management.
4. Input `type="text"` with `aria-label` or associated `<label>`, `maxLength={5}`, placeholder `"e.g. AAPL"`.
5. Error message: `<p role="alert" className="status error">`.
6. Chart section: only render when `series.length > 0`.
7. Create `finance-app/src/__tests__/CompanyLookupView.test.tsx`.
8. Run `npm run validate` to confirm green.

**Relevant Context**
- [`CurrentDayView.tsx`](finance-app/src/views/CurrentDayView.tsx) — pattern for loading/error/chart rendering.
- [`StockChart.tsx`](finance-app/src/components/StockChart.tsx) — accepts `series: StockSeries[]` and `range: TimeRange`.
- [`App.css`](finance-app/src/App.css) — existing `.status` and `.error` class names to reuse.

**Status:** [x] done

---

### Sub-Task 4 — Add "Company Lookup" tab to `App.tsx`

**Intent**
Wire the new view into the shell's navigation. The top-level navigation currently manages only `TimeRange` tab state. The new tab is a different *mode* (not a time range), so a separate `activeView` state (e.g. `'dashboard' | 'lookup'`) is introduced alongside the existing `activeTab` (time range). Time-range tabs remain visible while on the lookup view so the user can switch time ranges without leaving the lookup.

**Expected Outcomes**
- A "Company Lookup" button appears in the top navigation alongside Today / 7 Days / Quarter.
- Clicking it renders `<CompanyLookupView range={activeTab} />` in the panel area.
- The time-range tabs remain rendered and functional while on the Lookup view.
- Clicking Today / 7 Days / Quarter while on Lookup switches back to the tracked-company dashboard view.
- Existing Today / 7 Days / Quarter views render identically to before — no regressions.

**Todo List**
1. In `App.tsx`, add `activeView` state: `useState<'dashboard' | 'lookup'>('dashboard')`.
2. Add a "Company Lookup" button to the `<nav>` (next to or separate from time-range tabs), styled with the existing `app-tab` / `app-tab--active` classes.
3. When a time-range tab is clicked while `activeView === 'lookup'`, switch `activeView` to `'dashboard'` and set the range — or keep the view as `'lookup'` but update the range. Per the issue acceptance criteria ("over the currently selected time range"), keep Lookup active and just update the time range.
4. In the panel, conditionally render `<CompanyLookupView range={activeTab} />` vs. the existing time-range views.
5. Update the existing `TimeRangeTabs.test.tsx` tab-count assertion if the test counted top-level nav buttons — verify first.
6. Add an integration test in `finance-app/src/__tests__/App.test.tsx` (create if absent) covering: navigation to Lookup tab shows the search form; navigating back to Today shows the IBM chart header.
7. Run `npm run validate` to confirm all gates pass.

**Relevant Context**
- [`App.tsx`](finance-app/src/App.tsx) — shell to extend; currently uses `APP_TABS` array + `AppTabs` component internally.
- [`TimeRangeTabs.test.tsx`](finance-app/src/__tests__/TimeRangeTabs.test.tsx:10) — asserts `toHaveLength(3)` on `role="tab"` buttons; verify scope (it tests `TimeRangeTabs` component directly, not `App`, so may not need updating).
- [`App.css`](finance-app/src/App.css) — existing tab classes available for the new button.

**Status:** [x] done

---

## Validation Gate

After all sub-tasks are complete, run the full validation pipeline from `finance-app/`:

```
npm run validate
```

This executes lint (oxlint) → test (vitest, VITE_USE_MOCK=true) → build (vite). All three must pass with zero new warnings before the feature is considered done.
