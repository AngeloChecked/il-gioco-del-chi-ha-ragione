---
name: test-gioco
description: Testa "Chi ha ragione?" nel browser tramite MCP (claude-in-chrome oppure Playwright con Firefox). Avvia server locale, inietta tests/suite.js, verifica criteri di accettazione AC1-AC10, fa screenshot desktop e mobile, riporta esito. Usare dopo ogni modifica a index.html o quando l'utente chiede di testare il gioco.
---

# Test del gioco con browser MCP

Prerequisiti: `index.html` che rispetta `tests/TEST-API.md` e uno di questi MCP:
- **Chrome**: estensione Claude in Chrome connessa (`/chrome`), strumenti `mcp__claude-in-chrome__*`.
- **Firefox**: Playwright MCP, strumenti `mcp__playwright__*`. Già configurato nel progetto: `@playwright/mcp` in `node_modules`, server in `.mcp.json` lanciato con Node 22 (`.nvmrc`), Firefox Playwright in `~/Library/Caches/ms-playwright`. Screenshot e log in `tests/output/`.
  Se manca il browser: `PATH=~/.nvm/versions/node/v22.23.0/bin:$PATH node node_modules/playwright-core/cli.js install firefox`.

Mappa strumenti: aprire URL → `navigate` / `browser_navigate`; eseguire JS → `javascript_tool` / `browser_evaluate` (passare il contenuto di `suite.js` come funzione `async () => { ... }`); screenshot → `computer` screenshot / `browser_take_screenshot`; viewport → `resize_window` / `browser_resize`; console → `read_console_messages` / `browser_console_messages`.

Se nessun MCP browser è disponibile, fermarsi e dire all'utente di aprire la pagina e incollare `tests/suite.js` nella console DevTools (funziona uguale in Chrome e Firefox).

## Procedura

1. **Server.** Avviare in background `bash tests/serve.sh 8765`. Se la porta è occupata usare 8766.
2. **Tab.** Ottenere il contesto tab, aprire un tab nuovo su `http://localhost:8765/index.html#gioco`.
3. **Smoke.** Leggere i messaggi di console: errori JS al caricamento = test fallito, riportare e fermarsi.
4. **Suite desktop.** Ridimensionare a 1280x800. Leggere `tests/suite.js` ed eseguirlo con lo strumento JavaScript del tab. Il risultato è un JSON con `passati`, `falliti`, `erroriJS`, `risultati`.
   - Per rieseguire solo alcuni test: prima eseguire `window.__CHR_TEST_OPTS__ = { only: ["AC2","AC5"] }`.
5. **Persistenza (AC8, parte reload).** Nell'editor `#personaggi` cambiare un tratto, ricaricare la pagina, verificare via JS che il valore sia ancora presente in `localStorage[__CHR__.storageKey]` e nel cursore. Poi `__CHR__.resetStorage()`.
6. **Seed condiviso (AC6, parte reload).** Aprire `#s-482913`, annotare luogo e personaggi, ricaricare, verificare che coincidano.
7. **Screenshot desktop.** Con `__CHR__.nuova(482913)`: screenshot al livello 0, al livello 3 (votando e premendo "Cosa succede dopo") e della schermata finale. Controllare a occhio, rispetto a `STYLE.md`:
   - semaforo verticale con luci accese coerenti col livello;
   - fumetti con coda verso il personaggio giusto, testo leggibile;
   - adesivo di censura al posto di `[bestemmia]`;
   - espressioni che cambiano tra livelli.
8. **Mobile.** Ridimensionare a 375x812, ricaricare, rieseguire la suite con `{ only: ["AC1","AC2","layout","a11y"] }`. Screenshot: semaforo orizzontale sopra la scena, nessuno scroll orizzontale.
9. **Tema scuro.** Eseguire `document.documentElement.dataset.theme = "dark"`, screenshot, controllare contrasto testo e fumetti.
10. **Pulizia.** Fermare il server, chiudere il tab.

## Report

Rispondere con:
- tabella `id · esito · errore` dalla suite (desktop e mobile);
- esiti dei passi 5, 6, 9;
- problemi visivi trovati negli screenshot, con livello e viewport;
- errori di console.

Non dichiarare "tutto ok" se un passo è stato saltato: dirlo esplicitamente.
