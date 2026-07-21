export function ResultsPanel() {
  return `
    <section class="results-panel card">
      <div class="results-tabs">
        <button class="result-tab active" data-panel="results">
          <i class="ti ti-table"></i>Results
        </button>
        <button class="result-tab" data-panel="charts">
          <i class="ti ti-chart-bar"></i>Charts
        </button>
        <button class="result-tab" data-panel="statistics">
          <i class="ti ti-chart-histogram"></i>Statistics
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

          <button class="icon-btn" id="autosizeColumnsBtn" aria-label="Auto-size result columns" title="Auto-size result columns">
            <i class="ti ti-columns-3"></i>
          </button>

          <button class="icon-btn" id="expandResultsBtn" aria-label="Expand results section" title="Expand results section" aria-pressed="false">
            <i class="ti ti-maximize"></i>
          </button>

          <button class="icon-btn" id="downloadResultsBtn" aria-label="Download results" disabled>
            <i class="ti ti-download"></i>
          </button>
        </div>
      </div>

      <div class="result-view active" id="resultsPanel">
        <div id="resultsGrid" class="ag-theme-serverless results-grid"></div>
      </div>

      <div class="result-view" id="chartsPanel">
        <div class="chart-workspace">
          <div class="chart-controls">
            <label>
              Chart type
              <select id="chartTypeSelect">
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
                <option value="scatter">Scatter</option>
              </select>
            </label>

            <label>
              X / Category
              <select id="chartXColumn"></select>
            </label>

            <label>
              Y / Value
              <select id="chartYColumn"></select>
            </label>

            <label class="chart-title-field">
              Chart title
              <input id="chartTitleInput" value="Query visualization" />
            </label>

            <button class="btn btn-secondary" id="renderChartBtn" disabled>
              <i class="ti ti-chart-bar"></i>
              Render
            </button>

            <button class="btn btn-icon-text" id="exportChartBtn" disabled>
              <i class="ti ti-photo-down"></i>
              PNG
            </button>
          </div>

          <div id="chartCanvas" class="chart-canvas">
            <div class="empty-panel" id="chartEmptyState">
              <span class="empty-icon"><i class="ti ti-chart-bar"></i></span>
              <h3>No visualization yet</h3>
              <p>Run a query, choose X and Y columns, and render a chart.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="result-view" id="statisticsPanel">
        <div id="statisticsContent" class="statistics-content">
          <div class="empty-panel">
            <span class="empty-icon"><i class="ti ti-chart-histogram"></i></span>
            <h3>No statistics yet</h3>
            <p>Run a query to profile its returned columns.</p>
          </div>
        </div>
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
