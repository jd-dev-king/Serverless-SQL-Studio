export function StatusBar() {
  return `
    <footer class="statusbar">
      <div class="status-left">
        <span class="engine-state" id="engineState">
          <span class="status-dot loading"></span>
          <span id="engineStatus">Starting DuckDB…</span>
        </span>
        <span><i class="ti ti-database"></i> In-memory</span>
      </div>

      <div class="status-right">
        <span id="statusRows">Rows: 0</span>
        <span id="statusRuntime">Runtime: —</span>
        <span><i class="ti ti-world"></i> Browser</span>
      </div>
    </footer>
  `;
}
