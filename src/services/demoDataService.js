export const DEMO_DATASETS = [
  {
    id: "sales",
    name: "Sales Analytics",
    description: "Revenue, units, region, and category performance.",
    file: "sample-data/sales_demo.csv",
    tableName: "demo_sales",
    defaultQuery: `SELECT
  category,
  SUM(revenue) AS total_revenue,
  SUM(units) AS total_units
FROM demo_sales
GROUP BY category
ORDER BY total_revenue DESC;`
  },
  {
    id: "manufacturing",
    name: "Manufacturing KPIs",
    description: "Production, scrap, downtime, and OEE by line and shift.",
    file: "sample-data/manufacturing_demo.csv",
    tableName: "demo_manufacturing",
    defaultQuery: `SELECT
  line,
  ROUND(AVG(oee_percent), 1) AS avg_oee,
  SUM(downtime_minutes) AS total_downtime,
  SUM(scrap_units) AS total_scrap
FROM demo_manufacturing
GROUP BY line
ORDER BY avg_oee DESC;`
  },
  {
    id: "supply-chain",
    name: "Supply Chain",
    description: "Supplier lead time, quality, delivery, and spend.",
    file: "sample-data/supply_chain_demo.csv",
    tableName: "demo_supply_chain",
    defaultQuery: `SELECT
  supplier,
  lead_time_days,
  on_time_percent,
  defect_percent,
  annual_spend
FROM demo_supply_chain
ORDER BY on_time_percent DESC;`
  }
];

export async function fetchDemoDataset(dataset) {
  const response = await fetch(`${import.meta.env.BASE_URL}${dataset.file}`);

  if (!response.ok) {
    throw new Error(`Could not load ${dataset.name}.`);
  }

  return response.text();
}

export function getDemoDataset(id) {
  return DEMO_DATASETS.find((dataset) => dataset.id === id);
}
