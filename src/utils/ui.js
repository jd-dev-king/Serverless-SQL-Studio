import { appState, createDefaultQuery } from "../state/appState.js";
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
import {
  initializeChart,
  renderChart,
  clearChart,
  exportChartPng
} from "../services/chartService.js";
import { profileResultSet } from "../services/statisticsService.js";
import {
  loadWorkspace,
  saveWorkspace,
  loadQueryHistory,
  saveQueryHistory,
  loadPreferences,
  savePreferences,
  clearSavedWorkspace
} from "../services/storageService.js";

const restoredWorkspace = loadWorkspace([createDefaultQuery()]);
appState.queries = restoredWorkspace.queries;
appState.activeQueryId = restoredWorkspace.activeQueryId;
appState.preferences = loadPreferences();

const queryHistory = loadQueryHistory().map((item) => ({
  ...item,
  time: new Date(item.time)
}));

export async function initializeApp() {
  bindTabs();
  bindSidebar();
  bindControls();
  renderQueryTabs();
  renderSavedQueries();
  renderHistory();

  appState.gridApi = createResultsGrid(document.querySelector("#resultsGrid"));
  initializeChart(document.querySelector("#chartCanvas"));

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

      if (tab.dataset.panel === "charts") {
        requestAnimationFrame(() => {
          tryRenderChart(false);
        });
      }
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
  document.querySelector("#resetWorkspaceBtn")?.addEventListener("click", resetWorkspace);
  window.addEventListener("save-query", saveActiveQuery);

  document.querySelector("#gridSearchInput")?.addEventListener("input", (event) => {
    setQuickFilter(event.target.value);
  });

  document.querySelector("#autosizeColumnsBtn")?.addEventListener("click", () => {
    appState.gridApi?.autoSizeAllColumns(false);
  });

  document.querySelector("#downloadResultsBtn")?.addEventListener("click", exportGridCsv);

  document.querySelector("#renderChartBtn")?.addEventListener("click", () => {
    tryRenderChart(true);
  });

  document.querySelector("#exportChartBtn")?.addEventListener("click", exportChartPng);

  const chartTypeSelect = document.querySelector("#chartTypeSelect");
  if (chartTypeSelect) {
    chartTypeSelect.value = appState.preferences.chartType || "bar";
    chartTypeSelect.addEventListener("change", () => {
      appState.preferences.chartType = chartTypeSelect.value;
      savePreferences(appState.preferences);
      if (appState.resultRows.length) tryRenderChart(false);
    });
  }

  ["#chartXColumn", "#chartYColumn"].forEach((selector) => {
    document.querySelector(selector)?.addEventListener("change", () => {
      if (appState.resultRows.length) tryRenderChart(false);
    });
  });
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
    updateChartControls(result.columns, result.rows);
    renderStatistics(result.columns, result.rows);
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
    saveQueryHistory(queryHistory);
    renderHistory();
  } catch (error) {
    console.error(error);
    setResultStatus("Query failed", "error");
    setQueryStatus(error.message);
    clearGrid();
    clearChart();
    renderStatistics([], []);
    updateChartControls([], []);
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
  persistWorkspace();
  renderQueryTabs();
  renderSavedQueries();
  setEditorValue(query.sql);
}

function switchQuery(queryId) {
  updateActiveQueryFromEditor();
  appState.activeQueryId = queryId;
  persistWorkspace();
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

  persistWorkspace();
  renderQueryTabs();
  renderSavedQueries();
}

function saveActiveQuery() {
  updateActiveQueryFromEditor();
  const query = getActiveQuery();
  query.savedAt = new Date().toISOString();

  const enteredName = window.prompt("Saved query name:", query.name);
  if (enteredName?.trim()) {
    query.name = enteredName.trim();
  }

  persistWorkspace();
  renderQueryTabs();
  renderSavedQueries();
  setQueryStatus(`${query.name} saved in this browser.`);
}

function updateActiveQueryFromEditor() {
  const query = getActiveQuery();
  if (query) {
    query.sql = getEditorValue();
    persistWorkspace();
  }
}

function getActiveQuery() {
  return appState.queries.find((query) => query.id === appState.activeQueryId);
}


function renderSavedQueries() {
  const list = document.querySelector("#savedQueryList");
  const savedQueries = appState.queries.filter((query) => query.savedAt);

  document.querySelector("#savedQueryCount").textContent = savedQueries.length;

  list.innerHTML = savedQueries.length
    ? savedQueries.map((query) => `
      <button class="saved-query-item" data-saved-query="${query.id}">
        <i class="ti ti-bookmark-filled"></i>
        <span>
          <strong>${escapeHtml(query.name)}</strong>
          <small>${new Date(query.savedAt).toLocaleString()}</small>
        </span>
      </button>
    `).join("")
    : `<div class="sidebar-empty">No saved queries.</div>`;

  list.querySelectorAll("[data-saved-query]").forEach((button) => {
    button.addEventListener("click", () => {
      switchQuery(button.dataset.savedQuery);
    });
  });
}

function persistWorkspace() {
  saveWorkspace(appState.queries, appState.activeQueryId);
}

function resetWorkspace() {
  const confirmed = window.confirm(
    "Reset saved queries, history, and preferences for this browser?"
  );

  if (!confirmed) return;

  clearSavedWorkspace();

  appState.queries = [createDefaultQuery()];
  appState.activeQueryId = appState.queries[0].id;
  appState.preferences = {
    chartType: "bar",
    pageSize: 100
  };

  queryHistory.splice(0, queryHistory.length);

  renderQueryTabs();
  renderSavedQueries();
  renderHistory();
  setEditorValue(appState.queries[0].sql);

  const chartTypeSelect = document.querySelector("#chartTypeSelect");
  if (chartTypeSelect) chartTypeSelect.value = "bar";

  setQueryStatus("Workspace reset.");
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

  if (!queryHistory.length) {
    historyList.innerHTML = `
      <div class="empty-panel">
        <span class="empty-icon"><i class="ti ti-history"></i></span>
        <h3>No query history</h3>
        <p>Completed queries will appear here during this session.</p>
      </div>
    `;
    return;
  }

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


function updateChartControls(columns, rows) {
  const xSelect = document.querySelector("#chartXColumn");
  const ySelect = document.querySelector("#chartYColumn");
  const renderButton = document.querySelector("#renderChartBtn");
  const exportButton = document.querySelector("#exportChartBtn");

  const options = columns
    .map((column) => `<option value="${escapeHtml(column)}">${escapeHtml(column)}</option>`)
    .join("");

  xSelect.innerHTML = options;
  ySelect.innerHTML = options;

  if (!columns.length || !rows.length) {
    renderButton.disabled = true;
    exportButton.disabled = true;
    return;
  }

  const numericColumn = columns.find((column) =>
    rows.some((row) => Number.isFinite(Number(row[column])))
  );

  const categoryColumn =
    columns.find((column) => column !== numericColumn) ?? columns[0];

  xSelect.value = categoryColumn;
  ySelect.value = numericColumn ?? columns[Math.min(1, columns.length - 1)];

  renderButton.disabled = !numericColumn;
  exportButton.disabled = !numericColumn;

  if (numericColumn) {
    tryRenderChart(false);
  }
}

function tryRenderChart(showErrors = true) {
  if (!appState.resultRows.length) return;

  const type = document.querySelector("#chartTypeSelect")?.value;
  const xColumn = document.querySelector("#chartXColumn")?.value;
  const yColumn = document.querySelector("#chartYColumn")?.value;
  const title =
    document.querySelector("#chartTitleInput")?.value.trim() ||
    "Query visualization";

  try {
    document.querySelector("#chartEmptyState")?.remove();

    renderChart({
      type,
      rows: appState.resultRows,
      xColumn,
      yColumn,
      title
    });

    document.querySelector("#exportChartBtn").disabled = false;
  } catch (error) {
    if (!showErrors) return;

    console.error(error);
    setQueryStatus(`Chart error: ${error.message}`);
  }
}

function renderStatistics(columns, rows) {
  const container = document.querySelector("#statisticsContent");

  if (!columns.length || !rows.length) {
    container.innerHTML = `
      <div class="empty-panel">
        <span class="empty-icon"><i class="ti ti-chart-histogram"></i></span>
        <h3>No statistics yet</h3>
        <p>Run a query to profile its returned columns.</p>
      </div>
    `;
    return;
  }

  const profile = profileResultSet(columns, rows);

  container.innerHTML = `
    <div class="statistics-summary">
      <article class="metric-card">
        <span>Rows</span>
        <strong>${profile.summary.rows.toLocaleString()}</strong>
        <small>Returned records</small>
      </article>
      <article class="metric-card">
        <span>Columns</span>
        <strong>${profile.summary.columns}</strong>
        <small>Result fields</small>
      </article>
      <article class="metric-card">
        <span>Null values</span>
        <strong>${profile.summary.nulls.toLocaleString()}</strong>
        <small>Across result set</small>
      </article>
      <article class="metric-card">
        <span>Numeric fields</span>
        <strong>${profile.summary.numericColumns}</strong>
        <small>Profiled measures</small>
      </article>
    </div>

    <div class="profile-table-wrap">
      <table class="profile-table">
        <thead>
          <tr>
            <th>Column</th>
            <th>Type</th>
            <th>Nulls</th>
            <th>Unique</th>
            <th>Min</th>
            <th>Max</th>
            <th>Mean</th>
            <th>Median</th>
            <th>Std. dev.</th>
          </tr>
        </thead>
        <tbody>
          ${profile.columns.map((column) => `
            <tr>
              <td><strong>${escapeHtml(column.name)}</strong></td>
              <td><span class="type-pill">${escapeHtml(column.type)}</span></td>
              <td>${column.nulls.toLocaleString()}</td>
              <td>${column.unique.toLocaleString()}</td>
              <td>${formatStatistic(column.min)}</td>
              <td>${formatStatistic(column.max)}</td>
              <td>${formatStatistic(column.mean)}</td>
              <td>${formatStatistic(column.median)}</td>
              <td>${formatStatistic(column.standardDeviation)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function formatStatistic(value) {
  if (value == null) return "—";
  if (typeof value === "number") {
    return escapeHtml(
      value.toLocaleString(undefined, { maximumFractionDigits: 3 })
    );
  }
  return escapeHtml(String(value));
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
