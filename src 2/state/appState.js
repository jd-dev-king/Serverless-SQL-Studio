export const DEFAULT_QUERY = `SELECT
  category,
  SUM(revenue) AS total_revenue,
  SUM(units) AS total_units
FROM sample_sales
GROUP BY category
ORDER BY total_revenue DESC;`;

export const appState = {
  tables: new Map(),
  activeTable: null,
  resultRows: [],
  resultColumns: [],
  queryRunning: false,
  initialized: false,
  editor: null,
  gridApi: null,
  queries: [],
  activeQueryId: null,
  preferences: {
    chartType: "bar",
    pageSize: 100
  }
};

export function createDefaultQuery(name = "Query 1") {
  return {
    id: crypto.randomUUID(),
    name,
    sql: DEFAULT_QUERY,
    savedAt: null
  };
}
