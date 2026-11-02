import { test, expect, chr } from "./fixtures.mjs";

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html");
});

test("espone __CHR__ e il semaforo a 7 luci", async ({ page }) => {
  expect(await chr(page, () => typeof window.__CHR__)).toBe("object");
  await expect(page.getByTestId("semaforo-luce")).toHaveCount(7);
  await expect(page.getByTestId("seed")).toHaveText("");
});

test("Nuova grana genera un caso con seed visibile e nell'hash", async ({ page }) => {
  await page.getByTestId("btn-nuova").click();
  const seed = await chr(page, () => __CHR__.stato().seed);
  expect(seed).toBeGreaterThan(0);
  await expect(page.getByTestId("seed")).toContainText(String(seed));
  await expect(page).toHaveURL(new RegExp(`#s-${seed}$`));
});

test("due click producono seed diversi", async ({ page }) => {
  const btn = page.getByTestId("btn-nuova");
  await btn.click();
  const a = await chr(page, () => __CHR__.stato().seed);
  await btn.click();
  const b = await chr(page, () => __CHR__.stato().seed);
  expect(b).not.toBe(a);
});

test("#s-<seed> riproduce lo stesso caso dopo reload", async ({ page }) => {
  await page.goto("/index.html#s-482913");
  const testo = await page.getByTestId("didascalia").textContent();
  await page.reload();
  expect(await chr(page, () => __CHR__.stato().seed)).toBe(482913);
  await expect(page.getByTestId("didascalia")).toHaveText(testo);
  const luogo = await chr(page, () => __CHR__.generaSituazione(482913).luogo);
  expect(testo).toContain(luogo);
});

test("il bottone si raggiunge da tastiera con focus visibile", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "Safari non mette i bottoni nell'ordine di Tab di default");
  await page.keyboard.press("Tab");
  const btn = page.getByTestId("btn-nuova");
  await expect(btn).toBeFocused();
  expect(await btn.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe("none");
});

test("nessuno scroll orizzontale", async ({ page }) => {
  await page.getByTestId("btn-nuova").click();
  expect(await chr(page, () => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
