# Serverless SQL Studio

A privacy-first browser SQL IDE and data visualizer powered by DuckDB-Wasm, Monaco Editor, AG Grid Community, and Apache ECharts.

## Current milestone

**v0.9.0 — Guided Product Tour and Pre-Release Polish**

This milestone adds:

- Three-step onboarding tour
- Step progress indicator
- Welcome, Load Data, and Analyze stages
- Back and Next navigation
- “Don't show again” preference
- Skip Tour behavior
- Start Exploring action
- Take the Tour Again option in Help
- Reset Workspace restores first-run onboarding
- Existing release diagnostics, demos, persistence, visualizations, statistics, and imports

## Tour behavior

- First visit: onboarding appears automatically.
- Start Exploring: marks onboarding complete and loads the Sales demo.
- Skip Tour: closes the tour.
- Don't show again checked: the tour remains hidden on future visits.
- Don't show again unchecked: the tour may appear again.
- Help → Take the Tour Again: restarts the tour at Step 1.
- Reset Workspace: clears onboarding state.

## Final pre-release checklist

```bash
npm install
npm run build
npm run preview
```

Verify:

- Tour opens on first visit
- Progress advances 1/3 → 2/3 → 3/3
- Back and Next work
- Skip Tour works
- Don't show again persists
- Help can restart the tour
- Start Exploring loads Sales demo
- DuckDB initializes
- CSV and Parquet import
- Monaco, AG Grid, charts, statistics
- Saved queries and history
- About diagnostics
- GitHub Pages preview

## Roadmap

- v0.1.0 — UI foundation
- v0.2.0 — DuckDB engine and uploads
- v0.3.0 — Monaco SQL editor and AG Grid
- v0.4.0 — Visualization studio and statistics
- v0.5.0 — Saved queries and persistence
- v0.6.0 — Production polish and demo datasets
- v0.7.0 — Documentation, onboarding, and final QA
- v0.8.0 — Release candidate and diagnostics
- v0.9.0 — Guided product tour and pre-release polish
- v1.0.0 — Public portfolio release
