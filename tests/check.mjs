// Mekong Figures — local checks (Node 22, standard library only).
// Run: node tests/check.mjs
// Prints PASS n/n and exits non-zero on any failure. The browser checks
// start serve.ts on port 8091 and render every route in headless Chrome.

import { execFileSync, spawn } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const appDir = join(root, "app");
const require = createRequire(import.meta.url);

const CHROME = join(process.env.HOME, ".cache/ms-playwright/chromium-1255/chrome-linux64/chrome");

let passed = 0;
let failed = 0;
function check(name, ok, detail) {
  if (ok) { passed++; console.log("PASS  " + name); }
  else { failed++; console.log("FAIL  " + name + (detail ? " — " + detail : "")); }
}

// --- data integrity -------------------------------------------------------
const ATLAS = require(join(appDir, "data.js"));
check("provinces count is 63", ATLAS.provinces.length === 63, "got " + ATLAS.provinces.length);
check("province names unique", new Set(ATLAS.provinces.map((p) => p.name)).size === 63);
check("province pops positive", ATLAS.provinces.every((p) => p.pop > 0 && p.area > 0));
const totalPop = ATLAS.provinces.reduce((s, p) => s + p.pop, 0);
check("province pops sum near national total", totalPop > 95 && totalPop < 106, "sum " + totalPop.toFixed(1));
for (const [key, s] of Object.entries(ATLAS.series)) {
  check("series " + key + " has 10 values", s.values.length === ATLAS.years.length);
  check("series " + key + " values are numbers", s.values.every((v) => typeof v === "number" && isFinite(v)));
  check("series " + key + " has source", typeof s.source === "string" && s.source.length > 3);
}
check("headline has 6 indicators", ATLAS.headline.length === 6);
check("headline entries have source+year", ATLAS.headline.every((h) => h.source && h.year));
const sectorSum = ATLAS.sectors2024.reduce((s, d) => s + d.share, 0);
check("sector shares sum to 100", Math.abs(sectorSum - 100) < 0.01, "sum " + sectorSum);
const ageSum = ATLAS.ageStructure2024.reduce((s, d) => s + d.share, 0);
check("age shares sum to 100", Math.abs(ageSum - 100) < 0.01, "sum " + ageSum);
check("trade balance 2024 is +24.7", Math.abs(ATLAS.series.exports.values[9] - ATLAS.series.imports.values[9] - 24.7) < 0.01);
check("export products sorted by value", ATLAS.exportProducts2024.every((p, i, a) => i === 0 || a[i - 1].value >= p.value));

// --- charts ---------------------------------------------------------------
const charts = require(join(appDir, "charts.js"));
global.ATLAS = ATLAS;
Object.assign(global, charts);
const line = charts.lineChart(ATLAS.years, ATLAS.series.population.values, { showValues: true, decimals: 1 });
check("line chart is svg with values", line.includes("<svg") && line.includes("101.3") && line.includes("2015"));
const bars = charts.barChart(ATLAS.years.map(String), ATLAS.series.gdp.values, { decimals: 1 });
check("bar chart is svg with values", bars.includes("<svg") && bars.includes("476.4"));
const hbars = charts.hbarChart(ATLAS.exportProducts2024, {});
check("hbar chart lists products", hbars.includes("Electronics") && hbars.includes("72.5"));
const grouped = charts.groupedBarChart(ATLAS.years, ATLAS.series.exports.values, ATLAS.series.imports.values, { labelA: "Exports", labelB: "Imports" });
check("grouped chart has legend", grouped.includes("Exports") && grouped.includes("Imports"));
const donut = charts.donutChart(ATLAS.sectors2024, { centre: "100%" });
check("donut has all sectors", ATLAS.sectors2024.every((s) => donut.includes(charts.esc(s.name))));

// --- views render ---------------------------------------------------------
const views = require(join(appDir, "views.js"));
const expected = {
  "/": ["Mekong Figures", "101.3", "476.4", "Latest releases"],
  "/population": ["People", "63 provinces", "Median age"],
  "/economy": ["Economy", "7.1", "Unemployment"],
  "/trade": ["Trade", "405.5", "United States"],
  "/regions": ["Regions", "Province spotlight", "Ho Chi Minh City"],
  "/society": ["Society", "95.8%", "Life expectancy"],
  "/data": ["Data explorer", "Download CSV"],
  "/about": ["About", "General Statistics Office", "World Bank"],
};
for (const [route, words] of Object.entries(expected)) {
  const html = views.VIEWS[route][1]();
  check("view " + route + " renders", typeof html === "string" && html.length > 500);
  check("view " + route + " has content", words.every((w) => html.includes(w)), "missing: " + words.filter((w) => !html.includes(w)).join(", "));
  check("view " + route + " has no undefined", !html.includes("undefined"));
  check("view " + route + " has no placeholder text", !/lorem ipsum|TODO|XXX/i.test(html));
}
check("province detail renders", views.provinceDetail(ATLAS.provinces[0]).includes("9.5"));

// --- offline: no network references in app/ --------------------------------
const appFiles = readdirSync(appDir).filter((f) => /\.(html|js|css)$/.test(f));
for (const f of appFiles) {
  const text = readFileSync(join(appDir, f), "utf8");
  check("app/" + f + " has no absolute URL", !/https?:\/\/|wss?:\/\/|\/\/[a-z0-9-]+\.[a-z]{2,}/i.test(text), "found URL");
  check("app/" + f + " has no fetch/XHR", !/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(text));
}
const indexHtml = readFileSync(join(appDir, "index.html"), "utf8");
check("index loads only local files", ["data.js", "charts.js", "views.js", "main.js", "style.css"].every((f) => indexHtml.includes(f)));

// --- main.ts hand-in ------------------------------------------------------
const outDir = join(root, "out-test");
execFileSync("rm", ["-rf", outDir]);
execFileSync("node", ["main.ts"], { cwd: root, env: { ...process.env, MAKEFUN_OUTPUT_DIR: outDir } });
check("main.ts writes dossier.json", existsSync(join(outDir, "dossier.json")));
const dossier = JSON.parse(readFileSync(join(outDir, "dossier.json"), "utf8"));
check("dossier has app files", dossier.text && dossier.text.includes("app/index.html"));
check("dossier lists 4 screenshots", Array.isArray(dossier.images) && dossier.images.length === 4, "images: " + (dossier.images && dossier.images.length));
check("dossier cover is the first screenshot", typeof dossier.cover === "number" && dossier.images[dossier.cover].name === "1-home.jpg");
check("main.ts copies app/", existsSync(join(outDir, "app", "index.html")));

// --- screenshots (when present) -------------------------------------------
const shotsDir = join(root, "screenshots");
const shots = existsSync(shotsDir) ? readdirSync(shotsDir).filter((f) => /\.(jpg|png)$/i.test(f)) : [];
check("3-4 screenshots present", shots.length >= 3 && shots.length <= 4, "got " + shots.length);
if (shots.length > 0) {
  for (const f of shots) {
    const size = statSync(join(shotsDir, f)).size;
    check("screenshot " + f + " under 256 KiB", size <= 262144, size + " bytes");
  }
  const dims = execFileSync("python3", ["-c",
    "import json,sys; from PIL import Image; " +
    "print(json.dumps({f: Image.open('" + shotsDir + "/' + f).size for f in " + JSON.stringify(shots) + "}))",
  ], { encoding: "utf8" });
  const sizes = JSON.parse(dims);
  for (const [f, [w, h]] of Object.entries(sizes)) {
    check("screenshot " + f + " dimensions ok", Math.max(w, h) <= 1280 && Math.min(w, h) >= 360, w + "x" + h);
  }
  check("first screenshot is the cover (1-home.jpg)", shots.sort()[0] === "1-home.jpg");
  check("one screenshot is phone-sized", Object.values(sizes).some(([w, h]) => Math.min(w, h) <= 500));
}

// --- browser render of every route ----------------------------------------
if (existsSync(CHROME)) {
  const server = spawn("node", ["serve.ts", "--port", "8091"], { cwd: root, stdio: "ignore" });
  await new Promise((r) => setTimeout(r, 1200));
  try {
    const routes = { "#/": "Mekong Figures", "#/population": "Median age", "#/economy": "Unemployment", "#/trade": "United States", "#/regions": "Province spotlight", "#/society": "95.8%", "#/data": "Download CSV", "#/about": "General Statistics Office" };
    for (const [hash, marker] of Object.entries(routes)) {
      const dom = execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--no-sandbox", "--virtual-time-budget=5000", "--dump-dom", "http://127.0.0.1:8091/" + hash], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
      check("browser renders " + hash, dom.includes(marker) && !dom.includes(">undefined<"), "marker: " + marker);
    }
  } finally {
    server.kill();
  }
} else {
  console.log("SKIP  browser checks (no Chrome found)");
}

console.log("\n" + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
