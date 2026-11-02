import { firefox } from "playwright-core";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "tests", "output");
const tipi = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

const server = createServer(async (req, res) => {
  try {
    const path = join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (!path.startsWith(root)) throw new Error("fuori root");
    const body = await readFile(path);
    res.writeHead(200, { "content-type": tipi[extname(path)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
}).listen(0, "127.0.0.1");
await new Promise(r => server.once("listening", r));
const base = `http://127.0.0.1:${server.address().port}/index.html`;

const risultati = [];
const check = (nome, ok, info = "") => risultati.push({ nome, ok: !!ok, info });

const browser = await firefox.launch({ headless: !process.env.HEADED });
try {
  await mkdir(out, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errori = [];
  page.on("pageerror", e => errori.push(e.message));
  page.on("console", m => m.type() === "error" && errori.push(m.text()));

  await page.goto(base);
  check("api esposta", await page.evaluate(() => !!window.__CHR__));
  check("semaforo 7 luci", (await page.getByTestId("semaforo-luce").count()) === 7);
  check("seed vuoto all'avvio", (await page.getByTestId("seed").textContent()).trim() === "");

  const btn = page.getByRole("button", { name: "Nuova grana" });
  await btn.click();
  const seed1 = await page.evaluate(() => __CHR__.stato().seed);
  check("click genera seed", seed1 > 0, `seed ${seed1}`);
  check("seed visibile", (await page.getByTestId("seed").textContent()).includes(String(seed1)));
  check("hash aggiornato", page.url().endsWith(`#s-${seed1}`), page.url());
  await page.screenshot({ path: join(out, "smoke-desktop.png") });

  await btn.click();
  const seed2 = await page.evaluate(() => __CHR__.stato().seed);
  check("secondo click cambia seed", seed2 !== seed1, `${seed1} -> ${seed2}`);

  await page.goto(`${base}#s-${seed1}`);
  await page.reload();
  const luogoA = await page.getByTestId("didascalia").textContent();
  check("hash riproduce seed", (await page.evaluate(() => __CHR__.stato().seed)) === seed1);
  check("stesso seed stesso luogo", luogoA === await page.evaluate(s => __CHR__.generaSituazione(s).luogo + ". Tutto tranquillo. Per ora.", seed1), luogoA);

  await page.keyboard.press("Tab");
  check("bottone focusabile da tastiera", await btn.evaluate(el => el === document.activeElement));

  await page.setViewportSize({ width: 375, height: 812 });
  check("mobile senza scroll orizzontale", await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: join(out, "smoke-mobile.png") });

  check("nessun errore JS", errori.length === 0, errori.join(" | "));
} finally {
  await browser.close();
  server.close();
}

for (const r of risultati) console.log(`${r.ok ? "✅" : "❌"} ${r.nome}${r.info ? `  (${r.info})` : ""}`);
const falliti = risultati.filter(r => !r.ok).length;
console.log(`\n${risultati.length - falliti}/${risultati.length} ok · screenshot in tests/output/`);
process.exit(falliti ? 1 : 0);
