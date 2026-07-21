export function collectDiagnostics() {
  return {
    browser: navigator.userAgent,
    language: navigator.language,
    online: navigator.onLine,
    hardwareConcurrency: navigator.hardwareConcurrency ?? "Unknown",
    deviceMemory: navigator.deviceMemory ?? "Unknown",
    crossOriginIsolated: window.crossOriginIsolated,
    wasmSupported: typeof WebAssembly === "object",
    workersSupported: typeof Worker === "function",
    fileApiSupported:
      typeof File === "function" &&
      typeof FileReader === "function" &&
      typeof Blob === "function",
    storageAvailable: isLocalStorageAvailable(),
    baseUrl: import.meta.env.BASE_URL,
    mode: import.meta.env.MODE
  };
}

export function getCompatibilityWarnings(diagnostics) {
  const warnings = [];

  if (!diagnostics.wasmSupported) {
    warnings.push("WebAssembly is unavailable in this browser.");
  }

  if (!diagnostics.workersSupported) {
    warnings.push("Web Workers are unavailable in this browser.");
  }

  if (!diagnostics.fileApiSupported) {
    warnings.push("The browser File API is unavailable.");
  }

  if (!diagnostics.storageAvailable) {
    warnings.push("Local storage is unavailable, so saved queries will not persist.");
  }

  if (!diagnostics.online) {
    warnings.push("The browser is offline. Locally cached assets may still work.");
  }

  return warnings;
}

export function formatDiagnosticValue(value) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value == null || value === "") return "Unknown";
  return String(value);
}

function isLocalStorageAvailable() {
  try {
    const key = "__serverless_sql_test__";
    localStorage.setItem(key, "1");
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
