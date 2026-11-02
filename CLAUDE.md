# Chi ha ragione?

Gioco web a file unico che genera liti da spazio pubblico, le fa salire di livello e chiede a chi gioca di votare su piani separati (lecito, ragionevole, dovuto, cortese).

## Documenti

- `chi-ha-ragione-spec.md`: specifica, fonte di verità. Citare le sezioni (§4.1, §12 AC n).
- `STYLE.md`: grafica, token, fumetti, tono di voce, linee rosse.
- `TODO.md`: piano a fasi. Spuntare i task quando finiti e verificati.
- `tests/TEST-API.md`: contratto `window.__CHR__` + `data-testid` che il gioco deve rispettare.

## Comandi (Node 22, vedi `.nvmrc`)

La shell di default ha Node 18, che Playwright non supporta. Prefissare con `PATH=~/.nvm/versions/node/v22.23.0/bin:$PATH` oppure `nvm use`.

| Comando | Cosa fa |
|---|---|
| `npm test` | Test unitari di motore e asset (`node:test` + fast-check), ~1 s |
| `npm run e2e` | E2E Playwright su Firefox, Chromium, WebKit mobile + axe WCAG AA |
| `npx playwright test --project=firefox` | E2E solo Firefox, più veloce |
| `npm run verifica` | Unitari + e2e: lanciare prima di dichiarare finito un task |
| `npm run serve` | Server locale su `http://127.0.0.1:8765/` |
| `npm run e2e:report` | Report HTML dell'ultimo run e2e |
| `npm run galleria` | Screenshot di revisione in `tests/output/galleria/` (`-- --solo=avatar\|luoghi\|livelli\|<vista>`) |
| `npm run browsers` | Reinstalla i browser di Playwright (runner + MCP) |

Skill `/test-gioco`: controllo visivo via Playwright MCP (Firefox), dopo `npm run verifica`.

## Architettura

- **Un solo `index.html`**, CSS e JS inline, nessuna build, nessuna dipendenza runtime. Le dipendenze npm sono solo per i test.
- `<script id="motore">`: logica pura, definisce `globalThis.Motore`. Vietato usare `document`, `window`, `localStorage`, `Math.random`: tutta la casualità passa da `mulberry32(seed)`. I test unitari lo caricano con `node:vm` (`tests/unit/carica-motore.mjs`).
- `<script id="asset">`: funzioni pure che producono SVG (avatar, fondali, scene, icone). Stesse regole del motore: niente DOM.
- `<script id="app">`: DOM, eventi (delegati su `document` via `data-azione`), stato, storage, router hash, viste `gioco`, `laboratorio`, `indovina`, `costruisci`, `personaggi`. Espone `window.__CHR__`.
- Partita di gruppo (hot seat): stato in `gruppo` dentro l'app; il motore non cambia. Il voto di gruppo (mediana/maggioranza) finisce in `stato.voti`, così etichetta e lenti funzionano come in singolo.
- Ogni elemento interattivo o verificabile ha il suo `data-testid` (elenco in `tests/TEST-API.md`).

## Regole di lavoro

- Nuova logica nel motore → test unitario in `tests/unit/`. Nuova interazione → test in `tests/e2e/`. Bug trovato → prima il test che lo riproduce, poi la correzione.
- `tests/e2e/accettazione.spec.mjs` esegue `tests/suite.js` (AC1-AC10): deve passare sempre, `IN_SVILUPPO` deve restare vuoto.
- Storage (`chi-ha-ragione:v1`): `personaggi`, `tema`, `somiglianza` (totali per lente), `partite`, `storico` (ultime 50 partite con voti; `modo: "gruppo"` con voti per giocatore), `indovina`, `giocatori` (nomi dell'ultima giuria). Ogni accesso passa dal wrapper `storage` con try/catch.
- Colori solo tramite token CSS di `STYLE.md` §3. Testo bianco solo su `--blu-pulsante` o `--rosso`, mai su `--blu` in tema scuro.
- Testi: mai bestemmie esplicite (solo `[bestemmia]` reso come adesivo di censura), nessuna violenza fisica, nessuna battuta su fede o identità (`STYLE.md` §2.4). Le domande di voto non scherzano mai.
- Screenshot, trace e report vanno in `tests/output/` (ignorata da git).
- Cambi grafici: `npm run galleria` e guardare gli screenshot prima di dichiarare finito.
- Le probabilità del motore seguono spec §4.1; `DRAMMATICITA` (motore) moltiplica P(chiedere) per tenere giocabili circa metà dei casi. Se si tocca, il test "abbastanza partite arrivano alla richiesta" lo controlla.
- Playwright: il runner usa `@playwright/test` stabile, l'MCP usa la sua versione alpha con un Firefox separato. Se un `playwright install` cancella il Firefox dell'MCP, `npm run browsers` li rimette entrambi.
