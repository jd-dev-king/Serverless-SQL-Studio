import { runSql } from "./duckdbService.js";

export async function executeQuery(sql) {
  const startedAt = performance.now();
  const arrowResult = await runSql(sql);
  const elapsedMs = performance.now() - startedAt;

  const columns = arrowResult.schema.fields.map((field) => field.name);
  const rows = arrowResult.toArray().map((row) => {
    const normalized = {};

    for (const column of columns) {
      normalized[column] = normalizeValue(row[column]);
    }

    return normalized;
  });

  return {
    columns,
    rows,
    elapsedMs
  };
}

function normalizeValue(value) {
  if (typeof value === "bigint") return Number(value);
  if (value instanceof Date) return value.toISOString();

  if (value && typeof value === "object") {
    try {
      return JSON.parse(
        JSON.stringify(value, (_, nested) =>
          typeof nested === "bigint" ? Number(nested) : nested
        )
      );
    } catch {
      return String(value);
    }
  }

  return value;
}
