# Serverless SQL Studio

A privacy-first browser SQL IDE and data visualizer powered by **DuckDB-Wasm**, **Monaco Editor**, **AG Grid Community**, and **Apache ECharts**.

## Live demo

```text
https://jd-dev-king.github.io/Serverless-SQL-Studio/
```

## Overview

Serverless SQL Studio lets users import local CSV and Parquet files, run analytical SQL, inspect schemas, explore results, build charts, calculate statistics, save queries, and export data without a backend.

All data processing occurs in the browser.

## Features

- DuckDB-Wasm analytical SQL engine
- CSV and Parquet imports
- Monaco SQL editor
- Multiple query tabs
- SQL autocomplete and shortcuts
- AG Grid sorting, filtering, resizing, pagination, and export
- Bar, line, pie, and scatter charts
- PNG chart export
- Result-set statistics
- Saved queries and persistent history
- Built-in Sales, Manufacturing, and Supply Chain demos
- Guided onboarding tour
- Help Center and diagnostics
- Responsive UI
- GitHub Pages deployment

## Technology stack

- Vite
- DuckDB-Wasm
- Monaco Editor
- AG Grid Community
- Apache ECharts
- Apache Arrow
- Tabler Icons

## Local development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173/Serverless-SQL-Studio/
```

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Select **GitHub Actions** as the source.
4. Push to `main`.

The included workflow builds and deploys the `dist` directory.

## Recommended repository description

> Serverless browser SQL IDE for querying CSV and Parquet files locally with DuckDB-Wasm and visualizing results with Apache ECharts.

## Suggested topics

```text
duckdb-wasm
sql
csv
parquet
data-visualization
monaco-editor
ag-grid
echarts
vite
github-pages
```

## License

MIT
