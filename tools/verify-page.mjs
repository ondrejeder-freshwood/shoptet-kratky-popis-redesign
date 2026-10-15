// Local check of the AHOME mobile redesign on a live Shoptet page without uploading anything.
// Opens the page in headless Edge, injects the local CSS/JS, prints key checks and saves a screenshot.
//
// Usage:
//   node tools/verify-page.mjs <url> <css> <js> [--width 394] [--fixture tools/upsell-fixture.html] [--out verification]
// Example:
//   node tools/verify-page.mjs https://www.ahome.cz/drevena-vune-do-auta-fresh-wood-nekonecno/ AHOME-product-top-pilot-v20/CSS/kratky-popis.css AHOME-product-top-pilot-v20/JS/kratky-popis.js --fixture tools/upsell-fixture.html
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const option = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; };
const [url, cssPath, jsPath] = args;
if (!url || !cssPath || !jsPath) { console.error("Usage: node tools/verify-page.mjs <url> <css> <js> [--width 394] [--fixture file] [--out dir]"); process.exit(1); }
const width = Number(option("--width", 394));
const fixturePath = option("--fixture", "");
const outDir = option("--out", "verification");
const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

// The star icon lives on the Shoptet server; inline it so the check works on pages where it is not uploaded.
const star = "AHOME-product-top-pilot-v20/Ikonky/rating-star.svg";
let js = fs.readFileSync(jsPath, "utf8");
if (fs.existsSync(star)) js = js.replace("/user/documents/upload/Ikonky/rating-star.svg", "data:image/svg+xml," + encodeURIComponent(fs.readFileSync(star, "utf8")));
const css = fs.readFileSync(cssPath, "utf8");
const fixture = fixturePath ? fs.readFileSync(fixturePath, "utf8") : "";
const font = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap";
// Upsell addon does not load in headless Edge; the fixture is a captured copy of its markup.
const inject = `(() => {
  const fixture = ${JSON.stringify(fixture)};
  const short = document.querySelector(".p-short-description");
  if (fixture && short && !document.querySelector(".up-product-wrapper")) short.insertAdjacentHTML("afterend", fixture);
  const link = document.createElement("link"); link.rel = "stylesheet"; link.href = ${JSON.stringify(font)}; document.head.append(link);
  const style = document.createElement("style"); style.textContent = ${JSON.stringify(css)}; document.head.append(style);
  const script = document.createElement("script"); script.textContent = ${JSON.stringify(js)}; document.body.append(script);
  return "injected";
})()`;

const port = 9400 + Math.floor(Math.random() * 400);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "ahome-verify-"));
const proc = spawn(edge, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const done = (code) => { try { proc.kill(); } catch {} process.exit(code); };
setTimeout(() => { console.error("Timeout"); done(2); }, 90000);

let targets;
for (let i = 0; i < 40; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (targets.find((t) => t.type === "page")) break; } catch {} await sleep(250); }
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const evaluate = async (expression) => { const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description; };

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 2, mobile: width < 768 });
await send("Page.navigate", { url });
await sleep(8000);
await evaluate(inject);
await sleep(2500);
await evaluate("document.fonts.ready.then(() => 1)");
const info = await evaluate(`(() => {
  const q = (s) => document.querySelector(s);
  const visible = (e) => e && e.getClientRects().length > 0;
  const bc = q(".breadcrumbs");
  return {
    pilotActive: document.documentElement.classList.contains("ahome-product-top-v1"),
    breadcrumbsActive: document.documentElement.classList.contains("ahome-breadcrumbs-v1"),
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    breadcrumb: visible(bc) ? bc.innerText.replace(/\\s+/g, " ").trim() : "(hidden)",
    title: q(".ahome-product-top-title-slot h1")?.innerText.replace(/\\s+/g, " "),
    rating: q(".ahome-product-top-rating")?.innerText,
    availability: q(".ahome-product-top-meta .availability-value")?.innerText,
    pills: [...document.querySelectorAll(".ahome-product-top-benefit")].map((e) => e.textContent),
    upsell: [...document.querySelectorAll(".up-product")].map((e) => [e.querySelector(".up-product-name")?.innerText.trim(), e.querySelector(".ahome-up-savings")?.textContent, e.querySelector(".ahome-up-badge")?.textContent].join(" | ")),
    sticky: q(".sticky-atc-bar")?.innerText.replace(/\\s+/g, " "),
    montserrat: document.fonts.check("700 22px Montserrat"),
  };
})()`);
console.log(JSON.stringify(info, null, 2));
fs.mkdirSync(outDir, { recursive: true });
const name = new URL(url).pathname.replace(/\W+/g, "-").replace(/^-|-$/g, "") || "home";
const height = await evaluate("Math.min(document.documentElement.scrollHeight, 3000)");
const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width, height, scale: 1 } });
const file = path.join(outDir, `check-${name}-${width}.png`);
fs.writeFileSync(file, Buffer.from(shot.result.data, "base64"));
console.log("screenshot:", file);
ws.close();
done(0);
