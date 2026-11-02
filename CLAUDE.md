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
| `npm test` | Test unitari del motore (`node:test` + fast-check), ~100 ms |
| `npm run e2e` | E2E Playwright su Firefox, Chromium, WebKit mobile + axe WCAG AA |
| `npx playwright test --project=firefox` | E2E solo Firefox, più veloce |
| `npm run verifica` | Unitari + e2e: lanciare prima di dichiarare finito un task |
| `npm run serve` | Server locale su `http://127.0.0.1:8765/` |
| `npm run e2e:report` | Report HTML dell'ultimo run e2e |
| `npm run browsers` | Reinstalla i browser di Playwright (runner + MCP) |

Skill `/test-gioco`: controllo visivo via Playwright MCP (Firefox), dopo `npm run verifica`.

## Architettura

- **Un solo `index.html`**, CSS e JS inline, nessuna build, nessuna dipendenza runtime. Le dipendenze npm sono solo per i test.
- `<script id="motore">`: logica pura, definisce `globalThis.Motore`. Vietato usare `document`, `window`, `localStorage`, `Math.random`: tutta la casualità passa da `mulberry32(seed)`. I test unitari lo caricano con `node:vm` (`tests/unit/carica-motore.mjs`).
- `<script id="app">`: DOM, eventi, stato, storage, router hash. Espone `window.__CHR__`.
- Ogni elemento interattivo o verificabile ha il suo `data-testid` (elenco in `tests/TEST-API.md`).

## Regole di lavoro

- Nuova logica nel motore → test unitario in `tests/unit/`. Nuova interazione → test in `tests/e2e/`. Bug trovato → prima il test che lo riproduce, poi la correzione.
- `tests/e2e/accettazione.spec.mjs` esegue `tests/suite.js` (AC1-AC10) e si salta da solo finché `__CHR__` non è completo. Quando smette di saltarsi deve passare.
- Colori solo tramite token CSS di `STYLE.md` §3. Testo bianco solo su `--blu-pulsante` o `--rosso`, mai su `--blu` in tema scuro.
- Testi: mai bestemmie esplicite (solo `[bestemmia]` reso come adesivo di censura), nessuna violenza fisica, nessuna battuta su fede o identità (`STYLE.md` §2.4). Le domande di voto non scherzano mai.
- Screenshot, trace e report vanno in `tests/output/` (ignorata da git).
- Playwright: il runner usa `@playwright/test` stabile, l'MCP usa la sua versione alpha con un Firefox separato. Se un `playwright install` cancella il Firefox dell'MCP, `npm run browsers` li rimette entrambi.
