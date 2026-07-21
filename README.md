# Serverless SQL Studio

Milestone **v0.6.0** adds production polish and portfolio-ready demo content.

## Included

- Three built-in demo datasets
  - Sales Analytics
  - Manufacturing KPIs
  - Supply Chain
- One-click demo loading
- Dataset-specific starter SQL
- Automatic query execution after demo load
- Loading overlay
- Success and error toast notifications
- Improved accessibility states
- Reduced-motion support
- Refined demo menu and interaction feedback
- Existing DuckDB, Monaco, AG Grid, ECharts, persistence, CSV, and Parquet functionality

## Install

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

Open:

```text
http://localhost:5173/Serverless-SQL-Studio/
```

## Test checklist

1. Load each built-in demo.
2. Confirm each table appears in Explorer.
3. Confirm starter SQL runs automatically.
4. Verify charts and statistics for each demo.
5. Confirm loading overlays appear during demo loading.
6. Confirm success and error notifications appear.
7. Confirm saved queries and history still persist.
8. Import a local CSV or Parquet file.
9. Test keyboard navigation and reduced-motion behavior.
10. Run `npm run build`.

## Roadmap

- v0.1.0 — UI foundation
- v0.2.0 — DuckDB engine and uploads
- v0.3.0 — Monaco SQL editor and AG Grid
- v0.4.0 — Visualization studio and statistics
- v0.5.0 — Saved queries and persistence
- v0.6.0 — Production polish and demo datasets
- v0.7.0 — Documentation, onboarding, and final QA
- v1.0.0 — Public portfolio release
