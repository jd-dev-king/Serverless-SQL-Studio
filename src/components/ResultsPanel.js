export function ResultsPanel() {
  return `
    <section class="results-panel card">
      <div class="results-tabs">
        <button class="result-tab active" data-panel="results">
          <i class="ti ti-table"></i>Results
        </button>
        <button class="result-tab" data-panel="schema">
          <i class="ti ti-list-details"></i>Schema
        </button>
        <button class="result-tab" data-panel="history">
          <i class="ti ti-history"></i>History
        </button>
      </div>

      <div class="results-toolbar">
        <div class="result-summary">
          <span class="status-pill" id="resultStatus">
            <i class="ti ti-loader-2"></i>
            Initializing
          </span>
          <span id="resultRowCount">0 rows</span>
          <span id="resultRuntime">—</span>
        </div>

        <div class="result-actions result-actions-wide">
          <div class="grid-search">
            <i class="ti ti-search"></i>
            <input id="gridSearchInput" type="search" placeholder="Filter result rows" />
          </div>

          <button class="icon-btn" id="autosizeColumnsBtn" aria-label="Auto-size columns">
            <i class="ti ti-arrows-maximize"></i>
          </button>

          <button class="icon-btn" id="downloadResultsBtn" aria-label="Download results" disabled>
            <i class="ti ti-download"></i>
          </button>
        </div>
      </div>

      <div class="result-view active" id="resultsPanel">
        <div id="resultsGrid" class="ag-theme-serverless results-grid"></div>
      </div>

      <div class="result-view" id="schemaPanel">
        <div id="schemaContent" class="schema-content">
          <div class="empty-panel">
            <span class="empty-icon"><i class="ti ti-list-details"></i></span>
            <h3>No table selected</h3>
            <p>Select a table from the Explorer to inspect its columns.</p>
          </div>
        </div>
      </div>

      <div class="result-view" id="historyPanel">
        <div class="history-list" id="historyList">
          <div class="empty-panel">
            <span class="empty-icon"><i class="ti ti-history"></i></span>
            <h3>No query history</h3>
            <p>Completed queries will appear here during this session.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}
