import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fc from "fast-check";
import { caricaMotore, tuttiGliScript } from "./carica-motore.mjs";

const M = caricaMotore();
const seed = fc.integer({ min: 1, max: 2 ** 31 - 1 });

test("gli script inline compilano", () => {
  for (const s of tuttiGliScript()) new vm.Script(s);
});

test("il motore gira senza DOM", () => {
  assert.ok(M.generaSituazione(1));
});

test("7 livelli e 11 luoghi come da spec", () => {
  assert.equal(M.LIVELLI.length, 7);
  assert.equal(M.LUOGHI.length, 11);
});

test("mulberry32 restituisce valori in [0, 1)", () => {
  fc.assert(fc.property(seed, s => {
    const rnd = M.mulberry32(s);
    for (let i = 0; i < 50; i++) {
      const v = rnd();
      if (!(v >= 0 && v < 1)) return false;
    }
    return true;
  }));
});

test("stesso seed, stessa situazione", () => {
  fc.assert(fc.property(seed, s => {
    assert.deepEqual(M.generaSituazione(s), M.generaSituazione(s));
  }));
});

test("la situazione usa un luogo valido", () => {
  fc.assert(fc.property(seed, s => M.LUOGHI.includes(M.generaSituazione(s).luogo)));
});

test("tutti i luoghi escono su 2000 seed", () => {
  const visti = new Set();
  for (let s = 1; s <= 2000; s++) visti.add(M.generaSituazione(s).luogo);
  assert.equal(visti.size, M.LUOGHI.length);
});
