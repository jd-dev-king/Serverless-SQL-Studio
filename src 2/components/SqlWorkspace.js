export function SqlWorkspace() {
  return `
    <section class="sql-panel card">
      <div class="panel-header">
        <div>
          <span class="section-label">SQL Workspace</span>
          <h1>Query your data</h1>
        </div>

        <div class="panel-actions">
          <button class="btn btn-icon-text" id="formatQueryBtn">
            <i class="ti ti-code-dots"></i>
            Format
          </button>
          <button class="btn btn-icon-text" id="saveQueryBtn">
            <i class="ti ti-device-floppy"></i>
            Save
          </button>
          <button class="btn btn-icon-text" id="previewTableBtn">
            <i class="ti ti-eye"></i>
            Preview
          </button>
          <button class="btn btn-primary" id="workspaceRunBtn" disabled>
            <i class="ti ti-player-play-filled"></i>
            Run
          </button>
        </div>
      </div>

      <div class="query-tabs" id="queryTabs"></div>

      <div class="editor-surface editor-live">
        <div id="monacoEditor" class="monaco-editor-host"></div>
      </div>

      <div class="query-footer">
        <div class="query-hint">
          <i class="ti ti-command"></i>
          <span>Cmd/Ctrl + Enter to run · Cmd/Ctrl + S to save</span>
        </div>
        <div class="query-selection">
          <span id="queryStatus">Initializing engine…</span>
        </div>
      </div>
    </section>
  `;
}
