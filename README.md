# Serverless SQL Studio

A privacy-first browser SQL IDE and data visualizer powered by DuckDB-Wasm, Monaco Editor, AG Grid Community, and Apache ECharts.

## Current milestone

**v0.8.0 — Release Candidate and Deployment Diagnostics**

This milestone adds:

- About panel
- Browser compatibility checks
- Deployment diagnostics
- Copyable environment details
- File-size safeguards
- Large-result guidance
- GitHub Pages base-path verification
- Release-candidate labeling
- Existing onboarding, demos, saved queries, charts, statistics, CSV, and Parquet support

## Recommended browser limits

- CSV: up to 500 MB
- Parquet: up to 1 GB

Actual limits depend on browser memory, device capacity, query complexity, and result size.

## Final release checks

```bash
npm install
npm run build
npm run preview
```

Verify:

- DuckDB reaches Ready
- CSV and Parquet import
- All demo datasets
- Monaco query tabs
- AG Grid sorting/filtering/export
- Bar, line, pie, and scatter charts
- PNG export
- Statistics
- Saved queries and history
- Onboarding and Help
- About diagnostics
- GitHub Pages base path
- Mobile layout

## Roadmap

- v0.1.0 — UI foundation
- v0.2.0 — DuckDB engine and uploads
- v0.3.0 — Monaco SQL editor and AG Grid
- v0.4.0 — Visualization studio and statistics
- v0.5.0 — Saved queries and persistence
- v0.6.0 — Production polish and demo datasets
- v0.7.0 — Documentation, onboarding, and final QA
- v0.8.0 — Release candidate and diagnostics
- v1.0.0 — Public portfolio release
