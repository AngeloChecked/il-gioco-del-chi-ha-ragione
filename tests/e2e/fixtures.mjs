import { test as base, expect } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    const errori = [];
    page.on("pageerror", e => errori.push(e.message));
    page.on("console", m => m.type() === "error" && errori.push(m.text()));
    await use(page);
    expect(errori, "errori JS in pagina").toEqual([]);
  },
});

export { expect };

export const chr = (page, fn, arg) => page.evaluate(fn, arg);
