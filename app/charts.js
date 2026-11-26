// Mekong Figures — small hand-rolled SVG charts. No libraries, no network.
// Each builder returns an SVG string with axes, gridlines and value labels,
// so a chart stays readable in a screenshot and without JavaScript.

// Format helpers.
function fmtNum(v, decimals) {
  return Number(v).toLocaleString("en-US", {
    minimumFractionDigits: decimals == null ? 0 : decimals,
    maximumFractionDigits: decimals == null ? 1 : decimals,
  });
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const CHART = {
  ink: "#1d2b2b",
  muted: "#5b6b68",
  grid: "#e3ddd0",
  teal: "#0f5c55",
  tealLight: "#3d8a80",
  amber: "#d9930d",
  rust: "#b4552d",
  blue: "#2f6fb2",
};

// Line chart with labelled points. years: number[], values: number[].
function lineChart(years, values, opts) {
  opts = opts || {};
  const w = opts.width || 760;
  const h = opts.height || 300;
  const padL = 58, padR = 18, padT = 26, padB = 34;
  const min = opts.min != null ? opts.min : Math.min.apply(null, values) * 0.92;
  const max = opts.max != null ? opts.max : Math.max.apply(null, values) * 1.04;
  const x = function (i) { return padL + (i * (w - padL - padR)) / (years.length - 1); };
  const y = function (v) { return padT + (1 - (v - min) / (max - min)) * (h - padT - padB); };
  const color = opts.color || CHART.teal;
  let g = "";
  // Horizontal gridlines + y labels (4 ticks).
  for (let t = 0; t <= 4; t++) {
    const v = min + ((max - min) * t) / 4;
    const yy = y(v);
    g += '<line x1="' + padL + '" y1="' + yy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + yy.toFixed(1) + '" stroke="' + CHART.grid + '" stroke-width="1"/>';
    g += '<text x="' + (padL - 8) + '" y="' + (yy + 4).toFixed(1) + '" text-anchor="end" font-size="12" fill="' + CHART.muted + '">' + fmtNum(v, opts.decimals || 0) + "</text>";
  }
  let pts = "";
  values.forEach(function (v, i) { pts += x(i).toFixed(1) + "," + y(v).toFixed(1) + " "; });
  g += '<polyline points="' + pts.trim() + '" fill="none" stroke="' + color + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>';
  values.forEach(function (v, i) {
    g += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="4.5" fill="#fff" stroke="' + color + '" stroke-width="2.5"/>';
    if (opts.showValues) {
      g += '<text x="' + x(i).toFixed(1) + '" y="' + (y(v) - 11).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="600" fill="' + CHART.ink + '">' + fmtNum(v, opts.decimals || 0) + "</text>";
    }
    g += '<text x="' + x(i).toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="12" fill="' + CHART.muted + '">' + years[i] + "</text>";
  });
  const unit = opts.unit ? '<text x="' + padL + '" y="16" font-size="12" fill="' + CHART.muted + '">' + esc(opts.unit) + "</text>" : "";
  return '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + esc(opts.label || "Line chart") + '" style="width:100%;height:auto;display:block">' + unit + g + "</svg>";
}

// Vertical bar chart. labels: string[], values: number[].
function barChart(labels, values, opts) {
  opts = opts || {};
  const w = opts.width || 760;
  const h = opts.height || 300;
  const padL = 58, padR = 14, padT = 30, padB = 34;
  const max = Math.max.apply(null, values) * 1.08;
  const min = opts.min != null ? opts.min : 0;
  const slot = (w - padL - padR) / labels.length;
  const bw = Math.min(56, slot * 0.62);
  const y = function (v) { return padT + (1 - (v - min) / (max - min)) * (h - padT - padB); };
  const color = opts.color || CHART.teal;
  let g = "";
  for (let t = 0; t <= 4; t++) {
    const v = min + ((max - min) * t) / 4;
    const yy = y(v);
    g += '<line x1="' + padL + '" y1="' + yy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + yy.toFixed(1) + '" stroke="' + CHART.grid + '" stroke-width="1"/>';
    g += '<text x="' + (padL - 8) + '" y="' + (yy + 4).toFixed(1) + '" text-anchor="end" font-size="12" fill="' + CHART.muted + '">' + fmtNum(v, opts.decimals || 0) + "</text>";
  }
  labels.forEach(function (lab, i) {
    const cx = padL + slot * i + slot / 2;
    const v = values[i];
    const barTop = y(Math.max(v, min));
    const fill = opts.highlight === i ? CHART.amber : color;
    g += '<rect x="' + (cx - bw / 2).toFixed(1) + '" y="' + barTop.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(1, h - padB - barTop).toFixed(1) + '" rx="3" fill="' + fill + '"/>';
    g += '<text x="' + cx.toFixed(1) + '" y="' + (barTop - 7).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="600" fill="' + CHART.ink + '">' + fmtNum(v, opts.decimals || 0) + "</text>";
    g += '<text x="' + cx.toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="12" fill="' + CHART.muted + '">' + esc(lab) + "</text>";
  });
  const unit = opts.unit ? '<text x="' + padL + '" y="16" font-size="12" fill="' + CHART.muted + '">' + esc(opts.unit) + "</text>" : "";
  return '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + esc(opts.label || "Bar chart") + '" style="width:100%;height:auto;display:block">' + unit + g + "</svg>";
}

// Horizontal bars for ranked lists (provinces, products, partners).
function hbarChart(items, opts) {
  opts = opts || {};
  const rowH = opts.rowHeight || 30;
  const w = opts.width || 760;
  const labelW = opts.labelWidth || 190;
  const h = items.length * rowH + 14;
  const max = Math.max.apply(null, items.map(function (d) { return d.value; })) * 1.12;
  const color = opts.color || CHART.teal;
  let g = "";
  items.forEach(function (d, i) {
    const yTop = 8 + i * rowH;
    const bw = ((w - labelW - 64) * d.value) / max;
    g += '<text x="0" y="' + (yTop + 15) + '" font-size="13" fill="' + CHART.ink + '">' + esc(d.name) + "</text>";
    g += '<rect x="' + labelW + '" y="' + (yTop + 2) + '" width="' + Math.max(2, bw).toFixed(1) + '" height="16" rx="3" fill="' + (opts.highlight === i ? CHART.amber : color) + '"/>';
    g += '<text x="' + (labelW + bw + 8).toFixed(1) + '" y="' + (yTop + 15) + '" font-size="12" font-weight="600" fill="' + CHART.ink + '">' + fmtNum(d.value, opts.decimals || 1) + (opts.suffix || "") + "</text>";
  });
  return '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + esc(opts.label || "Ranked bar chart") + '" style="width:100%;height:auto;display:block">' + g + "</svg>";
}

// Grouped bars: two series side by side per year (exports vs imports).
function groupedBarChart(years, seriesA, seriesB, opts) {
  opts = opts || {};
  const w = opts.width || 760;
  const h = opts.height || 300;
  const padL = 58, padR = 14, padT = 30, padB = 34;
  const max = Math.max.apply(null, seriesA.concat(seriesB)) * 1.08;
  const slot = (w - padL - padR) / years.length;
  const bw = Math.min(26, slot * 0.34);
  const y = function (v) { return padT + (1 - v / max) * (h - padT - padB); };
  let g = "";
  for (let t = 0; t <= 4; t++) {
    const v = (max * t) / 4;
    const yy = y(v);
    g += '<line x1="' + padL + '" y1="' + yy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + yy.toFixed(1) + '" stroke="' + CHART.grid + '" stroke-width="1"/>';
    g += '<text x="' + (padL - 8) + '" y="' + (yy + 4).toFixed(1) + '" text-anchor="end" font-size="12" fill="' + CHART.muted + '">' + fmtNum(v, 0) + "</text>";
  }
  years.forEach(function (yr, i) {
    const cx = padL + slot * i + slot / 2;
    g += '<rect x="' + (cx - bw - 2).toFixed(1) + '" y="' + y(seriesA[i]).toFixed(1) + '" width="' + bw + '" height="' + (h - padB - y(seriesA[i])).toFixed(1) + '" rx="2" fill="' + CHART.teal + '"/>';
    g += '<rect x="' + (cx + 2).toFixed(1) + '" y="' + y(seriesB[i]).toFixed(1) + '" width="' + bw + '" height="' + (h - padB - y(seriesB[i])).toFixed(1) + '" rx="2" fill="' + CHART.amber + '"/>';
    g += '<text x="' + cx.toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="12" fill="' + CHART.muted + '">' + yr + "</text>";
  });
  const unit = opts.unit ? '<text x="' + padL + '" y="16" font-size="12" fill="' + CHART.muted + '">' + esc(opts.unit) + "</text>" : "";
  const legend = '<g font-size="13" fill="' + CHART.ink + '"><rect x="' + (w - 240) + '" y="4" width="12" height="12" rx="2" fill="' + CHART.teal + '"/><text x="' + (w - 222) + '" y="15">' + esc(opts.labelA || "Series A") + '</text><rect x="' + (w - 130) + '" y="4" width="12" height="12" rx="2" fill="' + CHART.amber + '"/><text x="' + (w - 112) + '" y="15">' + esc(opts.labelB || "Series B") + "</text></g>";
  return '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' + esc(opts.label || "Grouped bar chart") + '" style="width:100%;height:auto;display:block">' + unit + legend + g + "</svg>";
}

// Donut chart with a centre label and a legend.
function donutChart(items, opts) {
  opts = opts || {};
  const size = opts.size || 300;
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r * 0.62;
  const total = items.reduce(function (s, d) { return s + d.share; }, 0);
  const colors = opts.colors || [CHART.teal, CHART.amber, CHART.tealLight, CHART.rust, CHART.blue];
  let a0 = -Math.PI / 2;
  let paths = "";
  items.forEach(function (d, i) {
    const a1 = a0 + (d.share / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    paths += '<path d="M ' + x0.toFixed(1) + " " + y0.toFixed(1) + " A " + r + " " + r + " 0 " + large + " 1 " + x1.toFixed(1) + " " + y1.toFixed(1) + " L " + xi1.toFixed(1) + " " + yi1.toFixed(1) + " A " + inner + " " + inner + " 0 " + large + " 0 " + xi0.toFixed(1) + " " + yi0.toFixed(1) + ' Z" fill="' + colors[i % colors.length] + '"/>';
    a0 = a1;
  });
  const centre = opts.centre || "";
  const centreSub = opts.centreSub || "";
  let legend = "";
  items.forEach(function (d, i) {
    legend += '<div class="legend-row"><span class="swatch" style="background:' + colors[i % colors.length] + '"></span><span>' + esc(d.name) + "</span><strong>" + fmtNum(d.share, 1) + "%</strong></div>";
  });
  return '<div class="donut-wrap"><svg viewBox="0 0 ' + size + " " + size + '" role="img" aria-label="' + esc(opts.label || "Donut chart") + '" style="width:100%;max-width:' + size + 'px;height:auto;display:block">' + paths +
    '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="26" font-weight="700" fill="' + CHART.ink + '">' + esc(centre) + '</text>' +
    '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" font-size="12" fill="' + CHART.muted + '">' + esc(centreSub) + "</text></svg>" +
    '<div class="legend">' + legend + "</div></div>";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { fmtNum, esc, lineChart, barChart, hbarChart, groupedBarChart, donutChart };
}
