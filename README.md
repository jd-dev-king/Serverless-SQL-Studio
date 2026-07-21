# Serverless SQL Studio

A privacy-first browser SQL IDE and data visualizer powered by **DuckDB-Wasm**, **Monaco Editor**, **AG Grid Community**, and **Apache ECharts**.

Users can import local CSV or Parquet files, query them with analytical SQL, explore schemas, profile result sets, create visualizations, save queries, and export results without a backend.

## Why this project matters

Serverless SQL Studio demonstrates:

- Browser-based OLAP with WebAssembly
- Static deployment without a database server
- Client-side CSV and Parquet ingestion
- Modern SQL editor integration
- High-performance data-grid rendering
- Interactive chart generation
- Persistent local workspace state
- Modular frontend architecture
- GitHub Pages deployment

## Current milestone

**v0.7.0 — Documentation, onboarding, and final QA**

This milestone adds:

- First-run onboarding
- Built-in help center
- Keyboard shortcut reference
- Escape and backdrop modal dismissal
- Help button in the application toolbar
- Resettable onboarding state
- Improved project documentation
- Accessibility and usability refinements

## Features

### Data engine
- DuckDB-Wasm running entirely in the browser
- CSV ingestion
- Parquet ingestion
- Multiple registered tables
- Schema inspection
- Row counts

### SQL workspace
- Monaco Editor
- SQL syntax highlighting
- Keyword and table autocomplete
- Multiple query tabs
- Saved queries
- Query history
- Cmd/Ctrl + Enter execution
- Cmd/Ctrl + S saving

### Results
- AG Grid Community
- Sorting
- Filtering
- Pagination
- Resizable columns
- Quick search
- CSV export

### Visualization
- Bar charts
- Line charts
- Pie charts
- Scatter charts
- Interactive tooltips
- Data zoom
- PNG export

### Statistics
- Rows and columns
- Null counts
- Unique values
- Min and max
- Mean
- Median
- Standard deviation

### Demo datasets
- Sales Analytics
- Manufacturing KPIs
- Supply Chain

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

## GitHub Pages

The included GitHub Actions workflow builds the Vite app and deploys `dist`.

In GitHub:

```text
Settings → Pages → Source → GitHub Actions
```

Expected URL:

```text
https://jd-dev-king.github.io/Serverless-SQL-Studio/
```

## Project structure

```text
src/
├── components/
├── services/
├── state/
├── styles/
├── utils/
├── App.js
└── main.js
```

## Final QA checklist

- DuckDB initializes
- All three demos load
- CSV import works
- Parquet import works
- Monaco query execution works
- Query tabs persist
- Saved queries persist
- AG Grid sorting and filtering work
- Bar, line, pie, and scatter charts work
- PNG export works
- Statistics render correctly
- Query history persists
- Reset Workspace works
- Production build succeeds
- GitHub Pages base path is correct

## Roadmap

- v0.1.0 — UI foundation
- v0.2.0 — DuckDB engine and uploads
- v0.3.0 — Monaco SQL editor and AG Grid
- v0.4.0 — Visualization studio and statistics
- v0.5.0 — Saved queries and persistence
- v0.6.0 — Production polish and demo datasets
- v0.7.0 — Documentation, onboarding, and final QA
- v1.0.0 — Public portfolio release
