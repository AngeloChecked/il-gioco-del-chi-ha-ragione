import { test, describe } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fc from "fast-check";
import { caricaMotore, tuttiGliScript } from "./carica-motore.mjs";
import { BESTEMMIE, VIOLENZA } from "./contenuti.mjs";

const M = caricaMotore();
const plain = x => JSON.parse(JSON.stringify(x));
const eq = (a, b, msg) => assert.deepEqual(plain(a), plain(b), msg);
const seed = fc.integer({ min: 1, max: 2 ** 31 - 1 });
const SEED_SCAN = 3000;
const tuttiIPercorsi = Array.from({ length: SEED_SCAN }, (_, i) => {
  const sit = M.generaSituazione(i + 1);
  return { sit, passi: M.simulaPercorso(sit) };
});

describe("struttura", () => {
  test("gli script inline compilano", () => {
    for (const s of tuttiGliScript()) new vm.Script(s);
  });

  test("il motore gira senza DOM", () => {
    assert.ok(M.generaSituazione(1));
  });

  test("dati come da spec: 7 livelli, 11 luoghi, 13 condotte, 5+7 personaggi", () => {
    assert.equal(M.LIVELLI.length, 7);
    assert.equal(M.LUOGHI.length, 11);
    assert.equal(M.CONDOTTE.length, 13);
    assert.equal(M.PERSONAGGI.filter(p => p.principale).length, 5);
    assert.equal(M.PERSONAGGI.length, 12);
    eq(M.PERSONAGGI.filter(p => p.principale).map(p => p.id), ["marco", "luca", "gigi", "sara", "ettore"]);
  });

  test("tutti i tratti sono tra 0 e 1", () => {
    for (const p of M.PERSONAGGI) {
      eq(Object.keys(p.tratti), M.TRATTI, p.id);
      for (const v of Object.values(p.tratti)) assert.ok(v >= 0 && v <= 1, `${p.id}: ${v}`);
    }
  });

  test("le condotte di identità sono solo lingua madre e coppia per mano", () => {
    eq(M.CONDOTTE.filter(c => c.identita).map(c => c.id), ["lingua_madre", "mano"]);
  });

  test("ogni azione dei template ha almeno 3 varianti", () => {
    const corti = [];
    const visita = (v, path) => {
      if (Array.isArray(v)) {
        const ammessiCorti = /motivo|reazione_amici/.test(path);
        if (v.length < 3 && !ammessiCorti) corti.push(`${path} (${v.length})`);
      } else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) visita(x, `${path}.${k}`);
    };
    visita(M.TEMPLATE, "TEMPLATE");
    for (const l of M.LUOGHI) if (l.intro.length < 3) corti.push(`intro ${l.id}`);
    eq(corti, []);
  });
});

describe("RNG e determinismo", () => {
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

  test("stesso seed, stessa situazione e stesso percorso", () => {
    fc.assert(fc.property(seed, s => {
      eq(M.generaSituazione(s), M.generaSituazione(s));
      eq(M.simulaPercorso(s), M.simulaPercorso(s));
    }), { numRuns: 300 });
  });

  test("seed diversi danno situazioni varie", () => {
    const distinte = new Set(tuttiIPercorsi.slice(0, 100).map(x => JSON.stringify([x.sit.luogo.id, x.sit.condotta.id, x.sit.autore.id, x.sit.osservatore.id])));
    assert.ok(distinte.size > 80, `solo ${distinte.size} combinazioni su 100`);
  });

  test("tutti i luoghi e le condotte escono", () => {
    assert.equal(new Set(tuttiIPercorsi.map(x => x.sit.luogo.id)).size, M.LUOGHI.length);
    assert.equal(new Set(tuttiIPercorsi.map(x => x.sit.condotta.id)).size, M.CONDOTTE.length);
  });
});

describe("esaspera e formule", () => {
  test("esaspera 1 lascia i tratti invariati", () => {
    for (const p of M.PERSONAGGI) eq(M.esaspera(p).tratti, p.tratti);
  });

  test("esaspera resta in [0,1] e allontana i tratti da 0,5", () => {
    fc.assert(fc.property(fc.double({ min: 0, max: 1, noNaN: true }), fc.double({ min: 0.5, max: 1.5, noNaN: true }), (v, m) => {
      const p = { tratti: Object.fromEntries(M.TRATTI.map(k => [k, v])), esasperazione: m };
      const out = M.esaspera(p).tratti.cortesia;
      assert.ok(out >= 0 && out <= 1);
      if (m > 1) assert.ok(Math.abs(out - 0.5) >= Math.abs(v - 0.5) - 1e-3);
      if (m < 1) assert.ok(Math.abs(out - 0.5) <= Math.abs(v - 0.5) + 1e-3);
    }));
  });

  test("sensibilità rilevante: religiosa per bestemmie e critica, generica per il resto", () => {
    const luca = M.PERSONAGGI.find(p => p.id === "luca");
    const c = id => M.CONDOTTE.find(x => x.id === id);
    assert.equal(M.sensibilitaRilevante(luca, c("bestemmia_singola")), 0.85);
    assert.equal(M.sensibilitaRilevante(luca, c("critica_religione")), 0.85);
    assert.equal(M.sensibilitaRilevante(luca, c("fumare")), 0.5);
  });

  test("tutte le probabilità sono in [0,1]", () => {
    fc.assert(fc.property(seed, fc.boolean(), (s, sg) => {
      const P = M.probabilita(M.generaSituazione(s), { sgarbato: sg });
      for (const [k, v] of Object.entries(P)) assert.ok(v >= 0 && v <= 1, `${k}=${v}`);
      assert.ok(Math.abs(P.chiede + P.allontana + P.sopporta - 1) < 0.01);
    }), { numRuns: 500 });
  });

  test("il fastidio cresce col volume", () => {
    for (let v = 0; v < 3; v++) {
      const a = M.fastidio(M.costruisciSituazione({ volume: v }));
      const b = M.fastidio(M.costruisciSituazione({ volume: v + 1 }));
      assert.ok(b >= a, `volume ${v}: ${a} > ${b}`);
    }
  });

  test("il fastidio cresce se non ci si può allontanare (cinema vs parco)", () => {
    assert.ok(M.fastidio(M.costruisciSituazione({ luogo: "cinema" })) > M.fastidio(M.costruisciSituazione({ luogo: "parco" })));
  });

  test("bonus stile: gentile ≥ neutro ≥ secco ≥ aggressivo", () => {
    const pa = stile => M.probabilita(M.costruisciSituazione({ stile, autore: "marco" })).accetta;
    assert.ok(pa("gentile") >= pa("neutro") && pa("neutro") >= pa("secco") && pa("secco") >= pa("aggressivo"));
  });

  test("bambini vicini aumentano P(accettare)", () => {
    const pa = bambini => M.probabilita(M.costruisciSituazione({ bambini, autore: "marco" })).accetta;
    assert.ok(pa(2) > pa(0));
  });

  test("chiamare un terzo è possibile solo nei luoghi regolati", () => {
    for (const l of M.LUOGHI) {
      const P = M.probabilita(M.costruisciSituazione({ luogo: l.id }));
      if (!l.regolato) assert.equal(P.chiama_terzo, 0, l.id);
    }
  });
});

describe("generazione", () => {
  test("vincoli dei personaggi", () => {
    for (const { sit } of tuttiIPercorsi) {
      const ids = [sit.autore.id, sit.osservatore.id, ...sit.amici.map(a => a.id)];
      assert.equal(new Set(ids).size, ids.length, `seed ${sit.seed}: personaggi duplicati`);
      assert.ok(!ids.includes("gestore"), `seed ${sit.seed}: gestore in scena`);
      if (ids.includes("giulia")) assert.ok(sit.modulatori.bambini > 0, `seed ${sit.seed}: Giulia senza bambini`);
      if (sit.autore.id === "dario") assert.equal(sit.modulatori.intento, "provocazione");
      if (sit.condotta.id === "bestemmia_singola") assert.equal(sit.modulatori.frequenza, 0);
      if (sit.condotta.id === "bestemmie_ripetute") assert.ok(sit.modulatori.frequenza > 0);
      assert.equal(sit.terzo, sit.luogo.regolato ? sit.luogo.terzo : null);
    }
  });

  test("richiesta su identità marcata per lingua madre e coppia per mano", () => {
    for (const { sit } of tuttiIPercorsi) {
      assert.equal(sit.identita, !!sit.condotta.identita);
      assert.equal(sit.richiesta.oggetto, sit.condotta.identita ? "identita" : "condotta");
    }
  });

  test("costruisciSituazione rispetta i parametri", () => {
    const sit = M.costruisciSituazione({ luogo: "cinema", condotta: "fumare", autore: "dario", osservatore: "vale", bambini: 2, stile: "aggressivo", seed: 7 });
    assert.equal(sit.luogo.id, "cinema");
    assert.equal(sit.condotta.id, "fumare");
    assert.equal(sit.autore.id, "dario");
    assert.equal(sit.osservatore.id, "vale");
    assert.equal(sit.modulatori.bambini, 2);
    assert.equal(sit.richiesta.stile, "aggressivo");
    assert.equal(sit.terzo, "la maschera");
  });

  test("costruisciSituazione non mette lo stesso personaggio due volte", () => {
    const sit = M.costruisciSituazione({ autore: "sara", osservatore: "sara", amici: ["sara", "gigi"] });
    const ids = [sit.autore.id, sit.osservatore.id, ...sit.amici.map(a => a.id)];
    assert.equal(new Set(ids).size, ids.length);
  });

  test("i personaggi personalizzati entrano nel pool", () => {
    const nuovo = { id: "zoe", nome: "Zoe", tratti: Object.fromEntries(M.TRATTI.map(k => [k, 1])), esasperazione: 1, avatar: {} };
    const pool = [...M.PERSONAGGI, nuovo];
    const visti = new Set();
    for (let s = 1; s <= 500; s++) {
      const sit = M.generaSituazione(s, { personaggi: pool });
      visti.add(sit.autore.id).add(sit.osservatore.id);
    }
    assert.ok(visti.has("zoe"));
  });
});

describe("escalation", () => {
  test("livelli consecutivi da 0, solo l'ultimo passo chiude", () => {
    for (const { sit, passi } of tuttiIPercorsi) {
      assert.ok(passi.length >= 2 && passi.length <= 7, `seed ${sit.seed}: ${passi.length} passi`);
      passi.forEach((p, i) => assert.equal(p.livello, i));
      assert.ok(passi.at(-1).fine, `seed ${sit.seed}: ultimo passo non chiude`);
      assert.ok(passi.slice(0, -1).every(p => !p.fine), `seed ${sit.seed}: chiusura in mezzo`);
    }
  });

  test("ogni passo ha almeno un testo", () => {
    for (const { passi } of tuttiIPercorsi) for (const p of passi) assert.ok(p.testi.length >= 1 && p.testi.length <= 3, `${p.livello}:${p.esito}`);
  });

  test("tutte le lunghezze ed esiti sono raggiungibili", () => {
    const lunghezze = new Set(tuttiIPercorsi.map(x => x.passi.length));
    for (const n of [2, 4, 5, 6, 7]) assert.ok(lunghezze.has(n), `lunghezza ${n} mai vista`);
    const esiti = new Set(tuttiIPercorsi.flatMap(x => x.passi.map(p => p.esito)));
    for (const e of Object.keys(M.ESITI)) assert.ok(esiti.has(e), `esito ${e} mai visto`);
  });

  test("abbastanza partite arrivano alla richiesta", () => {
    const conRichiesta = tuttiIPercorsi.filter(x => x.passi.length >= 3).length / SEED_SCAN;
    assert.ok(conRichiesta > 0.35 && conRichiesta < 0.8, `quota con richiesta: ${conRichiesta}`);
  });

  test("chi cede chiude in verde, chi chiude al livello 6 no", () => {
    for (const { passi } of tuttiIPercorsi) {
      const u = passi.at(-1);
      if (["accetta", "accetta_a_meta", "accetta_no", "si_allontana", "cede_autore", "cede_osservatore", "battuta"].includes(u.esito)) assert.ok(u.cede, u.esito);
      if (u.livello === 6) assert.ok(!u.cede);
    }
  });

  test("terzo che interviene solo in luoghi regolati", () => {
    for (const { sit, passi } of tuttiIPercorsi) {
      if (passi.some(p => ["chiama_terzo", "interviene_terzo"].includes(p.esito))) assert.ok(sit.luogo.regolato, `seed ${sit.seed} in ${sit.luogo.id}`);
    }
  });

  test("forza impone gli esiti", () => {
    const sit = M.costruisciSituazione({ luogo: "treno" });
    const passi = M.simulaPercorso(sit, { forza: { 1: "chiede", 3: "rifiuta_sgarbato", 4: "chiama_terzo" } });
    eq(passi.map(p => p.esito), ["scena", "chiede", "richiesta", "rifiuta_sgarbato", "chiama_terzo", "attesa_terzo", "interviene_terzo"]);
    assert.ok(passi[6].terzo);
  });

  test("le espressioni sono tra le 6 previste e le pose tra le 4", () => {
    const E = new Set(["calmo", "perplesso", "infastidito", "arrabbiato", "imbarazzato", "sollevato"]);
    const P = new Set(["in piedi", "seduto", "voltato", "allontana"]);
    for (const { passi } of tuttiIPercorsi) for (const p of passi) {
      for (const e of Object.values(p.espressioni)) assert.ok(E.has(e), e);
      for (const x of Object.values(p.pose)) assert.ok(P.has(x), x);
    }
  });

  test("chi parla nei fumetti è in scena", () => {
    for (const { sit, passi } of tuttiIPercorsi) {
      const ids = new Set([sit.autore.id, sit.osservatore.id, ...sit.amici.map(a => a.id), "narratore", "terzo", "folla"]);
      for (const p of passi) for (const t of p.testi) assert.ok(ids.has(t.chi), `${t.chi} non in scena (seed ${sit.seed})`);
    }
  });
});

describe("testi", () => {
  const tutti = () => tuttiIPercorsi.flatMap(({ sit }) => M.testiPercorso(sit));

  test("nessun segnaposto non risolto", () => {
    for (const { passi } of tuttiIPercorsi) for (const p of passi) for (const t of p.testi) assert.doesNotMatch(t.testo, /\{\w+\}/, t.testo);
  });

  test("nessuna bestemmia esplicita e nessuna violenza fisica", () => {
    const piatti = [...tutti(), ...JSON.stringify(M.TEMPLATE).split('","'), ...JSON.stringify(M.VOCI).split('","')];
    for (const s of piatti) {
      for (const re of BESTEMMIE) assert.doesNotMatch(s, re, s);
      assert.doesNotMatch(s, VIOLENZA, s);
    }
  });

  test("le bestemmie passano solo come segnaposto censurato con intensità 1-3", () => {
    for (const { passi } of tuttiIPercorsi) for (const p of passi) for (const t of p.testi) {
      for (const seg of M.segmenti(t.testo)) if (seg.tipo === "censura") assert.ok([1, 2, 3].includes(seg.intensita));
      assert.doesNotMatch(t.testo, /\[bestemmia\]/, "segnaposto senza intensità");
    }
  });

  test("testoPiano sostituisce i segnaposto con testo alternativo", () => {
    assert.equal(M.testoPiano("Ahia! [bestemmia:2], che male."), "Ahia! [bestemmia censurata], che male.");
    assert.equal(M.testoPiano("Che [parolaccia]!"), "Che [parolaccia censurata]!");
  });

  test("le richieste iniziano con la maiuscola", () => {
    for (const { passi } of tuttiIPercorsi) {
      const r = passi[2]?.testi[0]?.testo;
      if (r) assert.match(r, /^[A-ZÈÉ(]/, r);
    }
  });
});

describe("voto e lenti", () => {
  const tipi = Object.fromEntries(Object.values(M.DOMANDE).flat().map(d => [d.id, d]));

  test("domande per livello come da spec §5", () => {
    const ids = Object.fromEntries(Object.entries(M.DOMANDE).map(([k, v]) => [k, v.map(d => d.id)]));
    eq(ids, {
      0: ["appropriata"], 1: ["fastidio_comprensibile"],
      2: ["richiesta_lecita", "richiesta_ragionevole", "condotta_o_identita"],
      3: ["risposta_lecita", "cortese_accontentare"],
      4: ["piu_ragionevole"], 5: ["responsabilita"], 6: ["chi_ha_ragione"],
    });
  });

  test("le domande compilate hanno nomi e opzioni", () => {
    const sit = M.costruisciSituazione({});
    const d = M.domande(4, sit)[0];
    eq(d.opzioni.map(o => o.valore), ["A", "B", "entrambi", "nessuno"]);
    assert.match(d.opzioni[0].etichetta, /Teo/);
    assert.match(M.domande(1, sit)[0].testo, /Luca/);
  });

  test("ogni voto previsto è un valore ammesso dalla domanda", () => {
    fc.assert(fc.property(seed, s => {
      const sit = M.generaSituazione(s);
      const passi = M.simulaPercorso(sit);
      for (const p of passi) for (const d of M.domande(p.livello, sit)) {
        for (const l of M.lenti(sit, passi, p.livello, d.id)) {
          assert.ok(d.opzioni.some(o => o.valore === l.valore), `${d.id}: ${l.id} → ${l.valore}`);
        }
      }
    }), { numRuns: 300 });
  });

  test("Luca trova più ragionevole di Ettore chiedere di non bestemmiare", () => {
    const sit = M.costruisciSituazione({});
    const v = id => M.votoPrevisto(M.PERSONAGGI.find(p => p.id === id), sit, "richiesta_ragionevole", []);
    assert.ok(v("luca") > v("ettore"), `luca ${v("luca")} ettore ${v("ettore")}`);
  });

  test("il contesto sposta la ragionevolezza: bambini vicini, volume, silenzio", () => {
    const v = (id, params) => M.votoPrevisto(M.PERSONAGGI.find(p => p.id === id), M.costruisciSituazione(params), "richiesta_ragionevole", []);
    assert.ok(v("ettore", { bambini: 2 }) > v("ettore", { bambini: 0 }), "Ettore e i bambini");
    assert.ok(v("marco", { volume: 3, frequenza: 2 }) >= v("marco", { volume: 0 }), "volume");
    assert.ok(v("marco", { luogo: "biblioteca" }) >= v("marco", { luogo: "piazza" }), "silenzio atteso");
  });

  test("Sara trova lecito rifiutare, Luca no, se la richiesta è sulla bestemmia", () => {
    const sit = M.costruisciSituazione({});
    const passi = M.simulaPercorso(sit, { forza: { 1: "chiede", 3: "rifiuta_gentile" } });
    const v = id => M.votoPrevisto(M.PERSONAGGI.find(p => p.id === id), sit, "risposta_lecita", passi);
    assert.equal(v("sara"), "si");
    assert.equal(v("luca"), "no");
  });

  test("Marco vede la responsabilità condivisa nello scontro di base", () => {
    const sit = M.costruisciSituazione({ luogo: "treno" });
    const passi = M.simulaPercorso(sit, { forza: { 1: "chiede", 3: "rifiuta_gentile", 4: "insiste", 5: "insulti" } });
    assert.equal(M.votoPrevisto(M.PERSONAGGI[0], sit, "responsabilita", passi), "condivisa");
  });

  test("le richieste su un'identità sono giudicate meno ragionevoli", () => {
    for (const p of M.principali()) {
      const cond = M.votoPrevisto(p, M.costruisciSituazione({ condotta: "telefonata" }), "richiesta_ragionevole", []);
      const ident = M.votoPrevisto(p, M.costruisciSituazione({ condotta: "lingua_madre" }), "richiesta_ragionevole", []);
      assert.ok(ident <= cond, `${p.id}: identità ${ident} > condotta ${cond}`);
      assert.equal(M.votoPrevisto(p, M.costruisciSituazione({ condotta: "lingua_madre" }), "richiesta_lecita", []), "no", p.id);
    }
  });

  test("esasperare cambia il voto in modo coerente", () => {
    const luca = M.PERSONAGGI.find(p => p.id === "luca");
    const sit = M.costruisciSituazione({});
    const base = M.votoPrevisto(luca, sit, "fastidio_comprensibile", []);
    const forte = M.votoPrevisto({ ...luca, esasperazione: 1.5 }, sit, "fastidio_comprensibile", []);
    assert.ok(forte >= base);
  });

  test("somiglianza: chi vota come un personaggio gli somiglia (distanza 0)", () => {
    const sit = M.generaSituazione(482913);
    const passi = M.simulaPercorso(sit);
    for (const target of M.principali()) {
      const voti = passi.flatMap(p => M.domande(p.livello, sit).map(d => ({ livello: p.livello, domanda: d.id, valore: M.votoPrevisto(target, sit, d.id, passi) })));
      const s = M.somiglianza(voti, sit, passi);
      assert.equal(s[0].distanza, 0);
      assert.ok(s.filter(x => x.distanza === 0).some(x => x.id === target.id));
    }
  });

  test("distanza: scala normalizzata, categorie 0/1", () => {
    assert.equal(M.distanza("richiesta_ragionevole", 1, 5), 1);
    assert.equal(M.distanza("richiesta_ragionevole", 3, 4), 0.25);
    assert.equal(M.distanza("richiesta_lecita", "si", "no"), 1);
    assert.equal(tipi.richiesta_lecita.tipo, "sino");
  });

  test("etichetta del caso", () => {
    const sit = M.costruisciSituazione({});
    const passi = M.simulaPercorso(sit, { forza: { 1: "chiede", 3: "rifiuta_gentile", 4: "accetta_no" } });
    const et = M.etichettaCaso([
      { domanda: "richiesta_lecita", valore: "si" },
      { domanda: "richiesta_ragionevole", valore: 1 },
      { domanda: "risposta_lecita", valore: "si" },
    ], sit, passi);
    assert.match(et, /richiesta lecita/);
    assert.match(et, /rifiuto lecito/);
    assert.match(et, /ragionevolezza divisa|poco ragionevole/);

    const id = M.costruisciSituazione({ condotta: "mano" });
    assert.match(M.etichettaCaso([], id, M.simulaPercorso(id, { forza: { 1: "chiede" } })), /identità/);
    assert.match(M.etichettaCaso([], sit, M.simulaPercorso(sit, { forza: { 1: "sopporta" } })), /nessuna richiesta/);
  });
});
