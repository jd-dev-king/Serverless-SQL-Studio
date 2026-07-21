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
            <h3>Product tour</h3>
            <p class="help-copy">
              Review the guided introduction to loading data, writing SQL, and creating visualizations.
            </p>
            <button class="btn btn-secondary" id="restartTourBtn">
              <i class="ti ti-route"></i>
              Take the tour again
            </button>
          </article>
        </div>
      </section>
    </div>

    <div class="modal-backdrop" id="onboardingModal" hidden>
      <section class="modal-card onboarding-card" role="dialog" aria-modal="true" aria-labelledby="onboardingTitle">
        <div class="tour-progress-wrap">
          <div class="tour-progress-label">
            <span id="tourStepLabel">Step 1 of 3</span>
            <strong id="tourStepName">Welcome</strong>
          </div>
          <div class="tour-progress-track" aria-hidden="true">
            <span id="tourProgressBar"></span>
          </div>
        </div>

        <div class="tour-slide active" data-tour-step="0">
          <div class="onboarding-hero">
            <span class="onboarding-icon"><i class="ti ti-shield-lock"></i></span>
            <span class="section-label">Welcome</span>
            <h2 id="onboardingTitle">Analyze data without a backend</h2>
            <p>
              Serverless SQL Studio runs DuckDB-Wasm entirely in your browser.
              Your CSV and Parquet files stay on your device while you query, profile,
              visualize, and export results.
            </p>
          </div>

          <div class="tour-feature-grid">
            <article>
              <i class="ti ti-lock"></i>
              <strong>Private by design</strong>
              <small>No database server and no file upload service.</small>
            </article>
            <article>
              <i class="ti ti-bolt"></i>
              <strong>Fast local analytics</strong>
              <small>DuckDB-Wasm executes analytical SQL in-browser.</small>
            </article>
          </div>
        </div>

        <div class="tour-slide" data-tour-step="1">
          <div class="onboarding-hero">
            <span class="onboarding-icon"><i class="ti ti-database-import"></i></span>
            <span class="section-label">Load Data</span>
            <h2>Start with a demo or your own file</h2>
            <p>
              Use the built-in Sales, Manufacturing, or Supply Chain demos,
              or import local CSV and Parquet datasets from the toolbar.
            </p>
          </div>

          <div class="tour-feature-grid">
            <article>
              <i class="ti ti-database-plus"></i>
              <strong>Demo datasets</strong>
              <small>Explore curated examples with ready-to-run SQL.</small>
            </article>
            <article>
              <i class="ti ti-upload"></i>
              <strong>Local imports</strong>
              <small>Register CSV and Parquet files directly with DuckDB.</small>
            </article>
          </div>
        </div>

        <div class="tour-slide" data-tour-step="2">
          <div class="onboarding-hero">
            <span class="onboarding-icon"><i class="ti ti-chart-dots-3"></i></span>
            <span class="section-label">Analyze</span>
            <h2>Query, visualize, and save your work</h2>
            <p>
              Write SQL with Monaco Editor, inspect results in AG Grid,
              create ECharts visualizations, review statistics, and save reusable queries.
            </p>
          </div>

          <div class="tour-feature-grid tour-feature-grid-four">
            <article>
              <i class="ti ti-code"></i>
              <strong>SQL workspace</strong>
              <small>Autocomplete, tabs, and keyboard shortcuts.</small>
            </article>
            <article>
              <i class="ti ti-table"></i>
              <strong>Results grid</strong>
              <small>Sort, filter, resize, paginate, and export.</small>
            </article>
            <article>
              <i class="ti ti-chart-bar"></i>
              <strong>Charts</strong>
              <small>Bar, line, pie, scatter, and PNG export.</small>
            </article>
            <article>
              <i class="ti ti-device-floppy"></i>
              <strong>Persistence</strong>
              <small>Saved queries and history stay in your browser.</small>
            </article>
          </div>
        </div>

        <div class="tour-footer">
          <label class="dont-show-label">
            <input id="dontShowOnboardingCheckbox" type="checkbox" checked />
            <span>Don't show this tour again</span>
          </label>

          <div class="onboarding-actions">
            <button class="btn btn-ghost" id="skipOnboardingBtn">Skip tour</button>
            <button class="btn btn-ghost" id="previousTourBtn" disabled>
              <i class="ti ti-arrow-left"></i>
              Back
            </button>
            <button class="btn btn-primary" id="nextTourBtn">
              Next
              <i class="ti ti-arrow-right"></i>
            </button>
            <button class="btn btn-primary" id="finishTourBtn" hidden>
              <i class="ti ti-player-play-filled"></i>
              Start exploring
            </button>
          </div>
        </div>
      </section>
    </div>
  `;
}
