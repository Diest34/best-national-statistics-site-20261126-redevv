// Mekong Figures — router and control wiring. Classic scripts, no modules:
// index.html loads data.js, charts.js, views.js, then this file.

function currentRoute() {
  const hash = window.location.hash || "#/";
  const path = hash.slice(1).split("?")[0] || "/";
  return VIEWS[path] ? path : "/";
}

function sortProvinces(list, key) {
  const copy = list.slice();
  if (key === "name") copy.sort(function (a, b) { return a.name.localeCompare(b.name); });
  else if (key === "density") copy.sort(function (a, b) { return (b.pop / b.area) - (a.pop / a.area); });
  else copy.sort(function (a, b) { return b.pop - a.pop; });
  return copy;
}

function provinceRows(list) {
  return list.map(function (p) {
    const d = Math.round((p.pop * 1000000) / p.area);
    return '<tr data-name="' + esc(p.name.toLowerCase()) + '"><td><button type="button" class="row-link" data-province="' + esc(p.name) + '">' + esc(p.name) + '</button></td><td>' + fmtNum(p.pop, 1) + "</td><td>" + fmtNum(p.area) + "</td><td>" + fmtNum(d) + "</td></tr>";
  }).join("");
}

function wireProvinceTable(tbodyId, searchId, countId, onPick) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  const search = document.getElementById(searchId);
  const count = document.getElementById(countId);
  let sortKey = "pop";
  let query = "";
  function apply() {
    let list = sortProvinces(ATLAS.provinces, sortKey);
    if (query) list = list.filter(function (p) { return p.name.toLowerCase().indexOf(query) !== -1; });
    tbody.innerHTML = provinceRows(list);
    if (count) count.textContent = list.length + (list.length === 1 ? " province" : " provinces") + (query ? ' matching "' + query + '"' : " and centrally-run cities.") + (query ? "." : "");
    wireRowLinks();
  }
  function wireRowLinks() {
    tbody.querySelectorAll(".row-link").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const p = ATLAS.provinces.find(function (x) { return x.name === btn.getAttribute("data-province"); });
        if (p && onPick) onPick(p);
      });
    });
  }
  if (search) search.addEventListener("input", function () { query = search.value.trim().toLowerCase(); apply(); });
  document.querySelectorAll('[data-sort]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      sortKey = btn.getAttribute("data-sort");
      document.querySelectorAll('[data-sort]').forEach(function (b) { b.classList.toggle("chip-active", b === btn); });
      apply();
    });
  });
  wireRowLinks();
}

function wireDataExplorer() {
  const metric = document.getElementById("data-metric");
  const from = document.getElementById("data-from");
  const to = document.getElementById("data-to");
  const table = document.getElementById("data-table");
  const src = document.getElementById("data-source");
  const csvBtn = document.getElementById("data-csv");
  if (!metric || !table) return;
  function render() {
    let y0 = Number(from.value), y1 = Number(to.value);
    if (y0 > y1) { const t = y0; y0 = y1; y1 = t; from.value = String(y0); to.value = String(y1); }
    const s = ATLAS.series[metric.value];
    const rows = ATLAS.years.map(function (y, i) { return { year: y, value: s.values[i] }; })
      .filter(function (r) { return r.year >= y0 && r.year <= y1; });
    src.textContent = "Source: " + s.source + ".";
    table.innerHTML = '<table class="data-table"><thead><tr><th>Year</th><th>' + esc(s.label) + " (" + esc(s.unit) + ")</th></tr></thead><tbody>" +
      rows.map(function (r) { return "<tr><td>" + r.year + "</td><td>" + fmtNum(r.value, 1) + "</td></tr>"; }).join("") +
      "</tbody></table>";
  }
  metric.addEventListener("change", render);
  from.addEventListener("change", render);
  to.addEventListener("change", render);
  csvBtn.addEventListener("click", function () {
    const s = ATLAS.series[metric.value];
    let csv = "year," + s.label.replace(/,/g, "") + " (" + s.unit + ")\n";
    ATLAS.years.forEach(function (y, i) { csv += y + "," + s.values[i] + "\n"; });
    csv += "Source," + s.source + "\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mekong-figures-" + metric.value + ".csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });
  render();
}

function render() {
  const route = currentRoute();
  const entry = VIEWS[route];
  document.title = entry[0];
  const view = document.getElementById("view");
  view.innerHTML = entry[1]();
  document.querySelectorAll(".nav-link").forEach(function (a) {
    a.classList.toggle("active", a.getAttribute("href") === "#" + route);
  });
  window.scrollTo(0, 0);

  // Population page: year-range switch for the line chart.
  const popRange = document.getElementById("pop-range");
  if (popRange) {
    popRange.addEventListener("change", function () {
      const s = ATLAS.series.population;
      let years = ATLAS.years, values = s.values;
      if (popRange.value === "recent") { years = ATLAS.years.slice(5); values = s.values.slice(5); }
      if (popRange.value === "early") { years = ATLAS.years.slice(0, 5); values = s.values.slice(0, 5); }
      document.getElementById("pop-chart").innerHTML = lineChart(years, values, {
        unit: s.unit, label: "Population " + years[0] + " to " + years[years.length - 1], decimals: 1, showValues: true,
      });
    });
    wireProvinceTable("pop-rows", "pop-search", "pop-count", null);
  }

  // Economy page: bars / line toggle for GDP.
  const gdpBars = document.getElementById("gdp-bars");
  if (gdpBars) {
    const gdp = ATLAS.series.gdp;
    const chart = document.getElementById("gdp-chart");
    gdpBars.addEventListener("click", function () {
      chart.innerHTML = barChart(ATLAS.years.map(String), gdp.values, { unit: gdp.unit, label: "GDP 2015 to 2024", highlight: 9 });
      gdpBars.classList.add("chip-active");
      document.getElementById("gdp-line").classList.remove("chip-active");
    });
    document.getElementById("gdp-line").addEventListener("click", function () {
      chart.innerHTML = lineChart(ATLAS.years, gdp.values, { unit: gdp.unit, label: "GDP 2015 to 2024", showValues: true });
      document.getElementById("gdp-line").classList.add("chip-active");
      gdpBars.classList.remove("chip-active");
    });
  }

  // Regions page: search, sort and the province spotlight.
  const regionSearch = document.getElementById("region-search");
  if (regionSearch) {
    wireProvinceTable("region-rows", "region-search", "region-count", function (p) {
      document.getElementById("prov-title").textContent = "Province spotlight: " + p.name;
      document.getElementById("prov-detail").innerHTML = provinceDetail(p);
      document.getElementById("prov-title").scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  // Society page: switch the chart between visitors and life expectancy.
  const socArr = document.getElementById("soc-arrivals");
  if (socArr) {
    const chart = document.getElementById("soc-chart");
    const arr = ATLAS.series.arrivals;
    const le = ATLAS.series.lifeExpectancy;
    socArr.addEventListener("click", function () {
      chart.innerHTML = barChart(ATLAS.years.map(String), arr.values, { unit: arr.unit, label: "International visitor arrivals 2015 to 2024", decimals: 1, highlight: 4 });
      socArr.classList.add("chip-active");
      document.getElementById("soc-life").classList.remove("chip-active");
    });
    document.getElementById("soc-life").addEventListener("click", function () {
      chart.innerHTML = lineChart(ATLAS.years, le.values, { unit: le.unit, label: "Life expectancy 2015 to 2024", decimals: 1, showValues: false, min: 73, max: 77 });
      document.getElementById("soc-life").classList.add("chip-active");
      socArr.classList.remove("chip-active");
    });
  }

  wireDataExplorer();
}

window.addEventListener("hashchange", render);
render();
