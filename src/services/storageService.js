const STORAGE_KEYS = {
  queries: "serverless-sql-studio.queries",
  activeQueryId: "serverless-sql-studio.activeQueryId",
  history: "serverless-sql-studio.history",
  preferences: "serverless-sql-studio.preferences"
};

export function loadWorkspace(defaultQueries) {
  const savedQueries = readJson(STORAGE_KEYS.queries, null);
  const savedActiveQueryId = localStorage.getItem(STORAGE_KEYS.activeQueryId);

  const queries =
    Array.isArray(savedQueries) && savedQueries.length
      ? savedQueries
      : defaultQueries;

  const activeQueryId =
    queries.some((query) => query.id === savedActiveQueryId)
      ? savedActiveQueryId
      : queries[0]?.id ?? null;

  return { queries, activeQueryId };
}

export function saveWorkspace(queries, activeQueryId) {
  localStorage.setItem(STORAGE_KEYS.queries, JSON.stringify(queries));
  if (activeQueryId) {
    localStorage.setItem(STORAGE_KEYS.activeQueryId, activeQueryId);
  }
}

export function loadQueryHistory() {
  return readJson(STORAGE_KEYS.history, []);
}

export function saveQueryHistory(history) {
  localStorage.setItem(
    STORAGE_KEYS.history,
    JSON.stringify(history.slice(0, 50))
  );
}

export function loadPreferences() {
  return readJson(STORAGE_KEYS.preferences, {
    chartType: "bar",
    pageSize: 100
  });
}

export function savePreferences(preferences) {
  localStorage.setItem(
    STORAGE_KEYS.preferences,
    JSON.stringify(preferences)
  );
}

export function clearSavedWorkspace() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
