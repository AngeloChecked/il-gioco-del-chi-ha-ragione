(async () => {
  const opts = Object.assign({ seeds: 300, scanSeeds: 1500, only: null }, window.__CHR_TEST_OPTS__ || {});
  const $ = (id, root = document) => root.querySelector(`[data-testid="${id}"]`);
  const $$ = (id, root = document) => [...root.querySelectorAll(`[data-testid="${id}"]`)];
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const waitFor = async (fn, ms = 2000) => {
    const t0 = performance.now();
    while (performance.now() - t0 < ms) {
      const v = fn();
      if (v) return v;
      await sleep(30);
    }
    throw new Error("timeout in attesa di condizione: " + fn.toString().slice(0, 80));
  };
  const click = async el => { el.click(); await sleep(60); };
  const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  const DOMANDE = {
    0: ["appropriata"],
    1: ["fastidio_comprensibile"],
    2: ["richiesta_lecita", "richiesta_ragionevole", "condotta_o_identita"],
    3: ["risposta_lecita", "cortese_accontentare"],
    4: ["piu_ragionevole"],
    5: ["responsabilita"],
    6: ["chi_ha_ragione"],
  };
  const LENTI_PRINCIPALI = ["marco", "luca", "gigi", "sara", "ettore"];

  const BESTEMMIE = [
    /\b(porc[oa]|dio|madonna|cristo|ges[uù])\s*(dio|madonna|cane|porco|maiale|boia|bestia|ladro|serpente|infame)\b/i,
    /\bdi+o\s*(c+a+n+e|p+o+r+c+o|b+o+i+a)\b/i,
    /\bporcodio\b|\bdiocane\b|\bdioporco\b|\bmadonnaputtana\b/i,
  ];
  const VIOLENZA = /\b(pugn[oi]|schiaff\w*|picchi\w*|coltell\w*|sangue|accoltell\w*|prende a calci|calci in faccia|strangol\w*|ammazz\w*|uccid\w*|spar[aio]\w*|botte)\b/i;

  const api = () => window.__CHR__;
  const votaTutto = async () => {
    const pannello = $("voto-pannello");
    if (!pannello) return;
    for (const d of $$("voto-domanda", pannello)) {
      const opz = $$("voto-opzione", d);
      if (opz.length) await click(opz[Math.floor(opz.length / 2)]);
    }
    const btn = $("btn-vota");
    if (btn && !btn.disabled) await click(btn);
  };
  const trovaSeed = (pred, max = opts.scanSeeds) => {
    for (let s = 1; s <= max; s++) {
      const p = api().simulaPercorso(s);
      if (pred(p, api().generaSituazione(s), s)) return s;
    }
    return null;
  };

  const tests = [];
  const test = (id, nome, fn) => tests.push({ id, nome, fn });

  test("api", "window.__CHR__ esposto con il contratto", async () => {
    const a = api();
    assert(a, "window.__CHR__ mancante");
    for (const k of ["stato", "nuova", "avanti", "vota", "generaSituazione", "simulaPercorso", "testiPercorso", "lenti", "dati", "resetStorage"])
      assert(k in a, `__CHR__.${k} mancante`);
    assert(a.dati.LUOGHI.length >= 11, "servono 11 luoghi");
    assert(a.dati.CONDOTTE.length >= 13, "servono 13 condotte");
    assert(LENTI_PRINCIPALI.every(id => a.dati.PERSONAGGI.some(p => p.id === id)), "mancano personaggi principali");
  });

  test("AC1", "Nuova situazione genera scena completa", async () => {
    await click($("btn-nuova"));
    await waitFor(() => $("scena-luogo"));
    assert($("scena-luogo").dataset.luogo, "fondale senza data-luogo");
    const ruoli = $$("personaggio").map(p => p.dataset.ruolo);
    assert(ruoli.includes("autore"), "manca autore in scena");
    assert(ruoli.includes("osservatore"), "manca osservatore in scena");
    $$("personaggio").forEach(p => assert(p.getAttribute("aria-label"), `avatar ${p.dataset.id} senza aria-label`));
    const nomi = $$("variabile").map(v => v.dataset.nome);
    for (const n of ["luogo", "condotta", "volume", "bambini"]) assert(nomi.includes(n), `variabile ${n} non visibile`);
    assert(/\d+/.test($("seed").textContent), "seed non visibile");
  });

  test("AC2", "Cosa succede dopo avanza livello, fumetti e semaforo", async () => {
    let seed = trovaSeed(p => p.length >= 4);
    assert(seed, "nessun seed con almeno 4 livelli");
    api().nuova(seed);
    await sleep(100);
    for (let i = 0; i < 3; i++) {
      const prima = api().stato().livello;
      const testiPrima = $$("fumetto").map(f => f.textContent).join("|");
      await votaTutto();
      await click($("btn-avanti"));
      await waitFor(() => api().stato().livello === prima + 1);
      const accese = $$("semaforo-luce").filter(l => l.dataset.accesa === "true").length;
      assert(accese === prima + 2, `semaforo: attese ${prima + 2} luci accese, trovate ${accese}`);
      assert($$("fumetto").map(f => f.textContent).join("|") !== testiPrima, "fumetti non aggiornati");
    }
  });

  test("AC3", "Pannello voto con le domande previste per livello", async () => {
    const seed = trovaSeed(p => p.length === 7);
    assert(seed, "nessun seed che arriva al livello 6");
    api().nuova(seed);
    await sleep(100);
    for (let lv = 0; lv <= 6; lv++) {
      const pannello = await waitFor(() => $("voto-pannello"));
      assert(+pannello.dataset.livello === lv, `pannello livello ${pannello.dataset.livello}, atteso ${lv}`);
      const ids = $$("voto-domanda", pannello).map(d => d.dataset.id);
      assert(eq(ids, DOMANDE[lv]), `livello ${lv}: domande ${ids} attese ${DOMANDE[lv]}`);
      const perche = $("voto-perche", pannello);
      assert(perche && +perche.maxLength === 140, `livello ${lv}: campo perché assente o maxlength != 140`);
      await votaTutto();
      if (lv < 6) await click($("btn-avanti"));
    }
  });

  test("AC4", "Dopo il voto compaiono le lenti dei principali", async () => {
    api().nuova(trovaSeed(p => p.length >= 2));
    await sleep(100);
    assert($$("lente").length === 0, "lenti visibili prima del voto");
    await votaTutto();
    const ids = (await waitFor(() => $$("lente").length >= 5 && $$("lente"))).map(l => l.dataset.id);
    LENTI_PRINCIPALI.forEach(id => assert(ids.includes(id), `lente ${id} mancante`));
  });

  test("AC5", "Se qualcuno cede la scena si chiude con schermata finale", async () => {
    const seed = trovaSeed(p => p.length < 7 && /accett|cede|allontan/.test(p[p.length - 1].esito));
    assert(seed, "nessun seed con chiusura anticipata");
    const percorso = api().simulaPercorso(seed);
    api().nuova(seed);
    await sleep(100);
    for (let i = 0; i < percorso.length - 1; i++) { await votaTutto(); await click($("btn-avanti")); }
    await votaTutto();
    const btn = $("btn-avanti");
    if (btn && !$("finale")) await click(btn);
    await waitFor(() => $("finale"));
    assert(api().stato().finito, "stato.finito non true");
    assert($("finale-etichetta")?.textContent.trim(), "etichetta del caso vuota");
    assert($("finale-somiglianza"), "manca personaggio più simile");
  });

  test("AC6", "Stesso seed, stessa situazione e stesso percorso", async () => {
    for (let s = 1; s <= opts.seeds; s++) {
      assert(eq(api().generaSituazione(s), api().generaSituazione(s)), `seed ${s}: situazione diversa`);
      assert(eq(api().simulaPercorso(s), api().simulaPercorso(s)), `seed ${s}: percorso diverso`);
    }
    const seed = 482913;
    api().nuova(seed);
    await sleep(100);
    const uiA = { luogo: $("scena-luogo").dataset.luogo, pg: $$("personaggio").map(p => p.dataset.id) };
    api().nuova(seed + 1);
    await sleep(100);
    location.hash = `#s-${seed}`;
    await waitFor(() => api().stato().seed === seed);
    await sleep(100);
    const uiB = { luogo: $("scena-luogo").dataset.luogo, pg: $$("personaggio").map(p => p.dataset.id) };
    assert(eq(uiA, uiB), "hash #s-<seed> non riproduce la stessa scena");
    const diversi = new Set(Array.from({ length: 30 }, (_, i) => JSON.stringify(api().generaSituazione(i + 1)))).size;
    assert(diversi > 20, `poca varietà: ${diversi}/30 situazioni distinte`);
  });

  test("AC7", "Laboratorio: una sola variabile alla volta", async () => {
    location.hash = "#laboratorio";
    const ctrl = await waitFor(() => $$("lab-variabile").length && $$("lab-variabile"));
    const input = ctrl[0].querySelector("input, select, button");
    assert(input, "controllo laboratorio senza input");
    input.focus();
    if (input.tagName === "SELECT") input.selectedIndex = (input.selectedIndex + 1) % input.options.length;
    else if (input.type === "range") input.value = input.max;
    else input.click();
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await sleep(100);
    const attive = $$("lab-variabile").filter(v => v.dataset.attiva === "true");
    assert(attive.length <= 1, `${attive.length} variabili modificate insieme`);
    assert($("lab-grafico"), "grafico laboratorio assente");
    location.hash = "#gioco";
    await sleep(100);
  });

  test("AC8", "Editor: modifica, esaspera, duplica, nuovo, persistenza", async () => {
    api().resetStorage();
    location.hash = "#personaggi";
    const schede = await waitFor(() => $$("editor-personaggio").length && $$("editor-personaggio"));
    const n0 = schede.length;
    const cursore = $("editor-tratto");
    assert(cursore, "cursore tratto mancante");
    cursore.value = "0.33";
    cursore.dispatchEvent(new Event("input", { bubbles: true }));
    cursore.dispatchEvent(new Event("change", { bubbles: true }));
    assert($("editor-esaspera"), "cursore esaspera mancante");
    await click($("editor-duplica"));
    await click($("editor-nuovo"));
    await waitFor(() => $$("editor-personaggio").length === n0 + 2);
    const raw = localStorage.getItem(api().storageKey);
    assert(raw && raw.includes("0.33"), "modifica non salvata in localStorage");
    await click($("editor-ripristina"));
    location.hash = "#gioco";
    await sleep(100);
  });

  test("AC9", "Richiesta su identità segnalata nel finale", async () => {
    const seed = trovaSeed((p, s) => s.richiesta?.oggetto === "identita" && p.length >= 3);
    assert(seed, "nessun seed con richiesta su identità");
    const percorso = api().simulaPercorso(seed);
    api().nuova(seed);
    await sleep(100);
    for (let i = 0; i < percorso.length; i++) {
      await votaTutto();
      if ($("finale")) break;
      await click($("btn-avanti"));
    }
    await waitFor(() => $("finale"));
    assert($("finale-identita"), "avviso identità assente");
    const seedNo = trovaSeed((p, s) => s.richiesta?.oggetto === "condotta" && p.length >= 3);
    api().nuova(seedNo);
    await sleep(100);
    for (let i = 0; i < 7 && !$("finale"); i++) { await votaTutto(); await click($("btn-avanti")); }
    await waitFor(() => $("finale"));
    assert(!$("finale-identita"), "avviso identità mostrato su richiesta di condotta");
  });

  test("AC10", "Nessuna bestemmia esplicita, nessuna violenza fisica", async () => {
    const tutti = Object.values(api().dati.TEMPLATE).flatMap(function flat(v) {
      return typeof v === "string" ? [v] : Array.isArray(v) ? v.flatMap(flat) : Object.values(v).flatMap(flat);
    });
    for (let s = 1; s <= opts.scanSeeds; s++) tutti.push(...api().testiPercorso(s));
    tutti.push(document.body.innerText);
    for (const t of tutti) {
      for (const re of BESTEMMIE) assert(!re.test(t), `bestemmia esplicita: "${t.slice(0, 100)}"`);
      assert(!VIOLENZA.test(t), `violenza fisica: "${t.slice(0, 100)}"`);
    }
    $$("censura").forEach(c => assert(/^[123]$/.test(c.dataset.intensita), "censura senza intensità 1-3"));
  });

  test("a11y", "Semaforo con etichette, focus da tastiera", async () => {
    const luci = $$("semaforo-luce");
    assert(luci.length === 7, `semaforo: ${luci.length} luci invece di 7`);
    luci.forEach(l => assert(/\d/.test(l.getAttribute("aria-label") || l.textContent), `luce ${l.dataset.livello} senza numero/etichetta`));
    for (const id of ["btn-nuova", "btn-avanti"]) {
      const el = $(id);
      el.focus();
      assert(document.activeElement === el, `${id} non focusabile`);
      const cs = getComputedStyle(el);
      assert(cs.outlineStyle !== "none" || cs.boxShadow !== "none", `${id} senza focus visibile`);
    }
  });

  test("layout", "Nessuno scroll orizzontale", async () => {
    const w = document.documentElement.scrollWidth, vw = window.innerWidth;
    assert(w <= vw + 1, `scroll orizzontale: ${w}px > ${vw}px`);
  });

  test("storage", "Funziona senza localStorage", async () => {
    const orig = Object.getOwnPropertyDescriptor(window, "localStorage");
    try {
      Object.defineProperty(window, "localStorage", { configurable: true, get() { throw new Error("bloccato"); } });
      api().nuova(7);
      await sleep(100);
      assert($("scena-luogo"), "la scena non si genera senza storage");
    } finally {
      if (orig) Object.defineProperty(window, "localStorage", orig);
    }
  });

  const errori = [];
  const onErr = e => errori.push(String(e.message || e.reason || e));
  window.addEventListener("error", onErr);
  window.addEventListener("unhandledrejection", onErr);

  const results = [];
  for (const t of tests) {
    if (opts.only && !opts.only.includes(t.id)) continue;
    const t0 = performance.now();
    try {
      await t.fn();
      results.push({ id: t.id, nome: t.nome, ok: true, ms: Math.round(performance.now() - t0) });
    } catch (e) {
      results.push({ id: t.id, nome: t.nome, ok: false, errore: e.message, ms: Math.round(performance.now() - t0) });
    }
  }
  window.removeEventListener("error", onErr);
  window.removeEventListener("unhandledrejection", onErr);

  const report = {
    passati: results.filter(r => r.ok).length,
    falliti: results.filter(r => !r.ok).length,
    viewport: `${innerWidth}x${innerHeight}`,
    erroriJS: errori,
    risultati: results,
  };
  window.__CHR_TEST_REPORT__ = report;
  console.table(results.map(r => ({ id: r.id, ok: r.ok ? "✅" : "❌", errore: r.errore || "", ms: r.ms })));
  return JSON.stringify(report, null, 2);
})();
