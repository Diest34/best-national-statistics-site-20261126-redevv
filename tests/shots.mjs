// Mekong Figures — take the 4 screenshots with headless Chrome and
// convert them to JPEG (<=256 KiB, long side <=1280) with PIL.
// Run: node tests/shots.mjs   (serves app/ on port 8092 itself)

import { execFileSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const CHROME = join(process.env.HOME, ".cache/ms-playwright/chromium-1255/chrome-linux64/chrome");
const shots = JSON.parse((await import("node:fs")).readFileSync(join(root, "shots.json"), "utf8"));

const server = spawn("node", ["serve.ts", "--port", "8092"], { cwd: root, stdio: "ignore" });
await new Promise((r) => setTimeout(r, 1200));
try {
  for (const s of shots) {
    const png = join("/tmp", "mf-shot-" + s.file.replace(/\.(jpg|png)$/i, "") + ".png");
    const url = "http://127.0.0.1:8092/" + s.path;
    execFileSync(CHROME, [
      "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
      "--virtual-time-budget=6000",
      "--window-size=" + s.viewport.width + "," + s.viewport.height,
      "--screenshot=" + png, url,
    ], { stdio: "inherit" });
    // Convert to JPEG, shrink to fit the gate (long side <= 1280, <= 256 KiB).
    execFileSync("python3", ["-c", `
from PIL import Image
im = Image.open(${JSON.stringify(png)}).convert("RGB")
w, h = im.size
if max(w, h) > 1280:
    r = 1280 / max(w, h)
    im = im.resize((round(w * r), round(h * r)), Image.LANCZOS)
q = 82
im.save(${JSON.stringify(join(root, "screenshots", s.file))}, "JPEG", quality=q)
import os
while os.path.getsize(${JSON.stringify(join(root, "screenshots", s.file))}) > 250000 and q > 40:
    q -= 8
    im.save(${JSON.stringify(join(root, "screenshots", s.file))}, "JPEG", quality=q)
print(${JSON.stringify(s.file)}, im.size, os.path.getsize(${JSON.stringify(join(root, "screenshots", s.file))}), "bytes, q=", q)
`], { stdio: "inherit" });
  }
} finally {
  server.kill();
}
console.log("done");
