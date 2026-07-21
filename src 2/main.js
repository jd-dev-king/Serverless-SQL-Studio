import "ag-grid-community/styles/ag-grid.css";

import "./styles/variables.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";

import { App } from "./App.js";

document.querySelector("#app").innerHTML = App();
