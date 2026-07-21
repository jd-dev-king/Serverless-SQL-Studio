export function HelpCenter() {
  return `
    <div class="modal-backdrop" id="helpModal" hidden>
      <section class="modal-card help-modal-card" role="dialog" aria-modal="true" aria-labelledby="helpTitle">
        <div class="modal-header">
          <div>
            <span class="section-label">Reference</span>
            <h2 id="helpTitle">Help & keyboard shortcuts</h2>
          </div>
          <button class="icon-btn" id="closeHelpBtn" aria-label="Close help">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <div class="help-grid">
          <article class="help-section">
            <h3>Getting started</h3>
            <ol>
              <li>Load a built-in demo or import CSV/Parquet.</li>
              <li>Select a table in Explorer.</li>
              <li>Write SQL in the Monaco editor.</li>
              <li>Run the query and inspect Results.</li>
              <li>Build charts or review Statistics.</li>
            </ol>
          </article>

          <article class="help-section">
            <h3>Keyboard shortcuts</h3>
            <div class="shortcut-list">
              <span><kbd>⌘ / Ctrl</kbd><kbd>Enter</kbd><small>Run query</small></span>
              <span><kbd>⌘ / Ctrl</kbd><kbd>S</kbd><small>Save query</small></span>
              <span><kbd>⌘ / Ctrl</kbd><kbd>F</kbd><small>Find in editor</small></span>
              <span><kbd>Shift</kbd><kbd>F10</kbd><small>Editor context menu</small></span>
            </div>
          </article>

          <article class="help-section">
            <h3>Supported data</h3>
            <ul>
              <li>CSV files with automatic type detection</li>
              <li>Parquet files for larger analytical workloads</li>
              <li>Multiple tables in one browser session</li>
              <li>Local-only processing with DuckDB-Wasm</li>
            </ul>
          </article>

          <article class="help-section">
            <h3>Tips</h3>
            <ul>
              <li>Double-click a table to preview its first 100 rows.</li>
              <li>Use Parquet for better performance on large datasets.</li>
              <li>Aggregate before charting very large query results.</li>
              <li>Save reusable SQL in the Saved Queries panel.</li>
            </ul>
          </article>
        </div>
      </section>
    </div>

    <div class="modal-backdrop" id="onboardingModal" hidden>
      <section class="modal-card onboarding-card" role="dialog" aria-modal="true" aria-labelledby="onboardingTitle">
        <div class="onboarding-hero">
          <span class="onboarding-icon"><i class="ti ti-database-search"></i></span>
          <span class="section-label">Welcome</span>
          <h2 id="onboardingTitle">Analyze data without a backend</h2>
          <p>
            Serverless SQL Studio runs DuckDB-Wasm entirely in your browser.
            Import local CSV or Parquet files, write SQL, and build charts without uploading your data.
          </p>
        </div>

        <div class="onboarding-steps">
          <article>
            <span>1</span>
            <strong>Load data</strong>
            <small>Use a demo or import your own file.</small>
          </article>
          <article>
            <span>2</span>
            <strong>Write SQL</strong>
            <small>Use Monaco autocomplete and query tabs.</small>
          </article>
          <article>
            <span>3</span>
            <strong>Explore results</strong>
            <small>Sort, filter, chart, profile, and export.</small>
          </article>
        </div>

        <div class="onboarding-actions">
          <button class="btn btn-ghost" id="skipOnboardingBtn">Skip</button>
          <button class="btn btn-primary" id="startOnboardingBtn">
            <i class="ti ti-player-play-filled"></i>
            Start exploring
          </button>
        </div>
      </section>
    </div>
  `;
}
