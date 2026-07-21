import { Header } from "./components/Header.js";
import { Sidebar } from "./components/Sidebar.js";
import { SqlWorkspace } from "./components/SqlWorkspace.js";
import { ResultsPanel } from "./components/ResultsPanel.js";
import { StatusBar } from "./components/StatusBar.js";
import { initializeApp } from "./utils/ui.js";

export function App() {
  requestAnimationFrame(() => initializeApp());

  return `
    <div class="app-shell">
      ${Header()}
      <div class="app-main">
        ${Sidebar()}
        <main class="workspace">
          ${SqlWorkspace()}
          ${ResultsPanel()}
        </main>
      </div>
      ${StatusBar()}
    </div>
  `;
}
