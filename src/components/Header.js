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

        <div class="demo-menu-wrap">
          <button class="btn btn-secondary" id="loadDemoBtn" aria-haspopup="menu" aria-expanded="false">
            <i class="ti ti-database-plus"></i>
            <span>Load Demo</span>
            <i class="ti ti-chevron-down"></i>
          </button>

          <div class="demo-menu" id="demoMenu" role="menu" hidden>
            <button role="menuitem" data-demo="sales">
              <i class="ti ti-chart-line"></i>
              <span>
                <strong>Sales Analytics</strong>
                <small>Revenue and category performance</small>
              </span>
            </button>
            <button role="menuitem" data-demo="manufacturing">
              <i class="ti ti-building-factory-2"></i>
              <span>
                <strong>Manufacturing KPIs</strong>
                <small>OEE, downtime, and scrap</small>
              </span>
            </button>
            <button role="menuitem" data-demo="supply-chain">
              <i class="ti ti-truck-delivery"></i>
              <span>
                <strong>Supply Chain</strong>
                <small>Supplier quality and delivery</small>
              </span>
            </button>
          </div>
        </div>

        <button class="btn btn-ghost" id="newQueryBtn">
          <i class="ti ti-file-plus"></i>
          <span>New Query</span>
        </button>

        <button class="btn btn-ghost" id="helpBtn">
          <i class="ti ti-help-circle"></i>
          <span>Help</span>
        </button>

        <button class="btn btn-ghost" id="resetWorkspaceBtn">
          <i class="ti ti-refresh"></i>
          <span>Reset</span>
        </button>

        <button class="btn btn-primary" id="runQueryBtn" disabled>
          <i class="ti ti-player-play-filled"></i>
          <span>Run Query</span>
        </button>
      </div>
    </header>
  `;
}
