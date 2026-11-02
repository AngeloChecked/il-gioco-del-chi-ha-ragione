import { test, expect } from "./fixtures.mjs";

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html#laboratorio");
});

test("caso base: parco, bestemmia singola, richiesta gentile", async ({ page }) => {
  await expect(page.getByTestId("lab-scena").getByTestId("scena-luogo")).toHaveAttribute("data-luogo", "parco");
  await expect(page.locator("#lab-condotta")).toHaveValue("bestemmia_singola");
  await expect(page.locator("#lab-stile")).toHaveValue("gentile");
  await expect(page.getByTestId("lab-scena").getByTestId("fumetto")).toHaveCount(2);
  await expect(page.getByTestId("lab-variabile")).toHaveCount(12);
  await expect(page.getByTestId("lab-grafico")).toBeVisible();
});

test("una sola variabile alla volta, poi reset (AC7)", async ({ page }) => {
  await page.locator("#lab-luogo").selectOption("cinema");
  await expect(page.locator("[data-testid=lab-variabile][data-attiva=true]")).toHaveCount(1);
  await expect(page.locator("[data-testid=lab-variabile][data-nome=luogo]")).toHaveAttribute("data-attiva", "true");
  await expect(page.locator("#lab-volume")).toBeDisabled();
  await expect(page.locator("#lab-luogo")).toBeEnabled();
  await expect(page.getByTestId("lab-scena").getByTestId("scena-luogo")).toHaveAttribute("data-luogo", "cinema");
  await page.getByTestId("btn-lab-reset").click();
  await expect(page.locator("[data-testid=lab-variabile][data-attiva=true]")).toHaveCount(0);
  await expect(page.locator("#lab-volume")).toBeEnabled();
  await expect(page.locator("#lab-luogo")).toHaveValue("parco");
});

test("i voti per valore finiscono nel grafico con le lenti", async ({ page }) => {
  await page.locator("[data-testid=lab-opzione][data-valore='4']").click();
  await expect(page.getByTestId("lente")).toHaveCount(5);
  await page.locator("#lab-bambini").selectOption("2");
  await expect(page.getByTestId("lente")).toHaveCount(0);
  await page.locator("[data-testid=lab-opzione][data-valore='5']").click();
  await page.locator("#lab-bambini").selectOption("1");
  await page.locator("[data-testid=lab-opzione][data-valore='3']").click();
  await expect(page.getByTestId("lab-grafico")).toHaveAttribute("data-punti", "3");
  await expect(page.getByTestId("lab-grafico").locator("polyline")).toHaveCount(6);
  await page.locator("#lab-bambini").selectOption("0");
  await expect(page.locator("[data-testid=lab-opzione][data-valore='4']")).toHaveAttribute("aria-checked", "true");
});

test("stile aggressivo abbassa la ragionevolezza prevista dalle lenti", async ({ page }) => {
  await page.locator("[data-testid=lab-opzione][data-valore='3']").click();
  const somma = async () => (await page.getByTestId("lente").evaluateAll(els => els.map(e => +e.closest(".opzione-col").querySelector("[data-valore]").dataset.valore))).reduce((a, b) => a + b, 0);
  const gentile = await somma();
  await page.locator("#lab-stile").selectOption("aggressivo");
  await page.locator("[data-testid=lab-opzione][data-valore='3']").click();
  expect(await somma()).toBeLessThan(gentile);
});
