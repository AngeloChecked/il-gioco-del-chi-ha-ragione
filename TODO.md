# Chi ha ragione? — TODO per fette verticali

Riferimenti: `chi-ha-ragione-spec.md` (specifica) · `STYLE.md` (stile) · `tests/TEST-API.md` (contratto di test) · `CLAUDE.md` (comandi).

Metodo: **fette verticali**. Ogni fetta attraversa motore → interfaccia → test e finisce giocabile e verde (`npm run verifica`) prima della successiva. Commit a ogni fetta.

Legenda: `[x]` fatto e verificato · `[ ]` da fare · **(AC n)** = criterio di accettazione spec §12.

---

## Fetta 0 — Setup ✅

- [x] `index.html` unico, JS vanilla, token CSS chiaro/scuro, font.
- [x] `<script id="motore">` puro (testato in `node:vm`) + `<script id="app">` (DOM).
- [x] Unitari `node:test` + fast-check, e2e Playwright su 3 browser, axe WCAG AA, suite di accettazione.
- [x] `CLAUDE.md`, Playwright MCP Firefox.
- [ ] Hook pre-commit (da attivare a mano, bloccato dai permessi).

## Fetta 1 — Motore completo ✅

- [x] Dati: 12 personaggi, 11 luoghi, 13 condotte, modulatori, richieste (spec §2, §3).
- [x] Formule §4.1 (F, chiedere, allontanarsi, accettare, insistere, terzo, bonus stile) + fattore `DRAMMATICITA` per bilanciare la giocabilità.
- [x] Esaspera, sensibilità rilevante, intensità.
- [x] Escalation livelli 0-6 con chiusura anticipata, esiti forzabili (`forza`), espressioni e pose per passo.
- [x] Testi: template ≥3 varianti, voci dei personaggi, segnaposto censurati `[bestemmia:n]`, `[parolaccia]`, `[insulto]`.
- [x] Domande per livello §5, voto previsto delle lenti, somiglianza, etichetta del caso.
- [x] 49 test unitari (determinismo, vincoli, probabilità, contenuti vietati, lenti coerenti con i personaggi).

## Fetta 2 — Partita casuale giocabile (AC 1-6, 9, 10) ✅

- [x] Scena SVG: fondale del luogo, personaggi negli slot, cartellini A/B, bambini, folla, terzo.
- [x] Avatar con espressioni e pose per livello.
- [x] Fumetti posizionati con coda (parlato, urlato, sussurro, pensiero, narratore, sistema) + adesivo di censura.
- [x] Semaforo colorato per livello, verde se qualcuno cede.
- [x] Barra variabili attive con icone.
- [x] Pannello voto per livello, conferma. Campo "perché" (140) disattivato con `CHIEDI_PERCHE = false`: rallentava il gioco.
- [x] Lenti dei 5 principali dopo il voto.
- [x] "E poi?" fino alla schermata finale, disattivato (`aria-disabled`) finché non si emette il voto.
- [x] Schermata finale: sentenza, etichetta, avviso identità, riepilogo, confronto voti, somiglianza partita + totale, pulsanti.
- [x] Router hash `#gioco`, `#s-<seed>`; condividi link; rigioca stesso seed.
- [x] `window.__CHR__` completo → la suite di accettazione smette di saltarsi.
- [x] E2E: partita completa, finale, rigioca, condividi, identità.

## Fetta 3 — Grafica completa (spec §8, STYLE §5-7) ✅

- [x] 11 fondali con dettaglio comico.
- [x] 12 distintivi, 3 corporature, 5 tagli, 6 espressioni, 4 pose.
- [x] Strumento galleria screenshot (`npm run galleria`) per la revisione visiva.
- [x] Revisione visiva desktop, mobile, tema scuro.
- [x] Test unitari degli asset: SVG valido per ogni personaggio × espressione × posa e per 400 scene.

## Fetta 4 — Editor personaggi (AC 8) ✅

- [x] Elenco, modifica testi, 8 cursori, esaspera, avatar, anteprima.
- [x] Duplica, nuovo, elimina, ripristina; persistenza.
- [x] I personaggi modificati entrano nelle partite e nelle lenti.
- [x] E2E con reload.

## Fetta 5 — Laboratorio (AC 7) ✅

- [x] Caso base fisso, una sola variabile modificabile, scena aggiornata.
- [x] Voto di ragionevolezza per valore, grafico tuo voto vs lenti.
- [x] E2E.
- [x] Voto previsto della ragionevolezza sensibile al contesto (bambini vicini, intensità, silenzio atteso), così le lenti si muovono nel grafico.
- [x] Suite di accettazione AC1-AC10 completamente verde, nessun test in sviluppo.

## Fetta 6 — Costruisci il caso ✅

- [x] Form personaggi, luogo, condotta, modulatori, richiesta; anteprima; avvio partita.
- [x] "E se invece…?" dalla schermata finale precompila il form.
- [x] E2E.
- [x] Probabilità del motore e distribuzione degli esiti su 200 simulazioni, per preparare casi da live.

## Fetta 7 — Indovina la lente ✅

- [x] Scena + personaggio, previsione, rivelazione, punteggio persistente.
- [x] E2E.

## Fetta 8 — Rifinitura ✅

- [x] Accessibilità: axe WCAG AA su 8 viste × 2 temi × 3 browser; tastiera (frecce nei gruppi di voto, focus dopo il voto), `aria-live` per i fumetti, espressioni descritte a parole, semaforo con numero ed etichetta, `prefers-reduced-motion`.
- [x] Contrasto: `--blu` scuro `#7FA6F2`, `--blu-pulsante` per i pulsanti, `--rosso-testo` per avvisi e timbro.
- [x] Mobile 375px su tutte le viste, nessuno scroll orizzontale (testato), fumetti sotto la scena nelle viste strette.
- [x] Storage assente, bloccato o corrotto: si gioca con i predefiniti (testato).
- [x] Storico delle ultime 50 partite con i voti in `localStorage`.
- [x] Rilettura testi: forme neutre dove il personaggio può essere di qualsiasi genere.
- [x] Documentazione aggiornata (TEST-API, CLAUDE.md, STYLE).
- [x] Galleria con viste mobile e tema scuro; verifica finale via Playwright MCP su Firefox.

## Stato finale

- 56 test unitari (motore + asset), 176 e2e su Firefox, Chromium, WebKit mobile, suite di accettazione AC1-AC10 verde.
- Criteri di accettazione spec §12: tutti soddisfatti.

## Backlog (spec §13, fuori scope)

- [ ] Media dei voti della community (serve backend).
- [ ] Modalità live, statistiche per variabile, profilo personale, condotte proposte.
