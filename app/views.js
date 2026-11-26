// Mekong Figures — one renderer per page. Each view is a function that
// returns HTML; main.js drops it into #view and wires its controls.

function sourceNote(text) {
  return '<p class="source">Source: ' + esc(text) + "</p>";
}

function kpiCard(h) {
  return '<article class="kpi"><p class="kpi-label">' + esc(h.label) + '</p><p class="kpi-value">' +
    esc(h.display) + ' <span class="kpi-unit">' + esc(h.unit) + "</span></p>" +
    '<p class="kpi-meta">' + h.year + " · " + esc(h.source) + "</p></article>";
}

function topicCard(href, title, blurb) {
  return '<a class="topic-card" href="' + href + '"><h3>' + esc(title) + "</h3><p>" + esc(blurb) + "</p><span class=\"topic-link\">Explore →</span></a>";
}

function renderHome() {
  const h = ATLAS.headline;
  const cards = h.map(function (x) {
    return kpiCard({
      label: x.label,
      display: fmtNum(x.value, x.key === "gdpPerCapita" ? 0 : 1),
      unit: x.unit,
      year: x.year,
      source: x.source,
    });
  }).join("");
  const pop = ATLAS.series.population;
  const gdp = ATLAS.series.gdp;
  const topProv = ATLAS.provinces.slice().sort(function (a, b) { return b.pop - a.pop; }).slice(0, 5);
  const provRows = topProv.map(function (p, i) {
    return "<tr><td>" + (i + 1) + "</td><td><a href=\"#/regions\">" + esc(p.name) + "</a></td><td>" +
      fmtNum(p.pop, 1) + "</td><td>" + fmtNum(Math.round((p.pop * 1000000) / p.area)) + "</td></tr>";
  }).join("");
  const releases = ATLAS.releases.map(function (r) {
    return '<li><strong>' + esc(r.date) + "</strong> — " + esc(r.text) + "</li>";
  }).join("");
  return '' +
    '<section class="hero">' +
    "<p class=\"eyebrow\">The national statistics atlas of Viet Nam</p>" +
    "<h1>Viet Nam, measured.<br>Every figure in one place.</h1>" +
    "<p class=\"lede\">Mekong Figures gathers the country's headline numbers — people, economy, trade, regions and daily life — from the General Statistics Office and the World Bank, with the source and year on every figure.</p>" +
    '<p class="hero-actions"><a class="btn" href="#/population">Explore the population</a> <a class="btn btn-ghost" href="#/data">Open the data explorer</a></p>' +
    "</section>" +
    '<section aria-label="Headline indicators"><div class="kpi-grid">' + cards + "</div>" +
    sourceNote("Headline figures for 2024. Population and GDP: World Bank WDI; growth: GSO Viet Nam; exports: Vietnam Customs; life expectancy: World Bank WDI.") +
    "</section>" +
    '<section class="split">' +
    '<article class="panel"><h2>Population, 2015–2024</h2>' +
    lineChart(ATLAS.years, pop.values, { unit: pop.unit, label: "Population of Viet Nam 2015 to 2024", decimals: 1, showValues: false }) +
    sourceNote(pop.source + ".") + "</article>" +
    '<article class="panel"><h2>GDP, 2015–2024</h2>' +
    barChart(ATLAS.years.map(String), gdp.values, { unit: gdp.unit, label: "GDP of Viet Nam 2015 to 2024", highlight: 9 }) +
    sourceNote(gdp.source + ".") + "</article>" +
    "</section>" +
    '<section class="split">' +
    '<article class="panel"><h2>What the economy is made of — 2024</h2>' +
    donutChart(ATLAS.sectors2024, { centre: "100%", centreSub: "of GDP", label: "Share of GDP by sector, 2024" }) +
    sourceNote("General Statistics Office of Viet Nam, 2024.") + "</article>" +
    '<article class="panel"><h2>Largest provinces</h2>' +
    '<table class="data-table"><thead><tr><th>#</th><th>Province / city</th><th>People (m)</th><th>Per km²</th></tr></thead><tbody>' + provRows + "</tbody></table>" +
    '<p class="panel-link"><a href="#/regions">See all 63 provinces →</a></p>' +
    sourceNote("GSO Viet Nam, 2024 estimates; density computed from population and area.") + "</article>" +
    "</section>" +
    '<section><h2>Explore by topic</h2><div class="topic-grid">' +
    topicCard("#/population", "People", "Population growth, age structure and every province.") +
    topicCard("#/economy", "Economy", "GDP, growth, prices, jobs and what each sector contributes.") +
    topicCard("#/trade", "Trade", "Exports, imports and the partners Viet Nam trades with most.") +
    topicCard("#/regions", "Regions", "All 63 provinces compared — people, area and density.") +
    topicCard("#/society", "Society", "Health, schooling, connectivity and visitors.") +
    topicCard("#/data", "Data explorer", "Every series as a table, for any years you choose.") +
    "</div></section>" +
    '<section class="panel"><h2>Latest releases</h2><ul class="releases">' + releases + "</ul></section>";
}

function renderPopulation() {
  const pop = ATLAS.series.population;
  const age = ATLAS.ageStructure2024;
  const rows = ATLAS.provinces.slice().sort(function (a, b) { return b.pop - a.pop; }).map(function (p) {
    return "<tr><td>" + esc(p.name) + "</td><td>" + fmtNum(p.pop, 1) + "</td><td>" +
      fmtNum(p.area) + "</td><td>" + fmtNum(Math.round((p.pop * 1000000) / p.area)) + "</td></tr>";
  }).join("");
  return '' +
    "<h1>People</h1>" +
    '<p class="lede">101.3 million people in 2024, growing by about 0.9% a year. Two in five live in cities, the median age is 33.5, and the two biggest cities hold one in six Vietnamese.</p>' +
    '<section class="split">' +
    '<article class="panel"><h2>Population, 2015–2024</h2>' +
    '<div class="controls"><label>Years <select id="pop-range">' +
    '<option value="all" selected>2015–2024</option><option value="recent">2020–2024</option><option value="early">2015–2019</option>' +
    "</select></label></div>" +
    '<div id="pop-chart">' + lineChart(ATLAS.years, pop.values, { unit: pop.unit, label: "Population 2015 to 2024", decimals: 1, showValues: true }) + "</div>" +
    sourceNote(pop.source + ".") + "</article>" +
    '<article class="panel"><h2>Who lives here — age structure, 2024</h2>' +
    donutChart(age, { centre: "101.3m", centreSub: "people, 2024", label: "Age structure of Viet Nam, 2024" }) +
    sourceNote("World Bank WDI, 2024. Shares sum to 100%.") + "</article>" +
    "</section>" +
    '<section class="kpi-grid">' +
    kpiCard({ label: "Median age", display: "33.5", unit: "years", year: 2024, source: "UN World Population Prospects" }) +
    kpiCard({ label: "Fertility rate", display: "1.91", unit: "children per woman", year: 2024, source: "GSO Viet Nam" }) +
    kpiCard({ label: "Urban population", display: "39.5", unit: "% of people", year: 2023, source: "World Bank WDI" }) +
    kpiCard({ label: "Life expectancy", display: "74.8", unit: "years", year: 2024, source: "World Bank WDI" }) +
    "</section>" +
    '<section class="panel"><h2>Population by province — 2024</h2>' +
    '<div class="controls"><label>Search <input id="pop-search" type="search" placeholder="Type a province name…" aria-label="Search provinces"></label>' +
    '<span class="controls-right"><button type="button" class="chip" data-sort="pop">Largest first</button>' +
    '<button type="button" class="chip" data-sort="name">A–Z</button>' +
    '<button type="button" class="chip" data-sort="density">Densest first</button></span></div>' +
    '<p id="pop-count" class="muted">63 provinces and centrally-run cities.</p>' +
    '<table class="data-table"><thead><tr><th>Province / city</th><th>People (m)</th><th>Area (km²)</th><th>People per km²</th></tr></thead><tbody id="pop-rows">' + rows + "</tbody></table>" +
    sourceNote("GSO Viet Nam, 2024 estimates; density computed from population and area.") + "</section>";
}

function renderEconomy() {
  const gdp = ATLAS.series.gdp;
  const growth = ATLAS.series.growth;
  const infl = ATLAS.series.inflation;
  const unemp = ATLAS.series.unemployment;
  return '' +
    "<h1>Economy</h1>" +
    '<p class="lede">A US$476 billion economy in 2024 that grew 7.1% — the fastest pace in the region that year. Manufacturing and services now make up four-fifths of output; farming, once the backbone, is under 12%.</p>' +
    '<section class="kpi-grid">' +
    kpiCard({ label: "GDP (nominal)", display: "$476.4", unit: "billion", year: 2024, source: "World Bank WDI" }) +
    kpiCard({ label: "GDP per capita", display: "$4,700", unit: "", year: 2024, source: "World Bank WDI" }) +
    kpiCard({ label: "Real GDP growth", display: "7.1", unit: "%", year: 2024, source: "GSO Viet Nam" }) +
    kpiCard({ label: "Inflation (CPI)", display: "3.6", unit: "%", year: 2024, source: "GSO Viet Nam" }) +
    kpiCard({ label: "Unemployment", display: "2.2", unit: "% of labour force", year: 2024, source: "GSO Viet Nam" }) +
    kpiCard({ label: "Labour force", display: "52.5", unit: "million people", year: 2024, source: "GSO Viet Nam" }) +
    "</section>" +
    '<section class="panel"><h2>GDP, 2015–2024</h2>' +
    '<div class="controls"><span>Chart: </span><button type="button" class="chip chip-active" id="gdp-bars">Bars</button>' +
    '<button type="button" class="chip" id="gdp-line">Line</button></div>' +
    '<div id="gdp-chart">' + barChart(ATLAS.years.map(String), gdp.values, { unit: gdp.unit, label: "GDP 2015 to 2024", highlight: 9 }) + "</div>" +
    sourceNote(gdp.source + ".") + "</section>" +
    '<section class="split">' +
    '<article class="panel"><h2>Real GDP growth, % per year</h2>' +
    barChart(ATLAS.years.map(String), growth.values, { unit: growth.unit, label: "Real GDP growth 2015 to 2024", decimals: 1, highlight: 7 }) +
    sourceNote(growth.source + ". The 2020–2021 dip is the COVID-19 pandemic; 2022 rebounded to 8.0%.") + "</article>" +
    '<article class="panel"><h2>What the economy is made of — 2024</h2>' +
    donutChart(ATLAS.sectors2024, { centre: "100%", centreSub: "of GDP", label: "Share of GDP by sector, 2024" }) +
    sourceNote("General Statistics Office of Viet Nam, 2024.") + "</article>" +
    "</section>" +
    '<section class="split">' +
    '<article class="panel"><h2>Consumer price inflation, %</h2>' +
    lineChart(ATLAS.years, infl.values, { unit: infl.unit, label: "Inflation 2015 to 2024", decimals: 1, showValues: false }) +
    sourceNote(infl.source + ".") + "</article>" +
    '<article class="panel"><h2>Unemployment, % of labour force</h2>' +
    lineChart(ATLAS.years, unemp.values, { unit: unemp.unit, label: "Unemployment 2015 to 2024", decimals: 1, showValues: false }) +
    sourceNote(unemp.source + ".") + "</article>" +
    "</section>";
}

function renderTrade() {
  const ex = ATLAS.series.exports;
  const im = ATLAS.series.imports;
  const balance = ATLAS.years.map(function (y, i) { return +(ex.values[i] - im.values[i]).toFixed(1); });
  const prod = ATLAS.exportProducts2024.slice().sort(function (a, b) { return b.value - a.value; });
  const partners = ATLAS.exportPartners2024.slice().sort(function (a, b) { return b.value - a.value; });
  const partnerRows = partners.map(function (p) {
    return "<tr><td>" + esc(p.name) + "</td><td>" + fmtNum(p.value, 1) + "</td><td>" +
      fmtNum((p.value / 405.5) * 100, 1) + "%</td></tr>";
  }).join("");
  return '' +
    "<h1>Trade</h1>" +
    '<p class="lede">Viet Nam trades more than its whole economy is worth: exports of goods hit a record US$405.5 billion in 2024, against US$380.8 billion of imports — a surplus of US$24.7 billion, the ninth straight year in surplus.</p>' +
    '<section class="kpi-grid">' +
    kpiCard({ label: "Exports of goods", display: "$405.5", unit: "billion", year: 2024, source: "Vietnam Customs" }) +
    kpiCard({ label: "Imports of goods", display: "$380.8", unit: "billion", year: 2024, source: "Vietnam Customs" }) +
    kpiCard({ label: "Trade surplus", display: "$24.7", unit: "billion", year: 2024, source: "Vietnam Customs" }) +
    kpiCard({ label: "Top destination", display: "USA", unit: "$136.6bn", year: 2024, source: "Vietnam Customs, approx." }) +
    "</section>" +
    '<section class="panel"><h2>Exports vs imports, 2015–2024</h2>' +
    groupedBarChart(ATLAS.years, ex.values, im.values, { unit: "US$ billion", labelA: "Exports", labelB: "Imports", label: "Exports and imports 2015 to 2024" }) +
    sourceNote("General Department of Vietnam Customs.") + "</section>" +
    '<section class="split">' +
    '<article class="panel"><h2>Trade balance, US$ billion</h2>' +
    barChart(ATLAS.years.map(String), balance, { unit: "US$ billion, exports minus imports", label: "Trade balance 2015 to 2024", decimals: 1, color: "#2f6fb2" }) +
    sourceNote("Computed from Vietnam Customs export and import figures.") + "</article>" +
    '<article class="panel"><h2>Where exports go — 2024</h2>' +
    '<table class="data-table"><thead><tr><th>Destination</th><th>US$ bn</th><th>Share</th></tr></thead><tbody>' + partnerRows + "</tbody></table>" +
    sourceNote("General Department of Vietnam Customs, 2024, approx.") + "</article>" +
    "</section>" +
    '<section class="panel"><h2>What Viet Nam sells — top export products, 2024</h2>' +
    hbarChart(prod, { label: "Top export products 2024", decimals: 1, suffix: " bn" }) +
    sourceNote("General Department of Vietnam Customs, 2024, approx. Electronics, phones and machinery are more than half of all exports.") + "</section>";
}

function renderRegions() {
  const sorted = ATLAS.provinces.slice().sort(function (a, b) { return b.pop - a.pop; });
  const top10 = sorted.slice(0, 10).map(function (p) { return { name: p.name, value: p.pop }; });
  const rows = sorted.map(function (p) {
    const d = Math.round((p.pop * 1000000) / p.area);
    return '<tr data-name="' + esc(p.name.toLowerCase()) + '"><td><button type="button" class="row-link" data-province="' + esc(p.name) + '">' + esc(p.name) + '</button></td><td>' + fmtNum(p.pop, 1) + "</td><td>" + fmtNum(p.area) + "</td><td>" + fmtNum(d) + "</td></tr>";
  }).join("");
  const first = sorted[0];
  return '' +
    "<h1>Regions</h1>" +
    '<p class="lede">63 provinces and centrally-run cities, from Ho Chi Minh City (9.5 million people) to Bac Kan (0.3 million). The Red River Delta is the densest region; the Central Highlands the most spread out. Tap any province for its details.</p>' +
    '<section class="split">' +
    '<article class="panel"><h2>Ten largest provinces — people, millions, 2024</h2>' +
    hbarChart(top10, { label: "Ten largest provinces by population, 2024", decimals: 1 }) +
    sourceNote("GSO Viet Nam, 2024 estimates.") + "</article>" +
    '<article class="panel"><h2 id="prov-title">Province spotlight: ' + esc(first.name) + "</h2>" +
    '<div id="prov-detail">' + provinceDetail(first) + "</div>" +
    sourceNote("GSO Viet Nam, 2024 estimates; density computed from population and area.") + "</article>" +
    "</section>" +
    '<section class="panel"><h2>All provinces — 2024</h2>' +
    '<div class="controls"><label>Search <input id="region-search" type="search" placeholder="Type a province name…" aria-label="Search provinces"></label>' +
    '<span class="controls-right"><button type="button" class="chip" data-sort="pop">Largest first</button>' +
    '<button type="button" class="chip" data-sort="name">A–Z</button>' +
    '<button type="button" class="chip" data-sort="density">Densest first</button></span></div>' +
    '<p id="region-count" class="muted">63 provinces and centrally-run cities. Tap a name for its details.</p>' +
    '<table class="data-table"><thead><tr><th>Province / city</th><th>People (m)</th><th>Area (km²)</th><th>People per km²</th></tr></thead><tbody id="region-rows">' + rows + "</tbody></table>" +
    sourceNote("GSO Viet Nam, 2024 estimates; density computed from population and area.") + "</section>";
}

function provinceDetail(p) {
  const density = Math.round((p.pop * 1000000) / p.area);
  const share = ((p.pop / 101.3) * 100).toFixed(1);
  const rank = ATLAS.provinces.slice().sort(function (a, b) { return b.pop - a.pop; }).findIndex(function (x) { return x.name === p.name; }) + 1;
  return '<dl class="facts">' +
    "<div><dt>People (2024)</dt><dd>" + fmtNum(p.pop, 1) + " million</dd></div>" +
    "<div><dt>Share of Viet Nam</dt><dd>" + share + "%</dd></div>" +
    "<div><dt>Rank by population</dt><dd>#" + rank + " of 63</dd></div>" +
    "<div><dt>Area</dt><dd>" + fmtNum(p.area) + " km²</dd></div>" +
    "<div><dt>Density</dt><dd>" + fmtNum(density) + " people per km²</dd></div>" +
    "<div><dt>National density</dt><dd>305 people per km²</dd></div>" +
    "</dl>" +
    '<p class="muted">' + esc(p.name) + (density > 305 ? " is denser than the country as a whole." : " is less dense than the country as a whole.") + "</p>";
}

function renderSociety() {
  const arr = ATLAS.series.arrivals;
  const le = ATLAS.series.lifeExpectancy;
  const cards = ATLAS.society.map(function (s) {
    return '<article class="fact-card"><p class="fact-label">' + esc(s.label) + '</p><p class="fact-value">' + esc(s.value) + '</p><p class="kpi-meta">' + s.year + " · " + esc(s.source) + "</p></article>";
  }).join("");
  return '' +
    "<h1>Society</h1>" +
    '<p class="lede">Longer lives, near-universal literacy and a country that got online fast: 95.8% of adults can read and write, life expectancy is 74.8 years, and 17.6 million visitors arrived in 2024 — close to the pre-pandemic record.</p>' +
    '<section class="fact-grid">' + cards + "</section>" +
    '<section class="split">' +
    '<article class="panel"><h2>International visitors, millions</h2>' +
    '<div class="controls"><span>Show: </span><button type="button" class="chip chip-active" id="soc-arrivals">Visitors</button>' +
    '<button type="button" class="chip" id="soc-life">Life expectancy</button></div>' +
    '<div id="soc-chart">' + barChart(ATLAS.years.map(String), arr.values, { unit: arr.unit, label: "International visitor arrivals 2015 to 2024", decimals: 1, highlight: 4 }) + "</div>" +
    sourceNote(arr.source + ". Arrivals collapsed in 2020–2021 during the pandemic and recovered from 2022.") + "</article>" +
    '<article class="panel"><h2>Life expectancy at birth, years</h2>' +
    lineChart(ATLAS.years, le.values, { unit: le.unit, label: "Life expectancy 2015 to 2024", decimals: 1, showValues: false, min: 73, max: 77 }) +
    sourceNote(le.source + ".") + "</article>" +
    "</section>" +
    '<section class="panel"><h2>Reading the numbers</h2>' +
    "<p>Viet Nam's population is still young but ageing: the median age rose from about 30 in 2015 to 33.5 in 2024, and the fertility rate fell to 1.91 — below the 2.1 replacement level. Schooling keeps lengthening (9.3 mean years in 2023) and the under-5 mortality rate, 17.1 per 1,000 live births, is among the lowest in Southeast Asia.</p>" +
    sourceNote("UN World Population Prospects; UNDP Human Development Report; World Bank WDI.") + "</section>";
}

function renderData() {
  const keys = Object.keys(ATLAS.series);
  const options = keys.map(function (k) {
    return '<option value="' + k + '">' + esc(ATLAS.series[k].label) + "</option>";
  }).join("");
  const yearOpts = ATLAS.years.map(function (y) { return '<option value="' + y + '">' + y + "</option>"; }).join("");
  return '' +
    "<h1>Data explorer</h1>" +
    '<p class="lede">Every series in the atlas as a table. Pick an indicator and a year range, sort the table, and download it as a CSV for your own work.</p>' +
    '<section class="panel"><h2>Choose an indicator</h2>' +
    '<div class="controls"><label>Indicator <select id="data-metric">' + options + "</select></label>" +
    '<label>From <select id="data-from">' + yearOpts + "</select></label>" +
    '<label>To <select id="data-to">' + yearOpts.replace('value="2024"', 'value="2024" selected') + "</select></label>" +
    '<span class="controls-right"><button type="button" class="btn" id="data-csv">Download CSV</button></span></div>' +
    '<p id="data-source" class="source"></p>' +
    '<div id="data-table"></div>' +
    '<p class="muted">Figures are the published headline values; see <a href="#/about">About &amp; sources</a> for the full source list and notes.</p>' +
    "</section>" +
    '<section class="panel"><h2>All series at a glance — 2024</h2>' +
    '<table class="data-table"><thead><tr><th>Indicator</th><th>2024 value</th><th>Unit</th><th>Source</th></tr></thead><tbody>' +
    keys.map(function (k) {
      const s = ATLAS.series[k];
      return "<tr><td>" + esc(s.label) + "</td><td>" + fmtNum(s.values[s.values.length - 1], 1) + "</td><td>" + esc(s.unit) + "</td><td>" + esc(s.source) + "</td></tr>";
    }).join("") +
    "</tbody></table></section>";
}

function renderAbout() {
  return '' +
    "<h1>About &amp; sources</h1>" +
    '<p class="lede">Mekong Figures is an independent atlas of Viet Nam\'s national statistics. It is not affiliated with the General Statistics Office, the World Bank or any government body. Every figure on this site names its source and year.</p>' +
    '<section class="panel"><h2>Where the numbers come from</h2>' +
    "<ul class=\"sources\">" +
    "<li><strong>General Statistics Office of Viet Nam (GSO)</strong> — GDP growth, inflation, unemployment, labour force, fertility, visitor arrivals, provincial populations, sector shares.</li>" +
    "<li><strong>World Bank, World Development Indicators</strong> — population, GDP, GDP per capita, life expectancy, urban share, literacy, mortality, mobile subscriptions, hospital beds.</li>" +
    "<li><strong>General Department of Vietnam Customs</strong> — exports and imports of goods, export products and destinations.</li>" +
    "<li><strong>EVN (Electricity of Viet Nam)</strong> — electricity output and renewables share of capacity.</li>" +
    "<li><strong>UN World Population Prospects</strong> — median age.</li>" +
    "<li><strong>UNESCO Institute for Statistics</strong> — adult literacy.</li>" +
    "<li><strong>UNDP Human Development Report</strong> — mean years of schooling.</li>" +
    "<li><strong>DataReportal</strong> — internet users (estimate).</li>" +
    "</ul></section>" +
    '<section class="panel"><h2>How to read the figures</h2>' +
    "<ul class=\"sources\">" +
    "<li>Values are rounded for display (one decimal unless shown otherwise); the underlying published figures are the same.</li>" +
    "<li>“Approx.” marks a figure rounded from a published estimate or converted between units.</li>" +
    "<li>Provincial populations are 2024 GSO estimates; densities are computed from population and area.</li>" +
    "<li>Trade figures cover goods only, not services.</li>" +
    "<li>GDP is nominal, in current US dollars, unless the label says “real growth”.</li>" +
    "</ul></section>" +
    '<section class="panel"><h2>About this site</h2>' +
    "<p>Mekong Figures is a single-page atlas built as plain static files — no build step, no network requests, no tracking. It runs from its own files in any modern browser, on a desktop or a phone. Charts are drawn in code from the figures in <code>app/data.js</code>; the source is open under the MIT licence.</p>" +
    '<p><a href="#/">Back to the atlas →</a></p>' +
    "</section>";
}

// View registry: route -> [title, renderer].
const VIEWS = {
  "/": ["Mekong Figures — Viet Nam in numbers", renderHome],
  "/population": ["People — Mekong Figures", renderPopulation],
  "/economy": ["Economy — Mekong Figures", renderEconomy],
  "/trade": ["Trade — Mekong Figures", renderTrade],
  "/regions": ["Regions — Mekong Figures", renderRegions],
  "/society": ["Society — Mekong Figures", renderSociety],
  "/data": ["Data explorer — Mekong Figures", renderData],
  "/about": ["About & sources — Mekong Figures", renderAbout],
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { VIEWS, provinceDetail };
}
