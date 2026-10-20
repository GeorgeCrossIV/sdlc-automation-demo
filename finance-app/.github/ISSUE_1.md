---
title: "Add a graph for a user selected company"
labels: enhancement
---

## Summary

The existing dashboard tracks IBM and four competitors (MSFT, GOOGL, AMZN, ORCL) across three fixed time ranges (Today, 7 Days, Quarter). Users have requested the ability to enter **any stock ticker** and see its price history on a dedicated chart.

## Acceptance Criteria

- A new **"Company Lookup"** tab is added to the dashboard navigation.
- The user can type any stock ticker symbol (1–5 letters) into an input field and press **Search**.
- Upon submission, a line chart is rendered showing the historical prices for the entered symbol over the currently selected time range (Today / 7 Days / Quarter).
- If the entered symbol is **invalid** (wrong format, not found), a clear, accessible error message is displayed.
- The existing **Today**, **7 Days**, and **Quarter** views remain **unchanged**.
- All new code must pass the existing lint, test, and build gates (`npm run validate`).

## Out of scope

- Comparing the user-selected ticker against the tracked companies on the same chart.
- Real-time streaming prices.
- Persisting previously searched tickers.

## Notes

- In CI and offline development, the app runs with `VITE_USE_MOCK=true` — mock data must be generated for any valid ticker symbol so the feature is fully testable without a live API.
- Input validation should be client-side: reject symbols that are not 1–5 uppercase letters before making any data request.
