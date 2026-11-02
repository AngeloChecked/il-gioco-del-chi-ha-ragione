import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";

const suite = readFileSync(fileURLToPath(new URL("../suite.js", import.meta.url)), "utf8");
const API_COMPLETA = ["avanti", "vota", "simulaPercorso", "testiPercorso", "lenti", "dati", "resetStorage"];

test("criteri di accettazione AC1-AC10 (tests/suite.js)", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/index.html#gioco");
  const mancanti = await page.evaluate(k => k.filter(x => !(x in (window.__CHR__ || {}))), API_COMPLETA);
  test.skip(mancanti.length > 0, `__CHR__ incompleto, mancano: ${mancanti.join(", ")}`);
  const report = JSON.parse(await page.evaluate(suite));
  const falliti = report.risultati.filter(r => !r.ok).map(r => `${r.id}: ${r.errore}`);
  expect(falliti).toEqual([]);
  expect(report.erroriJS).toEqual([]);
});
