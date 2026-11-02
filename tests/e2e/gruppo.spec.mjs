import { test, expect, chr } from "./fixtures.mjs";

const NOMI = ["Anna", "Bea", "Carlo"];

async function apriGruppo(page, nomi = NOMI) {
  await page.getByTestId("btn-multi").click();
  await expect(page.getByTestId("multi-setup")).toBeVisible();
  while ((await page.getByTestId("multi-nome").count()) < nomi.length) await page.getByTestId("btn-multi-aggiungi").click();
  const campi = page.getByTestId("multi-nome");
  for (let i = 0; i < nomi.length; i++) await campi.nth(i).fill(nomi[i]);
  await page.getByTestId("btn-multi-inizia").click();
}

async function votaTurno(page, indice) {
  await page.getByTestId("btn-turno-pronto").click();
  for (const d of await page.getByTestId("voto-pannello").getByTestId("voto-domanda").all()) {
    const opz = d.getByTestId("voto-opzione");
    await opz.nth(Math.min(indice, (await opz.count()) - 1)).click();
  }
  await page.getByTestId("btn-vota").click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html");
  await chr(page, () => __CHR__.resetStorage());
});

test("di default si gioca da soli", async ({ page }) => {
  await page.getByTestId("btn-nuova").click();
  await expect(page.getByTestId("btn-multi")).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByTestId("turno-schermo")).toHaveCount(0);
  await expect(page.getByTestId("voto-pannello")).toBeVisible();
});

test("setup: servono nomi non vuoti e diversi", async ({ page }) => {
  await page.getByTestId("btn-multi").click();
  await page.getByTestId("btn-multi-inizia").click();
  await expect(page.getByTestId("multi-errore")).toContainText("nome");
  const campi = page.getByTestId("multi-nome");
  await campi.nth(0).fill("Anna");
  await campi.nth(1).fill("anna");
  await page.getByTestId("btn-multi-inizia").click();
  await expect(page.getByTestId("multi-errore")).toContainText("stesso nome");
  await page.getByTestId("btn-multi-aggiungi").click();
  await expect(campi).toHaveCount(3);
  await page.getByTestId("btn-multi-rimuovi").first().click();
  await expect(campi).toHaveCount(2);
  await page.getByTestId("btn-multi-annulla").click();
  await expect(page.getByTestId("multi-setup")).toHaveCount(0);
});

test("turni segreti, poi si vedono tutti i voti insieme alle lenti", async ({ page }) => {
  await apriGruppo(page);
  await expect(page.getByTestId("btn-multi")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("multi-banner")).toContainText("Anna, Bea, Carlo");
  for (let i = 0; i < NOMI.length; i++) {
    await expect(page.getByTestId("turno-nome")).toHaveText(NOMI[i]);
    await expect(page.getByTestId("voto-pannello")).toHaveCount(0);
    await expect(page.getByTestId("btn-turno-pronto")).toBeFocused();
    await page.getByTestId("btn-turno-pronto").click();
    await expect(page.getByTestId("voto-pannello")).toHaveAttribute("data-giocatore", NOMI[i]);
    await expect(page.getByTestId("lente")).toHaveCount(0);
    await expect(page.getByTestId("voto-giocatore")).toHaveCount(0);
    await expect(page.locator("[data-testid=voto-opzione][aria-checked=true]")).toHaveCount(0);
    await page.getByTestId("voto-opzione").nth(i).click();
    await page.getByTestId("btn-vota").click();
  }
  await expect(page.getByTestId("voto-giocatore")).toHaveCount(3);
  for (let i = 0; i < NOMI.length; i++) await expect(page.locator(`[data-testid=voto-giocatore][data-nome=${NOMI[i]}]`)).toHaveAttribute("data-valore", String(i + 1));
  expect(await page.getByTestId("lente").count()).toBeGreaterThanOrEqual(5);
  await expect(page.locator("[data-testid=voto-opzione][data-valore='2']")).toHaveAttribute("aria-checked", "true");
  await expect(page.getByTestId("btn-avanti")).toBeFocused();
  await page.getByTestId("btn-avanti").click();
  await expect(page.getByTestId("turno-nome")).toHaveText("Anna");
});

test("partita di gruppo completa fino al verdetto della giuria", async ({ page }) => {
  await apriGruppo(page, ["Anna", "Bea"]);
  const seed = await chr(page, () => { for (let s = 1; s < 5000; s++) if (__CHR__.simulaPercorso(s).length >= 4) return s; });
  await page.evaluate(s => { location.hash = `#s-${s}`; }, seed);
  await expect.poll(() => chr(page, () => __CHR__.stato().seed)).toBe(seed);
  const livelli = await chr(page, () => __CHR__.simulaPercorso(__CHR__.stato().seed).length);
  for (let lv = 0; lv < livelli; lv++) {
    await votaTurno(page, 0);
    await votaTurno(page, 0);
    await page.getByTestId("btn-avanti").click();
  }
  await expect(page.getByTestId("finale")).toBeVisible();
  await expect(page.getByTestId("finale-gruppo")).toBeVisible();
  await expect(page.getByTestId("finale-somiglianza")).toHaveCount(0);
  await expect(page.getByTestId("finale-giocatore")).toHaveCount(2);
  await expect(page.getByTestId("finale-giocatore").first()).toContainText("al 100%");
  const domande = await page.getByTestId("finale-confronto").locator("tbody tr").count();
  await expect(page.getByTestId("finale-unanimi")).toHaveText(String(domande));
  await expect(page.getByTestId("finale-confronto").locator("thead")).toContainText("Anna");
  const salvato = await page.evaluate(k => JSON.parse(localStorage.getItem(k)), await chr(page, () => __CHR__.storageKey));
  expect(salvato.storico[0].modo).toBe("gruppo");
  expect(Object.keys(salvato.storico[0].giocatori)).toEqual(["Anna", "Bea"]);
  expect(salvato.somiglianza).toBeUndefined();
});

test("voto del gruppo: mediana sulla scala, maggioranza sulle scelte", async ({ page }) => {
  await apriGruppo(page);
  await votaTurno(page, 0);
  await votaTurno(page, 4);
  await votaTurno(page, 3);
  await expect(page.locator("[data-testid=voto-opzione][data-valore='4']")).toHaveAttribute("aria-checked", "true");
});

test("si torna a giocare da soli e i nomi vengono ricordati", async ({ page }) => {
  await apriGruppo(page);
  await page.getByTestId("btn-multi").click();
  await expect(page.getByTestId("btn-multi")).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByTestId("turno-schermo")).toHaveCount(0);
  await expect(page.getByTestId("btn-vota")).toBeVisible();
  await page.reload();
  await page.getByTestId("btn-multi").click();
  await expect(page.getByTestId("multi-nome")).toHaveCount(3);
  await expect(page.getByTestId("multi-nome").first()).toHaveValue("Anna");
});
