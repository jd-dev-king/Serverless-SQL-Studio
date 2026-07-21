# Serverless SQL Studio

Milestone **v0.5.0** adds browser persistence and saved workspace features.

## Included

- Saved SQL queries
- Query naming
- Restored query tabs after refresh
- Restored active query
- Persistent recent query history
- Persistent chart preference
- Saved Query explorer
- Reset workspace control
- Up to 50 stored history records
- Existing DuckDB, Monaco, AG Grid, ECharts, CSV, and Parquet functionality

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

1. Create several query tabs.
2. Edit SQL in each tab.
3. Save and name a query.
4. Refresh the browser.
5. Confirm tabs and SQL are restored.
6. Run several queries.
7. Refresh and confirm History is restored.
8. Change the chart type and refresh.
9. Confirm the saved query appears in the sidebar.
10. Test Reset Workspace.

## Roadmap

- v0.1.0 — UI foundation
- v0.2.0 — DuckDB engine and uploads
- v0.3.0 — Monaco SQL editor and AG Grid
- v0.4.0 — Visualization studio and statistics
- v0.5.0 — Saved queries and persistence
- v0.6.0 — Production polish and demo datasets
- v1.0.0 — Public portfolio release
