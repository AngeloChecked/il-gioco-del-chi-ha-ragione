import { chromium, firefox } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const out = join(root, "tests", "output", "galleria");
const PORT = 8797;
const args = new Set(process.argv.slice(2));
const solo = [...args].find(a => a.startsWith("--solo="))?.slice(7);
const engine = args.has("--firefox") ? firefox : chromium;

const server = spawn(process.execPath, [join(root, "tests", "server.mjs"), String(PORT)], { stdio: "ignore" });
await new Promise(r => setTimeout(r, 400));
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const browser = await engine.launch();
const scatti = [];

async function scatta(page, nome, sel = "main") {
  const file = `${nome}.png`;
  await (sel ? page.locator(sel).first() : page).screenshot({ path: join(out, file), animations: "disabled", ...(sel ? {} : { fullPage: true }) });
  scatti.push(file);
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await desktop.goto(`http://127.0.0.1:${PORT}/index.html#gioco`);

  if (!solo || solo === "avatar") {
    await desktop.evaluate(() => {
      const { PERSONAGGI } = Motore;
      const cell = (p, o) => `<figure style="margin:0;text-align:center;width:110px"><div style="width:100px;height:170px;margin:auto">${Asset.avatarSVG(p, o)}</div><figcaption style="font:12px sans-serif">${p.nome}<br>${o.espressione || ""} ${o.posa || ""}</figcaption></figure>`;
      const righe = PERSONAGGI.map(p => `<div style="display:flex;gap:4px;flex-wrap:wrap;background:#DDE5E0;padding:6px">${Asset.ESPRESSIONI.map(e => cell(p, { espressione: e })).join("")}${["seduto", "voltato", "allontana"].map(po => cell(p, { posa: po })).join("")}</div>`).join("");
      document.querySelector("main").innerHTML = `<div style="display:grid;gap:6px;grid-column:1/-1">${righe}</div>`;
    });
    await scatta(desktop, "00-avatar");
  }

  if (!solo || solo === "luoghi") {
    for (const l of await desktop.evaluate(() => Motore.LUOGHI.map(l => l.id))) {
      await desktop.evaluate(id => {
        const I = __CHR__._interno;
        I.avviaCostruita({ luogo: id, condotta: id === "fumare" ? "fumare" : "bestemmia_singola", bambini: 1, pubblico: 2, amici: ["gigi", "sara"] });
      }, l);
      await scatta(desktop, `10-luogo-${l}`, "[data-testid=scena]");
    }
  }

  if (!solo || solo === "livelli") {
    const seed = await desktop.evaluate(() => {
      for (let s = 1; s < 5000; s++) if (__CHR__.simulaPercorso(s).length === 7) return s;
    });
    await desktop.evaluate(s => __CHR__.nuova(s), seed);
    for (let lv = 0; lv < 7; lv++) {
      await desktop.evaluate(() => {
        for (const d of document.querySelectorAll("[data-testid=voto-domanda]")) {
          const o = d.querySelectorAll("[data-testid=voto-opzione]");
          o[Math.floor(o.length / 2)]?.click();
        }
        document.querySelector("[data-testid=btn-vota]")?.click();
      });
      await scatta(desktop, `20-livello-${lv}`, null);
      await desktop.evaluate(() => document.querySelector("[data-testid=btn-avanti]")?.click());
    }
    await scatta(desktop, "30-finale", null);

    const mobile = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
    await mobile.goto(`http://127.0.0.1:${PORT}/index.html#s-${seed}`);
    await scatta(mobile, "40-mobile-livello-0", null);
    await mobile.evaluate(() => { __CHR__.vota({}); __CHR__.avanti(); __CHR__.avanti(); __CHR__.avanti(); });
    await scatta(mobile, "41-mobile-livello-3", null);

    const scuro = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: "dark", reducedMotion: "reduce" });
    await scuro.goto(`http://127.0.0.1:${PORT}/index.html#s-${seed}`);
    await scatta(scuro, "50-scuro-livello-0", null);
  }

  for (const vista of solo && !["avatar", "luoghi", "livelli"].includes(solo) ? [solo] : !solo ? ["laboratorio", "indovina", "costruisci", "personaggi"] : []) {
    await desktop.setViewportSize({ width: 1280, height: 1400 });
    await desktop.goto(`http://127.0.0.1:${PORT}/index.html#${vista}`);
    await desktop.waitForTimeout(150);
    await scatta(desktop, `60-${vista}`, null);
  }

  await writeFile(join(out, "index.html"), `<!doctype html><meta charset="utf-8"><title>Galleria</title><body style="font-family:sans-serif;background:#eee">${scatti.map(f => `<figure><figcaption>${f}</figcaption><img src="${f}" style="max-width:100%;border:1px solid #999"></figure>`).join("")}`);
  console.log(`${scatti.length} screenshot in tests/output/galleria/`);
} finally {
  await browser.close();
  server.kill();
}
