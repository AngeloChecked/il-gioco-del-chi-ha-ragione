import { test } from "node:test";
import assert from "node:assert/strict";
import { caricaAsset } from "./carica-motore.mjs";

const { Motore: M, Asset: A } = caricaAsset();

function svgValido(svg, ctx) {
  assert.doesNotMatch(svg, /undefined|NaN|\[object/, ctx);
  const aperti = [];
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z]+)[^>]*?(\/?)>/g)) {
    if (m[3]) continue;
    if (m[1]) assert.equal(aperti.pop(), m[2], `${ctx}: tag </${m[2]}> non bilanciato`);
    else aperti.push(m[2]);
  }
  assert.deepEqual(aperti, [], `${ctx}: tag non chiusi`);
}

test("ogni personaggio in ogni espressione e posa produce SVG valido", () => {
  for (const p of M.PERSONAGGI) for (const espressione of A.ESPRESSIONI) for (const posa of A.POSE) for (const dir of [1, -1]) {
    svgValido(A.avatarSVG(p, { espressione, posa, dir }), `${p.id} ${espressione} ${posa}`);
  }
});

test("distintivi e tagli dei personaggi sono tra quelli disegnabili", () => {
  for (const p of M.PERSONAGGI) {
    assert.ok(A.DISTINTIVI.includes(p.avatar.distintivo), p.id);
    assert.ok(A.TAGLI.includes(p.avatar.taglio), p.id);
  }
  assert.equal(new Set(M.PERSONAGGI.map(p => p.avatar.distintivo)).size, M.PERSONAGGI.length, "distintivi non unici");
});

test("ogni luogo ha un fondale e ogni scena generata è valida", () => {
  for (const l of M.LUOGHI) assert.ok(A.FONDALE[l.id], l.id);
  for (let s = 1; s <= 400; s++) {
    const sit = M.generaSituazione(s);
    for (const passo of M.simulaPercorso(sit)) svgValido(A.scena(sit, passo, M.PERSONAGGI.at(-1)), `seed ${s} livello ${passo.livello}`);
  }
});

test("la scena espone personaggi con aria-label e il luogo", () => {
  const sit = M.generaSituazione(482913);
  const svg = A.scena(sit, M.simulaPercorso(sit)[0], M.PERSONAGGI.at(-1));
  assert.match(svg, new RegExp(`data-luogo="${sit.luogo.id}"`));
  const n = [...svg.matchAll(/data-testid="personaggio"[^>]*aria-label="[^"]+"/g)].length;
  assert.equal(n, 2 + sit.amici.length);
});

test("descrizione testuale dell'avatar per gli screen reader", () => {
  assert.equal(A.descrizioneAvatar({ nome: "Sara" }, "infastidito", "seduto"), "Sara, espressione infastidita, seduta");
});

test("i testi vengono sempre escapati", () => {
  assert.equal(A.esc(`<b>"x"&'y'</b>`), "&lt;b&gt;&quot;x&quot;&amp;&#39;y&#39;&lt;/b&gt;");
  assert.doesNotMatch(A.avatarSVG({ nome: `<script>`, avatar: {} }), /<script>/);
});
