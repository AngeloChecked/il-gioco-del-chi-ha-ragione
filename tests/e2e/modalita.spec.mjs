import { test, expect, chr } from "./fixtures.mjs";

test.describe("costruisci il caso", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/index.html#costruisci");
  });

  test("anteprima, probabilità ed esiti simulati si aggiornano", async ({ page }) => {
    await expect(page.getByTestId("costruisci-campo")).toHaveCount(16);
    await expect(page.getByTestId("costruisci-anteprima").getByTestId("scena-luogo")).toHaveAttribute("data-luogo", "parco");
    const esitiPrima = await page.getByTestId("costruisci-esiti").textContent();
    await page.locator("#co-luogo").selectOption("treno");
    await page.locator("#co-condotta").selectOption("fumare");
    await expect(page.getByTestId("costruisci-anteprima").getByTestId("scena-luogo")).toHaveAttribute("data-luogo", "treno");
    await expect(page.getByTestId("costruisci-esiti")).not.toHaveText(esitiPrima);
  });

  test("A e B devono essere diversi", async ({ page }) => {
    await page.locator("#co-osservatore").selectOption("teo");
    await expect(page.getByTestId("costruisci-errore")).toBeVisible();
    await expect(page.getByTestId("btn-costruisci-avvia")).toBeDisabled();
  });

  test("fa partire una partita con gli ingredienti scelti", async ({ page }) => {
    await page.locator("#co-autore").selectOption("dario");
    await page.locator("#co-osservatore").selectOption("rosa");
    await page.locator("#co-luogo").selectOption("sagrato");
    await page.getByTestId("btn-costruisci-avvia").click();
    await expect(page).toHaveURL(/#gioco$/);
    await expect(page.getByTestId("seed")).toContainText("costruito");
    await expect(page.locator("[data-testid=personaggio][data-ruolo=autore]")).toHaveAttribute("data-id", "dario");
    await expect(page.locator("[data-testid=personaggio][data-ruolo=osservatore]")).toHaveAttribute("data-id", "rosa");
    await expect(page.getByTestId("scena-luogo")).toHaveAttribute("data-luogo", "sagrato");
    await chr(page, () => { while (!__CHR__.stato().finito) __CHR__.avanti(); });
    await expect(page.getByTestId("btn-condividi")).toHaveCount(0);
    await page.getByTestId("btn-rigioca").click();
    await expect(page.locator("[data-testid=personaggio][data-ruolo=autore]")).toHaveAttribute("data-id", "dario");
  });

  test("E se invece…? dal finale precompila il form", async ({ page }) => {
    await page.goto("/index.html#s-482913");
    const sit = await chr(page, () => __CHR__.stato().situazione);
    await chr(page, () => { while (!__CHR__.stato().finito) __CHR__.avanti(); });
    await page.getByTestId("btn-cambia-variabile").click();
    await expect(page).toHaveURL(/#costruisci$/);
    await expect(page.locator("#co-luogo")).toHaveValue(sit.luogo.id);
    await expect(page.locator("#co-condotta")).toHaveValue(sit.condotta.id);
    await expect(page.locator("#co-autore")).toHaveValue(sit.autore.id);
  });
});

test.describe("indovina la lente", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/index.html#indovina");
    await chr(page, () => __CHR__.resetStorage());
  });

  test("risposta giusta: 2 punti e serie", async ({ page }) => {
    const giusto = await chr(page, () => {
      const I = __CHR__._interno;
      I.nuovoCasoIndovina(123);
      I.render();
      const { sit, passi, pgId, domanda } = I.ind.caso;
      return String(Motore.votoPrevisto(I.pgPerId(pgId), sit, domanda, passi));
    });
    await expect(page.getByTestId("indovina-personaggio")).toBeVisible();
    await page.locator(`[data-testid=indovina-opzione][data-valore="${giusto}"]`).click();
    await expect(page.getByTestId("indovina-esito")).toHaveAttribute("data-punti", "2");
    await expect(page.getByTestId("indovina-punteggio")).toContainText("Punti: 2 · tentativi: 1 · serie: 1");
    await expect(page.getByTestId("indovina-opzione").first()).toBeDisabled();
    await page.getByTestId("btn-indovina-nuovo").click();
    await expect(page.getByTestId("indovina-esito")).toHaveCount(0);
    await page.reload();
    await expect(page.getByTestId("indovina-punteggio")).toContainText("Punti: 2");
  });

  test("risposta sbagliata azzera la serie", async ({ page }) => {
    const sbagliato = await chr(page, () => {
      const I = __CHR__._interno;
      for (let s = 1; s < 500; s++) {
        I.nuovoCasoIndovina(s);
        const { sit, passi, pgId, domanda, livello } = I.ind.caso;
        const d = Motore.domande(livello, sit).find(x => x.id === domanda);
        const g = Motore.votoPrevisto(I.pgPerId(pgId), sit, domanda, passi);
        const lontano = d.opzioni.find(o => (d.tipo === "scala" ? Math.abs(o.valore - g) >= 2 : o.valore !== g));
        if (lontano) { I.render(); return String(lontano.valore); }
      }
    });
    await page.locator(`[data-testid=indovina-opzione][data-valore="${sbagliato}"]`).click();
    await expect(page.getByTestId("indovina-esito")).toHaveAttribute("data-punti", "0");
    await expect(page.getByTestId("indovina-punteggio")).toContainText("serie: 0");
  });
});
