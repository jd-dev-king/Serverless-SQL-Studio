export function Notifications() {
  return `
    <div class="toast-region" id="toastRegion" aria-live="polite" aria-atomic="true"></div>
    <div class="loading-overlay" id="loadingOverlay" hidden>
      <div class="loading-card" role="status">
        <span class="loading-spinner"></span>
        <div>
          <strong id="loadingTitle">Working…</strong>
          <span id="loadingMessage">Please wait.</span>
        </div>
      </div>
    </div>
  `;
}
