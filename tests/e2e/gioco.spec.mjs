import { test, expect, chr } from "./fixtures.mjs";

const trovaSeed = (page, cond) => page.evaluate(cond => {
  const f = new Function("p", "s", `return ${cond}`);
  for (let s = 1; s < 5000; s++) if (f(__CHR__.simulaPercorso(s), __CHR__.generaSituazione(s))) return s;
  return null;
}, cond);

async function votaLivello(page) {
  const pannello = page.getByTestId("voto-pannello");
  for (const d of await pannello.getByTestId("voto-domanda").all()) {
    const opz = d.getByTestId("voto-opzione");
    await opz.nth(Math.floor((await opz.count()) / 2)).click();
  }
  await page.getByTestId("btn-vota").click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html");
});

test("all'avvio mostra l'intro, il semaforo spento e __CHR__", async ({ page }) => {
  expect(await chr(page, () => typeof window.__CHR__)).toBe("object");
  await expect(page.getByTestId("intro")).toBeVisible();
  await expect(page.getByTestId("semaforo-luce")).toHaveCount(7);
  await expect(page.locator("[data-testid=semaforo-luce][data-accesa=true]")).toHaveCount(0);
});

test("Nuova grana genera una scena completa con seed nell'hash (AC1)", async ({ page }) => {
  await page.getByTestId("btn-nuova").click();
  const seed = await chr(page, () => __CHR__.stato().seed);
  await expect(page.getByTestId("seed")).toContainText(String(seed));
  await expect(page).toHaveURL(new RegExp(`#s-${seed}$`));
  await expect(page.locator("[data-testid=personaggio][data-ruolo=autore]")).toHaveCount(1);
  await expect(page.locator("[data-testid=personaggio][data-ruolo=osservatore]")).toHaveCount(1);
  for (const n of ["luogo", "condotta", "volume", "bambini", "terzo"]) await expect(page.locator(`[data-testid=variabile][data-nome=${n}]`)).toHaveCount(1);
  await expect(page.getByTestId("fumetto").first()).toBeVisible();
  await expect(page.locator("[data-testid=semaforo-luce][data-accesa=true]")).toHaveCount(1);
});

test("due click producono seed diversi", async ({ page }) => {
  const btn = page.getByTestId("btn-nuova");
  await btn.click();
  const a = await chr(page, () => __CHR__.stato().seed);
  await btn.click();
  expect(await chr(page, () => __CHR__.stato().seed)).not.toBe(a);
});

test("#s-<seed> riproduce lo stesso caso, anche senza reload (AC6)", async ({ page }) => {
  await page.goto("/index.html#s-482913");
  const scena = async () => ({
    luogo: await page.getByTestId("scena-luogo").getAttribute("data-luogo"),
    pg: await page.getByTestId("personaggio").evaluateAll(els => els.map(e => e.dataset.id)),
    testi: await page.getByTestId("fumetto").allTextContents(),
  });
  const a = await scena();
  await page.reload();
  expect(await scena()).toEqual(a);
  await chr(page, () => __CHR__.nuova(7));
  await page.evaluate(() => { location.hash = "#s-482913"; });
  await expect.poll(() => chr(page, () => __CHR__.stato().seed)).toBe(482913);
  expect(await scena()).toEqual(a);
});

test("partita completa fino alla sentenza (AC2-AC5)", async ({ page }) => {
  const seed = await trovaSeed(page, "p.length === 7");
  await page.goto(`/index.html#s-${seed}`);
  for (let lv = 0; lv < 7; lv++) {
    await expect(page.getByTestId("voto-pannello")).toHaveAttribute("data-livello", String(lv));
    await expect(page.getByTestId("lente")).toHaveCount(0);
    await expect(page.getByTestId("btn-vota")).toBeDisabled();
    await votaLivello(page);
    expect(await page.getByTestId("lente").count()).toBeGreaterThanOrEqual(5);
    await expect(page.getByTestId("voto-opzione").first()).toBeDisabled();
    const prima = await page.getByTestId("fumetto").allTextContents();
    await page.getByTestId("btn-avanti").click();
    if (lv < 6) {
      await expect(page.locator("[data-testid=semaforo-luce][data-accesa=true]")).toHaveCount(lv + 2);
      expect(await page.getByTestId("fumetto").allTextContents()).not.toEqual(prima);
    }
  }
  await expect(page.getByTestId("finale")).toBeVisible();
  await expect(page.getByTestId("finale-etichetta")).not.toBeEmpty();
  await expect(page.getByTestId("finale-somiglianza")).toContainText(/somigli a/);
  await expect(page.getByTestId("finale-confronto").locator("tbody tr")).toHaveCount(10);
  expect(await chr(page, () => __CHR__.stato().finito)).toBe(true);
});

test("chiusura anticipata: chi cede accende il verde e chiude", async ({ page }) => {
  const seed = await trovaSeed(page, "p.length === 4 && p[3].esito === 'accetta'");
  await page.goto(`/index.html#s-${seed}`);
  for (let i = 0; i < 3; i++) await page.getByTestId("btn-avanti").click();
  await expect(page.locator(".luce.cede")).toHaveCount(1);
  await page.getByTestId("btn-avanti").click();
  await expect(page.getByTestId("finale")).toBeVisible();
  await expect(page.getByTestId("finale-somiglianza")).toContainText(/Nessun voto/);
});

test("il campo perché accetta al massimo 140 caratteri e finisce nel finale", async ({ page }) => {
  await page.goto("/index.html#s-1");
  const campo = page.getByTestId("voto-perche");
  await campo.fill("x".repeat(200));
  expect((await campo.inputValue()).length).toBe(140);
  await campo.fill("Perché sì");
  await votaLivello(page);
  await chr(page, () => { while (!__CHR__.stato().finito) __CHR__.avanti(); });
  await expect(page.getByTestId("finale-confronto")).toContainText("Perché sì");
});

test("richiesta su un'identità: avviso nel finale (AC9)", async ({ page }) => {
  const seed = await trovaSeed(page, "s.identita && p.length >= 3");
  await page.goto(`/index.html#s-${seed}`);
  await chr(page, () => { while (!__CHR__.stato().finito) __CHR__.avanti(); });
  await expect(page.getByTestId("finale-identita")).toBeVisible();
});

test("rigioca e condividi", async ({ page, context, browserName }) => {
  const seed = await trovaSeed(page, "p.length >= 4");
  await page.goto(`/index.html#s-${seed}`);
  const testi = await page.getByTestId("fumetto").allTextContents();
  await chr(page, () => { while (!__CHR__.stato().finito) __CHR__.avanti(); });
  await page.getByTestId("btn-rigioca").click();
  expect(await chr(page, () => __CHR__.stato().livello)).toBe(0);
  expect(await page.getByTestId("fumetto").allTextContents()).toEqual(testi);
  if (browserName === "chromium") await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await chr(page, () => { while (!__CHR__.stato().finito) __CHR__.avanti(); });
  await page.getByTestId("btn-condividi").click();
  await expect(page.getByTestId("toast")).toContainText(`#s-${seed}`.slice(0, 0) || /Link copiato|Copia questo link/);
});

test("le bestemmie compaiono solo come adesivo di censura", async ({ page }) => {
  const seed = await trovaSeed(page, "s.condotta.id === 'bestemmie_ripetute'");
  await page.goto(`/index.html#s-${seed}`);
  const c = page.getByTestId("censura");
  expect(await c.count()).toBeGreaterThan(0);
  for (const el of await c.all()) {
    expect(["1", "2", "3"]).toContain(await el.getAttribute("data-intensita"));
    await expect(el).toHaveAttribute("aria-label", /censurat/);
  }
});

test("navigazione da tastiera: voto con frecce e Invio", async ({ page, browserName }) => {
  test.skip(browserName === "webkit", "Safari non mette i bottoni nell'ordine di Tab di default");
  await page.goto("/index.html#s-1");
  await page.getByTestId("voto-opzione").first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("voto-opzione").nth(1)).toBeFocused();
  await expect(page.getByTestId("voto-opzione").nth(1)).toHaveAttribute("aria-checked", "true");
  await page.getByTestId("btn-vota").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("lente").first()).toBeVisible();
  await expect(page.getByTestId("btn-avanti")).toBeFocused();
});

test("cambio tema persistente", async ({ page }) => {
  await page.getByTestId("btn-tema").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByTestId("btn-tema").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("nessuno scroll orizzontale, anche nel finale con tutti i voti", async ({ page }) => {
  const seed = await trovaSeed(page, "p.length === 7");
  await page.goto(`/index.html#s-${seed}`);
  expect(await chr(page, () => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await chr(page, () => { while (!__CHR__.stato().finito) { __CHR__.vota({ appropriata: 3, fastidio_comprensibile: 3, richiesta_lecita: "si", richiesta_ragionevole: 3, condotta_o_identita: "condotta", risposta_lecita: "si", cortese_accontentare: 3, piu_ragionevole: "entrambi", responsabilita: "condivisa", chi_ha_ragione: "dipende", perche: "una motivazione abbastanza lunga da occupare spazio nella tabella" }); __CHR__.avanti(); } });
  await expect(page.getByTestId("finale-confronto")).toBeVisible();
  expect(await chr(page, () => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
