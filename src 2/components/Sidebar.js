export function Sidebar() {
  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div>
          <span class="section-label">Workspace</span>
          <h2>Explorer</h2>
        </div>
        <button class="icon-btn" aria-label="Collapse sidebar">
          <i class="ti ti-layout-sidebar-left-collapse"></i>
        </button>
      </div>

      <div class="sidebar-search">
        <i class="ti ti-search"></i>
        <input id="tableSearch" type="search" placeholder="Search tables" />
      </div>

      <nav class="explorer-nav">
        <button class="nav-section active">
          <span><i class="ti ti-table"></i>Tables</span>
          <span class="count-badge" id="tableCount">0</span>
        </button>

        <div class="tree-list" id="tableList">
          <div class="sidebar-empty">Loading DuckDB…</div>
        </div>

        <button class="nav-section">
          <span><i class="ti ti-eye"></i>Views</span>
          <span class="count-badge">0</span>
        </button>

        <button class="nav-section active-secondary">
          <span><i class="ti ti-bookmark"></i>Saved Queries</span>
          <span class="count-badge" id="savedQueryCount">0</span>
        </button>

        <div class="saved-query-list" id="savedQueryList">
          <div class="sidebar-empty">No saved queries.</div>
        </div>

        <button class="nav-section">
          <span><i class="ti ti-history"></i>Recent Queries</span>
          <span class="count-badge" id="historyCount">0</span>
        </button>
      </nav>

      <div class="sidebar-bottom">
        <button class="import-card" id="sidebarImportBtn">
          <span class="import-icon"><i class="ti ti-upload"></i></span>
          <span>
            <strong>Import Dataset</strong>
            <small>CSV or Parquet</small>
          </span>
        </button>

        <div class="privacy-note">
          <i class="ti ti-shield-lock"></i>
          <div>
            <strong>Private by design</strong>
            <span>Files stay in your browser.</span>
          </div>
        </div>
      </div>
    </aside>
  `;
}
