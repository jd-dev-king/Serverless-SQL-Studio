import * as echarts from "echarts";

let chart = null;
let resizeObserver = null;

export function initializeChart(container) {
  if (!container) return null;

  chart = echarts.init(container, null, {
    renderer: "canvas",
    useDirtyRect: true
  });

  resizeObserver?.disconnect();
  resizeObserver = new ResizeObserver(() => {
    chart?.resize();
  });
  resizeObserver.observe(container);

  return chart;
}

export function renderChart({
  type,
  rows,
  xColumn,
  yColumn,
  title = "Query visualization"
}) {
  if (!chart) throw new Error("Chart has not been initialized.");
  if (!rows?.length) throw new Error("Run a query before creating a chart.");
  if (!xColumn || !yColumn) throw new Error("Choose X and Y columns.");

  const limitedRows = rows.slice(0, 1000);
  const categories = limitedRows.map((row) => formatCategory(row[xColumn]));
  const values = limitedRows.map((row) => toNumber(row[yColumn]));
  const numericRows = limitedRows.filter(
    (row) => Number.isFinite(toNumber(row[yColumn]))
  );

  if (!numericRows.length) {
    throw new Error(`"${yColumn}" does not contain numeric values.`);
  }

  const baseOption = {
    backgroundColor: "transparent",
    animationDuration: 350,
    textStyle: {
      color: "#c8d7e9",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    },
    title: {
      text: title,
      left: 18,
      top: 12,
      textStyle: {
        color: "#f8fafc",
        fontSize: 14,
        fontWeight: 700
      }
    },
    tooltip: {
      trigger: type === "pie" ? "item" : "axis",
      backgroundColor: "#111c2e",
      borderColor: "#30445f",
      textStyle: { color: "#e5edf8" }
    },
    toolbox: {
      right: 16,
      top: 10,
      feature: {
        ...(type === "pie" ? {} : { dataZoom: {} }),
        restore: {},
        saveAsImage: {
          name: "serverless-sql-chart",
          pixelRatio: 2
        }
      },
      iconStyle: {
        borderColor: "#94a3b8"
      },
      emphasis: {
        iconStyle: {
          borderColor: "#60a5fa"
        }
      }
    }
  };

  let option;

  if (type === "pie") {
    option = {
      ...baseOption,
      xAxis: undefined,
      yAxis: undefined,
      grid: undefined,
      dataZoom: [],
      legend: {
        bottom: 10,
        textStyle: { color: "#94a3b8" }
      },
      series: [
        {
          type: "pie",
          radius: ["38%", "70%"],
          center: ["50%", "50%"],
          avoidLabelOverlap: true,
          label: { color: "#dbe7f5" },
          data: numericRows.map((row) => ({
            name: formatCategory(row[xColumn]),
            value: toNumber(row[yColumn])
          }))
        }
      ]
    };
  } else if (type === "scatter") {
    const scatterRows = limitedRows.filter(
      (row) =>
        Number.isFinite(toNumber(row[xColumn])) &&
        Number.isFinite(toNumber(row[yColumn]))
    );

    if (!scatterRows.length) {
      throw new Error("Scatter charts require numeric X and Y columns.");
    }

    option = {
      ...baseOption,
      grid: {
        left: 60,
        right: 30,
        top: 64,
        bottom: 56,
        containLabel: true
      },
      xAxis: axisValue(xColumn),
      yAxis: axisValue(yColumn),
      series: [
        {
          name: yColumn,
          type: "scatter",
          symbolSize: 10,
          data: scatterRows.map((row) => [
            toNumber(row[xColumn]),
            toNumber(row[yColumn])
          ])
        }
      ]
    };
  } else {
    option = {
      ...baseOption,
      grid: {
        left: 64,
        right: 28,
        top: 66,
        bottom: categories.length > 12 ? 92 : 58,
        containLabel: true
      },
      dataZoom:
        categories.length > 18
          ? [
              { type: "inside", start: 0, end: 45 },
              {
                type: "slider",
                bottom: 16,
                height: 18,
                borderColor: "#30445f",
                backgroundColor: "#0e1828",
                fillerColor: "rgba(59, 130, 246, .18)"
              }
            ]
          : [],
      xAxis: {
        type: "category",
        name: xColumn,
        data: categories,
        axisLine: { lineStyle: { color: "#33445e" } },
        axisTick: { lineStyle: { color: "#33445e" } },
        axisLabel: {
          color: "#94a3b8",
          rotate: categories.length > 9 ? 32 : 0
        }
      },
      yAxis: {
        type: "value",
        name: yColumn,
        splitLine: { lineStyle: { color: "#1e2a3e" } },
        axisLabel: { color: "#94a3b8" }
      },
      series: [
        {
          name: yColumn,
          type,
          smooth: type === "line",
          areaStyle:
            type === "line"
              ? { opacity: 0.08 }
              : undefined,
          itemStyle:
            type === "bar"
              ? { borderRadius: [5, 5, 0, 0] }
              : undefined,
          data: values
        }
      ]
    };
  }

  chart.clear();
  chart.setOption(option, {
    notMerge: true,
    lazyUpdate: false
  });

  requestAnimationFrame(() => {
    chart?.resize();
  });
}

export function resizeChart() {
  chart?.resize();
}

export function clearChart() {
  chart?.clear();
}

export function exportChartPng() {
  if (!chart) return;

  const dataUrl = chart.getDataURL({
    type: "png",
    pixelRatio: 2,
    backgroundColor: "#0d1625"
  });

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "serverless-sql-chart.png";
  link.click();
}

function axisValue(name) {
  return {
    type: "value",
    name,
    splitLine: { lineStyle: { color: "#1e2a3e" } },
    axisLabel: { color: "#94a3b8" },
    axisLine: { lineStyle: { color: "#33445e" } }
  };
}

function toNumber(value) {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (value == null || value === "") return Number.NaN;
  return Number(String(value).replaceAll(",", ""));
}

function formatCategory(value) {
  if (value == null) return "NULL";
  if (value instanceof Date) return value.toLocaleDateString();
  return String(value);
}
