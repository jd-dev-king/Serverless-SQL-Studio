export function AboutPanel() {
  return `
    <div class="modal-backdrop" id="aboutModal" hidden>
      <section class="modal-card about-card" role="dialog" aria-modal="true" aria-labelledby="aboutTitle">
        <div class="modal-header">
          <div>
            <span class="section-label">Application</span>
            <h2 id="aboutTitle">About Serverless SQL Studio</h2>
          </div>
          <button class="icon-btn" id="closeAboutBtn" aria-label="Close About">
            <i class="ti ti-x"></i>
          </button>
        </div>

        <div class="about-content">
          <div class="about-hero">
            <div class="brand-mark about-brand"><span>SQL</span></div>
            <div>
              <h3>Serverless SQL Studio</h3>
              <p>Privacy-first browser analytics powered by DuckDB-Wasm.</p>
              <span class="version-pill">v0.8.0 release candidate</span>
            </div>
          </div>

          <div class="about-grid">
            <article>
              <i class="ti ti-cpu"></i>
              <strong>DuckDB-Wasm</strong>
              <span>Analytical SQL in the browser</span>
            </article>
            <article>
              <i class="ti ti-code"></i>
              <strong>Monaco Editor</strong>
              <span>Professional SQL authoring</span>
            </article>
            <article>
              <i class="ti ti-table"></i>
              <strong>AG Grid</strong>
              <span>Interactive result exploration</span>
            </article>
            <article>
              <i class="ti ti-chart-bar"></i>
              <strong>Apache ECharts</strong>
              <span>Dynamic visualizations</span>
            </article>
          </div>

          <div class="diagnostics-panel">
            <div class="diagnostics-header">
              <div>
                <span class="section-label">Environment</span>
                <h3>Deployment diagnostics</h3>
              </div>
              <button class="btn btn-icon-text" id="copyDiagnosticsBtn">
                <i class="ti ti-copy"></i>
                Copy
              </button>
            </div>
            <div id="diagnosticsContent" class="diagnostics-grid"></div>
            <div id="diagnosticsWarnings" class="diagnostics-warnings"></div>
          </div>
        </div>
      </section>
    </div>
  `;
}
