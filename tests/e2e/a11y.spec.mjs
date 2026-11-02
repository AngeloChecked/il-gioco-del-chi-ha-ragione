import AxeBuilder from "@axe-core/playwright";
import { test, expect, chr } from "./fixtures.mjs";

const VISTE = {
  intro: async page => page.goto("/index.html"),
  gioco: async page => page.goto("/index.html#s-482913"),
  "gioco con lenti": async page => {
    await page.goto("/index.html#s-482913");
    for (const d of await page.getByTestId("voto-domanda").all()) await d.getByTestId("voto-opzione").first().click();
    await page.getByTestId("btn-vota").click();
  },
  finale: async page => {
    await page.goto("/index.html#gioco");
    await chr(page, () => {
      for (let s = 1; s < 5000; s++) if (__CHR__.generaSituazione(s).identita && __CHR__.simulaPercorso(s).length >= 4) { __CHR__.nuova(s); break; }
      while (!__CHR__.stato().finito) { __CHR__.vota({ appropriata: 2, fastidio_comprensibile: 4, richiesta_lecita: "no", richiesta_ragionevole: 2, condotta_o_identita: "identita", risposta_lecita: "si", cortese_accontentare: 1, piu_ragionevole: "A", responsabilita: "B", chi_ha_ragione: "A", perche: "Perché sì" }); __CHR__.avanti(); }
    });
  },
  laboratorio: async page => {
    await page.goto("/index.html#laboratorio");
    await page.getByTestId("lab-opzione").nth(2).click();
    await page.locator("#lab-luogo").selectOption("cinema");
  },
  indovina: async page => {
    await page.goto("/index.html#indovina");
    await page.getByTestId("indovina-opzione").first().click();
  },
  costruisci: async page => page.goto("/index.html#costruisci"),
  personaggi: async page => page.goto("/index.html#personaggi"),
};

for (const tema of ["light", "dark"]) {
  for (const [nome, apri] of Object.entries(VISTE)) {
    test(`accessibilità WCAG AA: ${nome}, tema ${tema}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: tema, reducedMotion: "reduce" });
      await apri(page);
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(violations.map(v => `${v.id}: ${v.nodes.slice(0, 3).map(n => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
}

for (const [nome, apri] of Object.entries(VISTE)) {
  test(`nessuno scroll orizzontale: ${nome}`, async ({ page }) => {
    await apri(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
  });
}

test("ogni luce del semaforo ha numero ed etichetta, non solo colore", async ({ page }) => {
  await page.goto("/index.html#s-482913");
  for (const l of await page.getByTestId("semaforo-luce").all()) {
    await expect(l).toHaveAttribute("aria-label", /^Livello \d: \S/);
    await expect(l).toHaveText(/^\d$/);
  }
});

test("le espressioni dei personaggi sono descritte a parole", async ({ page }) => {
  await page.goto("/index.html#s-482913");
  for (const p of await page.getByTestId("personaggio").all()) await expect(p).toHaveAttribute("aria-label", /espressione \w+/);
});

test("i nuovi fumetti sono annunciati agli screen reader", async ({ page }) => {
  await page.goto("/index.html#s-482913");
  await expect(page.getByTestId("annunci")).toHaveText(/Livello 0/);
  await page.getByTestId("btn-avanti").click();
  await expect(page.getByTestId("annunci")).toHaveText(/Livello 1/);
});

test("prefers-reduced-motion disattiva le animazioni dei fumetti", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/index.html#s-482913");
  expect(await page.getByTestId("fumetto").first().evaluate(el => getComputedStyle(el).animationName)).toBe("none");
});

test("storage corrotto o assente: il gioco funziona con i predefiniti", async ({ page }) => {
  await page.goto("/index.html");
  await page.evaluate(k => localStorage.setItem(k, "{non è json"), await chr(page, () => __CHR__.storageKey));
  await page.reload();
  await page.getByTestId("btn-nuova").click();
  await expect(page.getByTestId("scena-luogo")).toBeVisible();
  await page.evaluate(k => localStorage.setItem(k, JSON.stringify({ personaggi: [{ id: "x" }], tema: 42 })), await chr(page, () => __CHR__.storageKey));
  await page.goto("/index.html#personaggi");
  await page.reload();
  await expect(page.getByTestId("editor-personaggio")).toHaveCount(12);
});
