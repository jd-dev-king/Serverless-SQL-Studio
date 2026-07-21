import { Header } from "./components/Header.js";
import { Sidebar } from "./components/Sidebar.js";
import { SqlWorkspace } from "./components/SqlWorkspace.js";
import { ResultsPanel } from "./components/ResultsPanel.js";
import { StatusBar } from "./components/StatusBar.js";
import { Notifications } from "./components/Notifications.js";
import { HelpCenter } from "./components/HelpCenter.js";
import { AboutPanel } from "./components/AboutPanel.js";
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
      ${Notifications()}
      ${HelpCenter()}
      ${AboutPanel()}
    </div>
  `;
}
