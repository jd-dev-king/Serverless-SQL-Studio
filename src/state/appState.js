export const appState = {
  tables: new Map(),
  activeTable: null,
  resultRows: [],
  resultColumns: [],
  queryRunning: false,
  initialized: false,
  editor: null,
  gridApi: null,
  queries: [
    {
      id: crypto.randomUUID(),
      name: "Query 1",
      sql: `SELECT
  category,
  SUM(revenue) AS total_revenue,
  SUM(units) AS total_units
FROM sample_sales
GROUP BY category
ORDER BY total_revenue DESC;`
    }
  ],
  activeQueryId: null
};

appState.activeQueryId = appState.queries[0].id;
