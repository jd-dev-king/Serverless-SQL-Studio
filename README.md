# Serverless SQL Studio

Milestone **v0.3.0** upgrades the SQL workspace and results experience.

## Included

- Monaco SQL editor
- SQL syntax highlighting
- SQL keyword and table autocomplete
- Cmd/Ctrl + Enter query execution
- Cmd/Ctrl + S session save shortcut
- Multiple query tabs
- Query creation, switching, and closing
- AG Grid Community results table
- Sorting and filtering
- Resizable columns
- Pagination
- Quick result filtering
- CSV export
- Automatic column sizing
- Existing DuckDB-Wasm CSV/Parquet functionality

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

1. Wait for DuckDB Ready.
2. Run the default query.
3. Sort and filter grid columns.
4. Use the result search box.
5. Resize columns.
6. Export query results.
7. Create a new query tab.
8. Switch between query tabs.
9. Use Cmd/Ctrl + Enter.
10. Import a CSV or Parquet file.

## Roadmap

- v0.1.0 — UI foundation
- v0.2.0 — DuckDB engine and uploads
- v0.3.0 — Monaco SQL editor and AG Grid
- v0.4.0 — Visualization studio and statistics
- v0.5.0 — Saved queries and persistence
- v1.0.0 — Public portfolio release
