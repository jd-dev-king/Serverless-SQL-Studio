import { appState } from "../state/appState.js";
import {
  initializeDuckDB,
  registerSampleCsv,
  describeTable,
  countRows
} from "../services/duckdbService.js";
import { executeQuery } from "../services/queryService.js";
import { importDataset } from "../services/uploadService.js";
import { loadSampleCsv } from "../services/sampleDataService.js";
import {
  createSqlEditor,
  getEditorValue,
  setEditorValue,
  formatSql,
  registerTableCompletions
} from "../services/editorService.js";
import {
  createResultsGrid,
  setGridData,
  clearGrid,
  setQuickFilter,
  exportGridCsv
} from "../services/gridService.js";

const queryHistory = [];

export async function initializeApp() {
  bindTabs();
  bindSidebar();
  bindControls();
  renderQueryTabs();

  appState.gridApi = createResultsGrid(document.querySelector("#resultsGrid"));

  const activeQuery = getActiveQuery();
  appState.editor = await createSqlEditor(
    document.querySelector("#monacoEditor"),
    activeQuery.sql,
    runCurrentQuery
  );

  registerTableCompletions(() => [...appState.tables.values()]);

  try {
    await initializeDuckDB(setEngineStatus);
    await ensureSampleTable();

    appState.initialized = true;
    enableQueryButtons(true);
    setEngineStatus("DuckDB Ready", "ready");
    setQueryStatus("Sample dataset ready.");

    await runCurrentQuery();
  } catch (error) {
    console.error(error);
    setEngineStatus("DuckDB failed", "error");
    setQueryStatus(error.message);
    setResultStatus("Engine error", "error");
  }
}

async function ensureSampleTable() {
  const sampleCsv = await loadSampleCsv();
  await registerSampleCsv(sampleCsv, "sample_sales");
  const rows = await countRows("sample_sales");

  appState.tables.set("sample_sales", {
    name: "sample_sales",
    filename: "sample_sales.csv",
    type: "CSV",
    size: new Blob([sampleCsv]).size,
    rows
  });
  appState.activeTable = "sample_sales";

  renderTables();
  await renderSchema("sample_sales");
}

function bindTabs() {
  const tabs = document.querySelectorAll(".result-tab");
  const views = document.querySelectorAll(".result-view");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      views.forEach((view) => view.classList.remove("active"));

      tab.classList.add("active");
      document.querySelector(`#${tab.dataset.panel}Panel`)?.classList.add("active");
    });
  });
}

function bindSidebar() {
  document.querySelector("#mobileMenuBtn")?.addEventListener("click", () => {
    document.querySelector("#sidebar")?.classList.toggle("open");
  });

  document.querySelector("#tableSearch")?.addEventListener("input", (event) => {
    renderTables(event.target.value);
  });
}

function bindControls() {
  const fileInput = document.querySelector("#fileInput");

  ["#importCsvBtn", "#sidebarImportBtn"].forEach((selector) => {
    document.querySelector(selector)?.addEventListener("click", () => fileInput?.click());
  });

  fileInput?.addEventListener("change", async (event) => {
    await handleFiles(event.target.files);
    fileInput.value = "";
  });

  document.querySelector("#loadDemoBtn")?.addEventListener("click", async () => {
    await ensureSampleTable();
    setQueryStatus("Demo dataset loaded.");
  });

  ["#runQueryBtn", "#workspaceRunBtn"].forEach((selector) => {
    document.querySelector(selector)?.addEventListener("click", runCurrentQuery);
  });

  document.querySelector("#previewTableBtn")?.addEventListener("click", () => {
    if (!appState.activeTable) return;
    setEditorValue(`SELECT *\nFROM "${appState.activeTable}"\nLIMIT 100;`);
    updateActiveQueryFromEditor();
  });

  document.querySelector("#formatQueryBtn")?.addEventListener("click", formatSql);
  document.querySelector("#saveQueryBtn")?.addEventListener("click", saveActiveQuery);
  document.querySelector("#newQueryBtn")?.addEventListener("click", createNewQuery);
  window.addEventListener("save-query", saveActiveQuery);

  document.querySelector("#gridSearchInput")?.addEventListener("input", (event) => {
    setQuickFilter(event.target.value);
  });

  document.querySelector("#autosizeColumnsBtn")?.addEventListener("click", () => {
    appState.gridApi?.autoSizeAllColumns(false);
  });

  document.querySelector("#downloadResultsBtn")?.addEventListener("click", exportGridCsv);
}

async function handleFiles(fileList) {
  const files = [...fileList];
  const existingNames = new Set(appState.tables.keys());

  for (const file of files) {
    try {
      setQueryStatus(`Importing ${file.name}…`);
      setEngineStatus(`Importing ${file.name}…`, "loading");

      const table = await importDataset(file, existingNames);
      appState.tables.set(table.name, table);
      existingNames.add(table.name);
      appState.activeTable = table.name;

      renderTables();
      await renderSchema(table.name);

      setEditorValue(`SELECT *\nFROM "${table.name}"\nLIMIT 100;`);
      updateActiveQueryFromEditor();

      setQueryStatus(`${file.name} imported as ${table.name}.`);
    } catch (error) {
      console.error(error);
      setQueryStatus(`Import failed: ${error.message}`);
    }
  }

  setEngineStatus("DuckDB Ready", "ready");
}

async function runCurrentQuery() {
  if (appState.queryRunning || (!appState.initialized && !appState.tables.size)) return;

  const sql = getEditorValue().trim();
  if (!sql) return;

  updateActiveQueryFromEditor();
  appState.queryRunning = true;
  enableQueryButtons(false);
  setResultStatus("Running query…", "loading");
  setQueryStatus("Executing SQL…");

  try {
    const result = await executeQuery(sql);

    appState.resultColumns = result.columns;
    appState.resultRows = result.rows;

    setGridData(result.columns, result.rows);
    updateQueryMetrics(result.rows.length, result.elapsedMs);
    setResultStatus("Query completed", "success");
    setQueryStatus("Query completed successfully.");

    document.querySelector("#downloadResultsBtn").disabled = result.rows.length === 0;

    queryHistory.unshift({
      sql,
      rows: result.rows.length,
      elapsedMs: result.elapsedMs,
      time: new Date()
    });
    renderHistory();
  } catch (error) {
    console.error(error);
    setResultStatus("Query failed", "error");
    setQueryStatus(error.message);
    clearGrid();
  } finally {
    appState.queryRunning = false;
    enableQueryButtons(true);
  }
}

function renderQueryTabs() {
  const tabs = document.querySelector("#queryTabs");

  tabs.innerHTML = `
    ${appState.queries.map((query) => `
      <button class="query-tab ${query.id === appState.activeQueryId ? "active" : ""}"
        data-query="${query.id}">
        <i class="ti ti-file-code"></i>
        <span>${escapeHtml(query.name)}</span>
        ${appState.queries.length > 1
          ? `<span class="query-close" data-close-query="${query.id}" title="Close query">×</span>`
          : ""}
      </button>
    `).join("")}
    <button class="query-tab-add" id="queryTabAdd" aria-label="New query">
      <i class="ti ti-plus"></i>
    </button>
  `;

  tabs.querySelectorAll("[data-query]").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (event.target.closest("[data-close-query]")) return;
      switchQuery(button.dataset.query);
    });
  });

  tabs.querySelectorAll("[data-close-query]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      closeQuery(button.dataset.closeQuery);
    });
  });

  document.querySelector("#queryTabAdd")?.addEventListener("click", createNewQuery);
}

function createNewQuery() {
  updateActiveQueryFromEditor();

  const query = {
    id: crypto.randomUUID(),
    name: `Query ${appState.queries.length + 1}`,
    sql: appState.activeTable
      ? `SELECT *\nFROM "${appState.activeTable}"\nLIMIT 100;`
      : "SELECT 1;"
  };

  appState.queries.push(query);
  appState.activeQueryId = query.id;
  renderQueryTabs();
  setEditorValue(query.sql);
}

function switchQuery(queryId) {
  updateActiveQueryFromEditor();
  appState.activeQueryId = queryId;
  renderQueryTabs();
  setEditorValue(getActiveQuery().sql);
}

function closeQuery(queryId) {
  if (appState.queries.length === 1) return;

  const index = appState.queries.findIndex((query) => query.id === queryId);
  const wasActive = appState.activeQueryId === queryId;
  appState.queries.splice(index, 1);

  if (wasActive) {
    const next = appState.queries[Math.max(0, index - 1)];
    appState.activeQueryId = next.id;
    setEditorValue(next.sql);
  }

  renderQueryTabs();
}

function saveActiveQuery() {
  updateActiveQueryFromEditor();
  setQueryStatus(`${getActiveQuery().name} saved for this session.`);
}

function updateActiveQueryFromEditor() {
  const query = getActiveQuery();
  if (query) query.sql = getEditorValue();
}

function getActiveQuery() {
  return appState.queries.find((query) => query.id === appState.activeQueryId);
}

function renderTables(filter = "") {
  const list = document.querySelector("#tableList");
  const tables = [...appState.tables.values()].filter((table) =>
    table.name.toLowerCase().includes(filter.toLowerCase())
  );

  document.querySelector("#tableCount").textContent = appState.tables.size;

  list.innerHTML = tables.length
    ? tables.map((table) => `
      <button class="tree-item ${table.name === appState.activeTable ? "active" : ""}"
        data-table="${escapeHtml(table.name)}">
        <span class="tree-icon table-icon">T</span>
        <span>
          <strong>${escapeHtml(table.name)}</strong>
          <small>${table.rows.toLocaleString()} rows · ${table.type}</small>
        </span>
      </button>
    `).join("")
    : `<div class="sidebar-empty">No matching tables.</div>`;

  list.querySelectorAll("[data-table]").forEach((button) => {
    button.addEventListener("click", async () => {
      appState.activeTable = button.dataset.table;
      renderTables(document.querySelector("#tableSearch")?.value ?? "");
      await renderSchema(appState.activeTable);
    });

    button.addEventListener("dblclick", () => {
      setEditorValue(`SELECT *\nFROM "${button.dataset.table}"\nLIMIT 100;`);
      updateActiveQueryFromEditor();
    });
  });
}

async function renderSchema(tableName) {
  const result = await describeTable(tableName);
  const rows = result.toArray();

  document.querySelector("#schemaContent").innerHTML = `
    <div class="schema-table-wrap">
      <div class="schema-heading">
        <strong>${escapeHtml(tableName)}</strong>
        <span>${rows.length} columns</span>
      </div>
      <table class="schema-table">
        <thead>
          <tr><th>Column</th><th>Type</th><th>Nullable</th></tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>${escapeHtml(String(row.column_name))}</td>
              <td><span class="type-pill">${escapeHtml(String(row.column_type))}</span></td>
              <td>${escapeHtml(String(row.null))}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderHistory() {
  const historyList = document.querySelector("#historyList");
  document.querySelector("#historyCount").textContent = queryHistory.length;

  historyList.innerHTML = queryHistory.map((item, index) => `
    <button class="history-item" data-history="${index}">
      <span class="history-icon"><i class="ti ti-check"></i></span>
      <span>
        <strong>${escapeHtml(item.sql.split("\n")[0].slice(0, 60))}</strong>
        <small>${item.rows.toLocaleString()} rows · ${item.elapsedMs.toFixed(1)} ms</small>
      </span>
      <time>${item.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
    </button>
  `).join("");

  historyList.querySelectorAll("[data-history]").forEach((button) => {
    button.addEventListener("click", () => {
      setEditorValue(queryHistory[Number(button.dataset.history)].sql);
      updateActiveQueryFromEditor();
    });
  });
}

function setEngineStatus(message, state = "ready") {
  document.querySelector("#engineStatus").textContent = message;
  const dot = document.querySelector("#engineState .status-dot");
  dot.className = `status-dot ${state === "ready" ? "" : state}`.trim();
}

function setQueryStatus(message) {
  document.querySelector("#queryStatus").textContent = message;
}

function setResultStatus(message, state = "success") {
  const element = document.querySelector("#resultStatus");
  element.className = `status-pill ${state}`;
  element.innerHTML = `
    <i class="ti ${
      state === "success"
        ? "ti-circle-check-filled"
        : state === "error"
          ? "ti-alert-triangle"
          : "ti-loader-2"
    }"></i>
    ${escapeHtml(message)}
  `;
}

function updateQueryMetrics(rowCount, elapsedMs) {
  document.querySelector("#resultRowCount").textContent =
    `${rowCount.toLocaleString()} rows`;
  document.querySelector("#resultRuntime").textContent = `${elapsedMs.toFixed(1)} ms`;
  document.querySelector("#statusRows").textContent =
    `Rows: ${rowCount.toLocaleString()}`;
  document.querySelector("#statusRuntime").textContent =
    `Runtime: ${elapsedMs.toFixed(1)} ms`;
}

function enableQueryButtons(enabled) {
  document.querySelector("#runQueryBtn").disabled = !enabled;
  document.querySelector("#workspaceRunBtn").disabled = !enabled;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}
