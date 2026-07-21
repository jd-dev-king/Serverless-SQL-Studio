import {
  AllCommunityModule,
  ModuleRegistry,
  createGrid
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

let gridApi = null;

export function createResultsGrid(container) {
  gridApi = createGrid(container, {
    columnDefs: [],
    rowData: [],
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 120,
      flex: 1
    },
    rowHeight: 36,
    headerHeight: 42,
    animateRows: false,
    suppressCellFocus: false,
    enableCellTextSelection: true,
    pagination: true,
    paginationPageSize: 100,
    paginationPageSizeSelector: [25, 50, 100, 250, 500],
    overlayNoRowsTemplate:
      '<div class="grid-empty-message">Run a query to populate the results grid.</div>'
  });

  return gridApi;
}

export function setGridData(columns, rows) {
  if (!gridApi) return;

  const columnDefs = [
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 72,
      minWidth: 72,
      maxWidth: 90,
      sortable: false,
      filter: false,
      pinned: "left"
    },
    ...columns.map((column) => ({
      field: column,
      headerName: column,
      valueFormatter: ({ value }) => formatGridValue(value),
      tooltipField: column
    }))
  ];

  gridApi.setGridOption("columnDefs", columnDefs);
  gridApi.setGridOption("rowData", rows);
  gridApi.sizeColumnsToFit();
}

export function clearGrid() {
  if (!gridApi) return;
  gridApi.setGridOption("columnDefs", []);
  gridApi.setGridOption("rowData", []);
}

export function setQuickFilter(value) {
  gridApi?.setGridOption("quickFilterText", value ?? "");
}

export function exportGridCsv() {
  gridApi?.exportDataAsCsv({
    fileName: "query-results.csv"
  });
}

function formatGridValue(value) {
  if (value == null) return "NULL";
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? value.toLocaleString()
      : value.toLocaleString(undefined, { maximumFractionDigits: 4 });
  }
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
