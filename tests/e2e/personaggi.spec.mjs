import { test, expect, chr } from "./fixtures.mjs";

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html#personaggi");
  await chr(page, () => __CHR__.resetStorage());
});

test("elenco con tutti i personaggi e anteprima (AC8)", async ({ page }) => {
  await expect(page.getByTestId("editor-personaggio")).toHaveCount(12);
  await expect(page.getByTestId("editor-tratto")).toHaveCount(8);
  await expect(page.getByTestId("editor-esaspera")).toBeVisible();
  await expect(page.getByTestId("editor-anteprima").locator("svg")).toHaveCount(3);
});

test("modifica tratti e testi persiste dopo il reload", async ({ page }) => {
  await page.locator("[data-testid=editor-personaggio][data-id=luca]").click();
  await page.getByTestId("editor-nome").fill("Luca Bis");
  await page.locator("[data-tratto=sensibilita_religiosa]").fill("0.12");
  await page.getByTestId("editor-esaspera").fill("1.5");
  await expect(page.locator("[data-testid=editor-personaggio][data-id=luca]")).toContainText("Luca Bis");
  await page.reload();
  await page.locator("[data-testid=editor-personaggio][data-id=luca]").click();
  await expect(page.getByTestId("editor-nome")).toHaveValue("Luca Bis");
  await expect(page.locator("[data-tratto=sensibilita_religiosa]")).toHaveValue("0.12");
  await expect(page.getByTestId("editor-esaspera")).toHaveValue("1.5");
});

test("duplica, nuovo, elimina, ripristina", async ({ page }) => {
  await page.locator("[data-testid=editor-personaggio][data-id=sara]").click();
  await page.getByTestId("editor-duplica").click();
  await expect(page.getByTestId("editor-personaggio")).toHaveCount(13);
  await expect(page.getByTestId("editor-nome")).toHaveValue("Sara (copia)");
  await page.getByTestId("editor-nuovo").click();
  await expect(page.getByTestId("editor-personaggio")).toHaveCount(14);
  await expect(page.getByTestId("editor-nome")).toBeFocused();
  await page.getByTestId("editor-elimina").click();
  await expect(page.getByTestId("editor-personaggio")).toHaveCount(13);
  await page.locator("[data-testid=editor-personaggio][data-id=sara]").click();
  await expect(page.getByTestId("editor-elimina")).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId("editor-personaggio")).toHaveCount(13);
  await page.getByTestId("editor-ripristina").click();
  await expect(page.getByTestId("editor-personaggio")).toHaveCount(12);
  await page.reload();
  await expect(page.getByTestId("editor-personaggio")).toHaveCount(12);
});

test("i tratti modificati cambiano le lenti in partita", async ({ page }) => {
  const prima = await chr(page, () => { __CHR__.nuova(482913); return __CHR__.lenti(0, "appropriata").find(l => l.id === "ettore").valore; });
  await page.goto("/index.html#personaggi");
  await page.locator("[data-testid=editor-personaggio][data-id=ettore]").click();
  for (const t of ["sensibilita_generica", "rispetto_contesto", "sensibilita_religiosa"]) await page.locator(`[data-tratto=${t}]`).fill("1");
  const dopo = await chr(page, () => { __CHR__.nuova(482913); return __CHR__.lenti(0, "appropriata").find(l => l.id === "ettore").valore; });
  expect(dopo).toBeLessThan(prima);
});

test("i personaggi duplicati compaiono nelle partite", async ({ page }) => {
  await page.locator("[data-testid=editor-personaggio][data-id=dario]").click();
  for (let i = 0; i < 3; i++) await page.getByTestId("editor-duplica").click();
  const visto = await chr(page, () => {
    for (let s = 1; s < 3000; s++) {
      const sit = __CHR__.generaSituazione(s);
      if ([sit.autore.id, sit.osservatore.id].some(id => id.startsWith("dario-"))) return true;
    }
    return false;
  });
  expect(visto).toBe(true);
});

test("cambio aspetto aggiorna l'anteprima", async ({ page }) => {
  await page.locator("[data-testid=editor-personaggio][data-id=marco]").click();
  const prima = await page.getByTestId("editor-anteprima").innerHTML();
  await page.locator("[data-avatar=distintivo]").selectOption("cappello");
  await expect.poll(() => page.getByTestId("editor-anteprima").innerHTML()).not.toBe(prima);
});
