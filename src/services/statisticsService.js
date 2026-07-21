export function profileResultSet(columns, rows) {
  return {
    summary: {
      rows: rows.length,
      columns: columns.length,
      nulls: columns.reduce(
        (total, column) =>
          total + rows.filter((row) => row[column] == null).length,
        0
      ),
      numericColumns: columns.filter((column) =>
        rows.some((row) => isNumeric(row[column]))
      ).length
    },
    columns: columns.map((column) => profileColumn(column, rows))
  };
}

function profileColumn(name, rows) {
  const values = rows.map((row) => row[name]);
  const nonNullValues = values.filter((value) => value != null);
  const numericValues = nonNullValues
    .filter(isNumeric)
    .map((value) => Number(value));

  const uniqueValues = new Set(
    nonNullValues.map((value) =>
      typeof value === "object" ? JSON.stringify(value) : String(value)
    )
  );

  const type = inferType(nonNullValues);

  const profile = {
    name,
    type,
    count: values.length,
    nonNull: nonNullValues.length,
    nulls: values.length - nonNullValues.length,
    unique: uniqueValues.size,
    min: null,
    max: null,
    mean: null,
    median: null,
    standardDeviation: null
  };

  if (numericValues.length) {
    const sorted = [...numericValues].sort((a, b) => a - b);
    const mean =
      numericValues.reduce((sum, value) => sum + value, 0) /
      numericValues.length;
    const variance =
      numericValues.reduce(
        (sum, value) => sum + Math.pow(value - mean, 2),
        0
      ) / numericValues.length;

    profile.min = sorted[0];
    profile.max = sorted[sorted.length - 1];
    profile.mean = mean;
    profile.median =
      sorted.length % 2
        ? sorted[Math.floor(sorted.length / 2)]
        : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
    profile.standardDeviation = Math.sqrt(variance);
  } else if (nonNullValues.length) {
    const stringValues = nonNullValues.map(String).sort();
    profile.min = stringValues[0];
    profile.max = stringValues[stringValues.length - 1];
  }

  return profile;
}

function inferType(values) {
  if (!values.length) return "UNKNOWN";
  if (values.every(isNumeric)) return "NUMERIC";
  if (values.every((value) => value instanceof Date)) return "DATE";
  if (values.every((value) => typeof value === "boolean")) return "BOOLEAN";
  return "TEXT";
}

function isNumeric(value) {
  if (typeof value === "number" || typeof value === "bigint") {
    return Number.isFinite(Number(value));
  }

  if (typeof value !== "string" || value.trim() === "") return false;
  return Number.isFinite(Number(value));
}
