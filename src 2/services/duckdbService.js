import * as duckdb from "@duckdb/duckdb-wasm";

import duckdbMvpWasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import duckdbEhWasm from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";

import DuckDBMvpWorker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?worker";
import DuckDBEhWorker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?worker";

let db = null;
let connection = null;

const bundles = {
  mvp: {
    mainModule: duckdbMvpWasm,
    mainWorker: DuckDBMvpWorker
  },
  eh: {
    mainModule: duckdbEhWasm,
    mainWorker: DuckDBEhWorker
  }
};

export async function initializeDuckDB(onStatus = () => {}) {
  if (connection) return connection;

  onStatus("Selecting DuckDB bundle…", "loading");

  const selectedBundle = await duckdb.selectBundle(bundles);
  if (!selectedBundle) {
    throw new Error("No compatible DuckDB-Wasm bundle was found.");
  }

  onStatus("Starting DuckDB worker…", "loading");

  const WorkerClass =
    selectedBundle.mainWorker === DuckDBEhWorker
      ? DuckDBEhWorker
      : DuckDBMvpWorker;

  const worker = new WorkerClass();
  const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);

  db = new duckdb.AsyncDuckDB(logger, worker);

  onStatus("Starting query engine…", "loading");
  await db.instantiate(selectedBundle.mainModule);

  connection = await db.connect();
  onStatus("DuckDB Ready", "ready");

  return connection;
}

export function getConnection() {
  if (!connection) {
    throw new Error("DuckDB has not finished initializing.");
  }
  return connection;
}

export async function registerCsvFile(file, internalName) {
  if (!db || !connection) throw new Error("DuckDB is not initialized.");

  const virtualName = `${internalName}.csv`;
  const text = await file.text();

  await db.registerFileText(virtualName, text);

  await connection.query(`
    CREATE OR REPLACE TABLE "${internalName.replaceAll('"', '""')}" AS
    SELECT *
    FROM read_csv_auto(
      '${virtualName.replaceAll("'", "''")}',
      header = true,
      sample_size = 20000
    );
  `);

  return virtualName;
}

export async function registerParquetFile(file, internalName) {
  if (!db || !connection) throw new Error("DuckDB is not initialized.");

  const virtualName = `${internalName}.parquet`;
  const buffer = new Uint8Array(await file.arrayBuffer());

  await db.registerFileBuffer(virtualName, buffer);

  await connection.query(`
    CREATE OR REPLACE TABLE "${internalName.replaceAll('"', '""')}" AS
    SELECT *
    FROM read_parquet('${virtualName.replaceAll("'", "''")}');
  `);

  return virtualName;
}

export async function registerSampleCsv(csvText, tableName = "sample_sales") {
  if (!db || !connection) throw new Error("DuckDB is not initialized.");

  const virtualName = `${tableName}.csv`;
  await db.registerFileText(virtualName, csvText);

  await connection.query(`
    CREATE OR REPLACE TABLE "${tableName.replaceAll('"', '""')}" AS
    SELECT *
    FROM read_csv_auto('${virtualName}', header = true);
  `);

  return virtualName;
}

export async function runSql(sql) {
  const conn = getConnection();
  return conn.query(sql);
}

export async function describeTable(tableName) {
  const conn = getConnection();
  return conn.query(`DESCRIBE "${tableName.replaceAll('"', '""')}";`);
}

export async function countRows(tableName) {
  const conn = getConnection();
  const result = await conn.query(
    `SELECT COUNT(*) AS row_count FROM "${tableName.replaceAll('"', '""')}";`
  );
  return Number(result.toArray()[0].row_count);
}
