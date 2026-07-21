import {
  registerCsvFile,
  registerParquetFile,
  countRows
} from "./duckdbService.js";

export async function importDataset(file, existingNames = new Set()) {
  const extension = getExtension(file.name);

  validateFileSize(file, extension);

  if (!["csv", "parquet"].includes(extension)) {
    throw new Error("Only CSV and Parquet files are supported.");
  }

  const tableName = createUniqueTableName(file.name, existingNames);

  if (extension === "csv") {
    await registerCsvFile(file, tableName);
  } else {
    await registerParquetFile(file, tableName);
  }

  const rowCount = await countRows(tableName);

  return {
    name: tableName,
    filename: file.name,
    type: extension.toUpperCase(),
    size: file.size,
    rows: rowCount
  };
}

function getExtension(filename) {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

function createUniqueTableName(filename, existingNames) {
  const base = filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");

  let candidate = base || `dataset_${Date.now()}`;

  if (/^\d/.test(candidate)) {
    candidate = `data_${candidate}`;
  }

  let suffix = 2;
  const original = candidate;

  while (existingNames.has(candidate)) {
    candidate = `${original}_${suffix}`;
    suffix += 1;
  }

  return candidate;
}


function validateFileSize(file, extension) {
  const maxCsvBytes = 500 * 1024 * 1024;
  const maxParquetBytes = 1024 * 1024 * 1024;

  const limit = extension === "parquet" ? maxParquetBytes : maxCsvBytes;

  if (file.size > limit) {
    const limitMb = Math.round(limit / 1024 / 1024);
    throw new Error(
      `${file.name} exceeds the recommended ${limitMb} MB browser limit.`
    );
  }
}
