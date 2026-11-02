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
- [x] Pannello voto per livello, campo "perché" 140, conferma.
- [x] Lenti dei 5 principali dopo il voto.
- [x] "E poi?" fino alla schermata finale.
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

## Fetta 4 — Editor personaggi (AC 8)

- [ ] Elenco, modifica testi, 8 cursori, esaspera, avatar, anteprima.
- [ ] Duplica, nuovo, elimina, ripristina; persistenza.
- [ ] I personaggi modificati entrano nelle partite e nelle lenti.
- [ ] E2E con reload.

## Fetta 5 — Laboratorio (AC 7)

- [ ] Caso base fisso, una sola variabile modificabile, scena aggiornata.
- [ ] Voto di ragionevolezza per valore, grafico tuo voto vs lenti.
- [ ] E2E.

## Fetta 6 — Costruisci il caso

- [ ] Form personaggi, luogo, condotta, modulatori, richiesta; anteprima; avvio partita.
- [ ] "E se invece…?" dalla schermata finale precompila il form.
- [ ] E2E.

## Fetta 7 — Indovina la lente

- [ ] Scena + personaggio, previsione, rivelazione, punteggio persistente.
- [ ] E2E.

## Fetta 8 — Rifinitura

- [ ] Accessibilità: tastiera, aria-live, reduced motion, contrasto in entrambi i temi (axe su tutte le viste).
- [ ] Mobile 375px su tutte le viste.
- [ ] Storage assente/corrotto.
- [ ] Rilettura testi e tono (STYLE §2).
- [ ] Documentazione aggiornata (TEST-API, CLAUDE.md, STYLE).

## Backlog (spec §13, fuori scope)

- [ ] Media dei voti della community (serve backend).
- [ ] Modalità live, statistiche per variabile, profilo personale, condotte proposte.
