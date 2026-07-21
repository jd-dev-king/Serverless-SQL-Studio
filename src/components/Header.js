export function Header() {
  return `
    <header class="topbar">
      <div class="brand-group">
        <button class="icon-btn mobile-menu" id="mobileMenuBtn" aria-label="Open navigation">
          <i class="ti ti-menu-2"></i>
        </button>

        <div class="brand-mark"><span>SQL</span></div>

        <div class="brand-copy">
          <strong>Serverless SQL Studio</strong>
          <span>Browser-native analytics workspace</span>
        </div>
      </div>

      <div class="topbar-actions">
        <input id="fileInput" type="file" accept=".csv,.parquet" multiple hidden />

        <button class="btn btn-ghost" id="importCsvBtn">
          <i class="ti ti-upload"></i>
          <span>Import Data</span>
        </button>

        <button class="btn btn-secondary" id="loadDemoBtn">
          <i class="ti ti-database-plus"></i>
          <span>Load Demo</span>
        </button>

        <button class="btn btn-ghost" id="newQueryBtn">
          <i class="ti ti-file-plus"></i>
          <span>New Query</span>
        </button>

        <button class="btn btn-primary" id="runQueryBtn" disabled>
          <i class="ti ti-player-play-filled"></i>
          <span>Run Query</span>
        </button>
      </div>
    </header>
  `;
}
