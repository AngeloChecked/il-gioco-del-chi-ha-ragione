import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const html = readFileSync(fileURLToPath(new URL("../../index.html", import.meta.url)), "utf8");

export function scriptInline(id) {
  const m = html.match(new RegExp(`<script id="${id}">([\\s\\S]*?)</script>`));
  if (!m) throw new Error(`<script id="${id}"> non trovato in index.html`);
  return m[1];
}

export function tuttiGliScript() {
  return [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
}

export function caricaMotore() {
  const ctx = vm.createContext({});
  vm.runInContext(scriptInline("motore"), ctx, { filename: "index.html#motore" });
  if (!ctx.Motore) throw new Error("lo script #motore non definisce globalThis.Motore");
  return ctx.Motore;
}

export function caricaAsset() {
  const ctx = vm.createContext({});
  vm.runInContext(scriptInline("motore"), ctx, { filename: "index.html#motore" });
  vm.runInContext(scriptInline("asset"), ctx, { filename: "index.html#asset" });
  return { Motore: ctx.Motore, Asset: ctx.Asset };
}
