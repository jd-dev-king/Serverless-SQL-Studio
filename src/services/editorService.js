import loader from "@monaco-editor/loader";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import { format as formatSqlText } from "sql-formatter";

self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker();
  }
};

loader.config({ monaco });

let editorInstance = null;

export async function createSqlEditor(container, initialValue, onRun) {
  await loader.init();

  monaco.editor.defineTheme("serverless-sql-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword.sql", foreground: "70A8FF", fontStyle: "bold" },
      { token: "operator.sql", foreground: "A78BFA" },
      { token: "number.sql", foreground: "F59E0B" },
      { token: "string.sql", foreground: "86EFAC" }
    ],
    colors: {
      "editor.background": "#08111F",
      "editor.foreground": "#C8D7E9",
      "editorLineNumber.foreground": "#42516A",
      "editorLineNumber.activeForeground": "#94A3B8",
      "editorCursor.foreground": "#70A8FF",
      "editor.selectionBackground": "#1E3A5F",
      "editor.inactiveSelectionBackground": "#17283F",
      "editorIndentGuide.background1": "#162238",
      "editorIndentGuide.activeBackground1": "#30445F",
      "editorSuggestWidget.background": "#111C2E",
      "editorSuggestWidget.border": "#2A3B55",
      "editorWidget.background": "#111C2E"
    }
  });

  registerSqlFormatter();

  editorInstance = monaco.editor.create(container, {
    value: initialValue,
    language: "sql",
    theme: "serverless-sql-dark",
    automaticLayout: true,
    minimap: { enabled: false },
    fontFamily: '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
    fontSize: 13,
    lineHeight: 22,
    tabSize: 2,
    insertSpaces: true,
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    roundedSelection: true,
    cursorSmoothCaretAnimation: "on",
    padding: { top: 14, bottom: 14 },
    suggestOnTriggerCharacters: true,
    quickSuggestions: true,
    wordWrap: "off"
  });

  editorInstance.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
    () => onRun?.()
  );

  editorInstance.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    () => window.dispatchEvent(new CustomEvent("save-query"))
  );

  return editorInstance;
}

export function getEditorValue() {
  return editorInstance?.getValue() ?? "";
}

export function setEditorValue(value) {
  const currentPosition = editorInstance?.getPosition();
  editorInstance?.setValue(value ?? "");
  if (currentPosition) editorInstance?.setPosition(currentPosition);
}

export function focusEditor() {
  editorInstance?.focus();
}

export async function formatSql() {
  if (!editorInstance) return false;

  try {
    await editorInstance.getAction("editor.action.formatDocument")?.run();
    editorInstance.focus();
    return true;
  } catch (error) {
    console.error("SQL formatting failed:", error);
    return false;
  }
}

function registerSqlFormatter() {
  monaco.languages.registerDocumentFormattingEditProvider("sql", {
    provideDocumentFormattingEdits(model) {
      const originalSql = model.getValue();

      try {
        const formattedSql = formatSqlText(originalSql, {
          language: "sql",
          keywordCase: "upper",
          tabWidth: 2,
          useTabs: false,
          linesBetweenQueries: 2
        });

        return [
          {
            range: model.getFullModelRange(),
            text: formattedSql
          }
        ];
      } catch (error) {
        console.error("SQL formatter provider failed:", error);
        return [];
      }
    }
  });
}

export function registerTableCompletions(tableProvider) {
  monaco.languages.registerCompletionItemProvider("sql", {
    provideCompletionItems() {
      const suggestions = [];

      for (const table of tableProvider()) {
        suggestions.push({
          label: table.name,
          kind: monaco.languages.CompletionItemKind.Struct,
          insertText: `"${table.name}"`,
          detail: `${table.type} table · ${table.rows.toLocaleString()} rows`
        });
      }

      for (const keyword of [
        "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING",
        "LIMIT", "JOIN", "LEFT JOIN", "INNER JOIN", "UNION ALL",
        "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT"
      ]) {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword
        });
      }

      return { suggestions };
    }
  });
}
