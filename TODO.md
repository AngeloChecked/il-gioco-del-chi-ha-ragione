# Chi ha ragione? — TODO di sviluppo

Riferimenti: `chi-ha-ragione-spec.md` (specifica) · `STYLE.md` (stile visivo e tono).
Output finale: **un solo file** `index.html` con CSS e JS inline, nessuna build (spec §10).

Legenda: `[ ]` da fare · **(AC n)** = criterio di accettazione n della spec §12.

---

## Fase 0 — Setup

- [x] Creare `index.html` con skeleton: `<head>`, `<style>`, `<main>`, script.
- [x] Stack: **JS vanilla**, zero dipendenze runtime.
- [x] Font Google: Bricolage Grotesque + Atkinson Hyperlegible.
- [x] Design token CSS su `:root`, tema scuro con `prefers-color-scheme` + override `[data-theme]`.
- [x] Script diviso in `<script id="motore">` (puro, testabile in Node) e `<script id="app">` (DOM). Vedi `tests/TEST-API.md` §0.
- [x] Test: unitari `node:test` + fast-check, e2e `@playwright/test` (Firefox, Chromium, WebKit mobile), axe WCAG AA, suite accettazione.
- [x] `CLAUDE.md` con comandi e regole di lavoro.
- [ ] Hook pre-commit che lancia `npm test` (da attivare a mano, vedi `CLAUDE.md`).

## Fase 1 — Dati (spec §2, §3, §7, §8.4)

- [ ] `PERSONAGGI`: 5 principali (Marco, Luca, Gigi, Sara, Ettore) con tratti, descrizione, lente, avatar, voci.
- [ ] `PERSONAGGI`: 7 aggiuntivi (Nonna Rosa, Karim, Giulia, Teo, Vale, Dario, Il gestore). Completare i tratti mancanti con valori plausibili.
- [ ] `LUOGHI`: 11 luoghi con `allontanarsi`, `durata`, `regolato`, `terzo`, `silenzio` mappati su 0–1.
- [ ] `CONDOTTE`: 13 condotte con `tipo`, `evitabile`, `danno_oggettivo`, `religiosa`, flag `identita`.
- [ ] `MODULATORI`: volume, frequenza, intento, destinatario, bambini, rapporto, religione presenti, pubblico, con pesi di estrazione.
- [ ] `RICHIESTE`: stile, forma, motivazione, oggetto, richiesta concreta.
- [ ] `TEMPLATE`: narrazione, richiesta, risposta, dopo-rifiuto, scontro, chiusura. **Almeno 3 varianti per azione**, generiche + per condotta.
- [ ] `VOCI`: override per personaggio (spec §7.3), almeno 3 battute per azione per i 5 principali.
- [ ] Verifica testi: nessuna bestemmia esplicita, solo `[bestemmia]` / `porc*` con intensità 1–3 **(AC 10)**.

## Fase 2 — Motore (spec §4, §10)

- [ ] RNG `mulberry32(seed)` + helper `pick`, `weightedPick`, `chance(p)`.
- [ ] Funzione `esaspera(personaggio)`: moltiplicatore 0,5–1,5 sui tratti distintivi, clamp a 1.
- [ ] `sensibilitaRilevante(p, condotta)`: religiosa per bestemmie e critica religione, generica per il resto.
- [ ] `intensita(condotta, volume, frequenza)`.
- [ ] Formula `F` (fastidio) e probabilità: chiedere, allontanarsi, sopportare, accettare, insistere, chiamare terzo, con `bonus_stile`.
- [ ] `generaSituazione(seed)`: estrae luogo, autore, osservatore, amici, condotta, modulatori, richiesta. Coerenze: Giulia solo con bambini, gestore solo in luoghi regolati, Dario sempre intento "provocazione".
- [ ] `avanzaLivello(stato)`: livelli 0→6, esiti probabilistici, chiusura anticipata se qualcuno cede **(AC 5)**.
- [ ] Livello 5–6: max scontro verbale, intervento terzo o abbandono. **Nessuna violenza fisica** **(AC 10)**.
- [ ] Rendering testi: sostituzione segnaposto `{autore}`, `{osservatore}`, `{luogo}`, `{condotta}`, `{amici}`, `{bambini}`, `{terzo}`, `[bestemmia]`.
- [ ] Determinismo: stesso seed → stessa situazione e stesso percorso. Test con 20 seed ripetuti **(AC 6)**.
- [ ] Marcatura "richiesta che colpisce un'identità" per lingua madre e coppia per mano **(AC 9)**.

## Fase 3 — Asset SVG (spec §8, STYLE §5–7)

### Personaggi
- [ ] Generatore `avatarSVG({corpo, distintivo, colore, espressione, posa})` con forme semplici.
- [ ] 3 corporature (esile, media, robusta).
- [ ] Elementi distintivi: occhiali (Sara), maglione (Marco), giacca (Luca), cappello (Gigi), giubbotto (Ettore), foulard (Nonna Rosa), passeggino (Giulia), più kufi/barba curata (Karim), cuffie al collo (Teo), mascherina sul mento (Vale), occhiali da sole e sorrisetto (Dario), badge + cravatta (Gestore).
- [ ] 6 espressioni: calmo, perplesso, infastidito, arrabbiato, imbarazzato, sollevato (sopracciglia + bocca + accessori: goccia di sudore, vapore, stelline).
- [ ] 4 pose: in piedi, seduto, voltato, che si allontana (con linee di movimento).
- [ ] `aria-label` testuale per ogni avatar: "Sara, infastidita, seduta".
- [ ] Mini-avatar (32px) per le lenti.

### Scenari (11 fondali, 3–5 forme ciascuno, slot posizione predefiniti)
- [ ] Parco (panchina, albero, lampione, piccione).
- [ ] Piazza affollata (fontana, sagome folla, edificio).
- [ ] Fermata bus (pensilina, palina, cartello orari "in ritardo").
- [ ] Treno regionale (sedili, finestrino, portapacchi).
- [ ] Ristorante (tavoli, tovaglia a quadri, lampada).
- [ ] Bar (bancone, macchina caffè, sgabelli).
- [ ] Palestra (manubri, specchio, panca).
- [ ] Cinema (poltrone, schermo, luce di sicurezza).
- [ ] Biblioteca (scaffali, cartello "SILENZIO", lampada verde).
- [ ] Sagrato chiesa (scalinata, portone, campanile stilizzato).
- [ ] Live in streaming (finestra webcam, chat che scorre, bollino LIVE).
- [ ] Slot: `autore`, `osservatore`, `amici[0..2]`, `terzo`, `folla`.
- [ ] Varianti di contesto: bambini (sagome piccole), folla (sagome grigie sullo sfondo).

### Interfaccia
- [ ] Fumetti: parlato, urlato (bordo a spine), sussurro (tratteggio), pensiero (nuvola), didascalia narratore (cartello rettangolare giallo).
- [ ] Coda orientabile (sinistra/destra/alto) calcolata da posizione personaggio.
- [ ] Bollino censura per `[bestemmia]` con 3 intensità (STYLE §6.3).
- [ ] Icone variabili: volume, bambini, possibilità di allontanarsi, terzo presente, durata, pubblico.
- [ ] Semaforo escalation verticale 7 luci, con numero ed etichetta per luce.
- [ ] Timbro verdetto per schermata finale.

## Fase 4 — UI e layout (spec §9.1)

- [ ] Header: titolo + "Nuova situazione" + selettore modalità.
- [ ] Colonna semaforo a sinistra, scena al centro.
- [ ] Barra "variabili attive" con icone + etichette.
- [ ] Pannello voto sotto la scena.
- [ ] Pulsante "Cosa succede dopo" **(AC 2)**.
- [ ] Seed visibile e copiabile (`#s-482913`).
- [ ] Mobile (< 720px): semaforo orizzontale sopra la scena, variabili in riga di icone, gutter 16px, nessuno scroll orizzontale.
- [ ] Animazioni: comparsa fumetti (pop), luce semaforo che si accende, cambio espressione. Disattivate con `prefers-reduced-motion`.

## Fase 5 — Voto e lenti (spec §5)

- [ ] Schede di voto per livello 0–6 con domande della tabella §5 **(AC 3)**.
- [ ] Controlli: scala 1–5, sì/no, scelta multipla A/B/entrambi/nessuno/dipende.
- [ ] Campo "perché" facoltativo, max 140 caratteri, contatore.
- [ ] Funzioni `votoPrevisto(personaggio, livello, domanda)` per ogni domanda (estendere la formula §5.1).
- [ ] Lenti: mini-avatar sulla stessa scala del voto, con tooltip della lente **(AC 4)**.
- [ ] Blocco avanzamento finché non si vota (o pulsante "salta").

## Fase 6 — Schermata finale (spec §5.2)

- [ ] Riepilogo percorso livello per livello (mini-fumetti).
- [ ] Tabella voti tuoi vs lenti.
- [ ] Personaggio più simile: partita corrente + storico totale (distanza media).
- [ ] Etichetta del caso generata ("richiesta lecita, ragionevolezza divisa, rifiuto lecito").
- [ ] Avviso esplicito se la richiesta riguardava un'identità **(AC 9)**.
- [ ] Pulsanti: nuova situazione · rigioca stesso seed · cambia una variabile · condividi (copia link).

## Fase 7 — Modalità (spec §6)

- [ ] Router hash: `#gioco`, `#laboratorio`, `#indovina`, `#costruisci`, `#personaggi`, `#s-<seed>`.
- [ ] **Casuale**: flusso completo livello per livello.
- [ ] **Laboratorio**: caso base fisso (parco, voce normale, bestemmia singola, richiesta gentile). Pannello con una sola variabile modificabile alla volta. Grafico ragionevolezza vs valore variabile (SVG inline) **(AC 7)**.
- [ ] **Indovina la lente**: mostra scena + personaggio, utente prevede, poi rivela voto previsto e scarto.
- [ ] **Costruisci il caso**: selettori manuali per personaggi, luogo, condotta, richiesta, poi avvio motore.

## Fase 8 — Editor personaggi (spec §2.4)

- [ ] Pannello laterale: nome, descrizione, lente.
- [ ] Cursori per gli 8 tratti + cursore "esaspera".
- [ ] Anteprima avatar live, scelta corpo/distintivo/colore.
- [ ] Duplica · nuovo personaggio · ripristina predefiniti.
- [ ] Persistenza in `localStorage` **(AC 8)**.

## Fase 9 — Stato e storage (spec §10)

- [ ] Stato unico `{ seed, situazione, livello, storico, voti }`.
- [ ] Wrapper `storage.get/set` con try/catch, fallback in memoria se storage non disponibile.
- [ ] Salvare: personaggi modificati, storico voti, preferenza tema.
- [ ] (Facoltativo) media community via backend: fuori scope MVP, mostrare solo voti personali + lenti.

## Fase 10 — Accessibilità (spec §11)

- [ ] Navigazione completa da tastiera, focus visibile (anello giallo semaforo).
- [ ] Espressioni descritte a parole (`aria-label`, `aria-live` per i nuovi fumetti).
- [ ] Semaforo con numero + etichetta, non solo colore.
- [ ] `prefers-reduced-motion`.
- [ ] Verifica contrasto WCAG AA in tema chiaro e scuro.

## Fase 11 — QA e accettazione

- [ ] Checklist AC 1–10 della spec §12, una per una.
- [ ] Test determinismo seed (stessa sequenza su 3 reload).
- [ ] Scan testi: regex contro bestemmie esplicite e termini violenti.
- [ ] Test mobile 375px, tablet, desktop.
- [ ] Test con `localStorage` disabilitato (finestra privata).
- [ ] Rilettura tono: battute ironiche sì, bersagli reali no (STYLE §8).

## Backlog (spec §13)

- [ ] Modalità live con voto della chat.
- [ ] Statistiche per variabile.
- [ ] Profilo personale dopo molte partite.
- [ ] Condotte proposte dagli utenti con moderazione.

---

## Ordine consigliato (MVP prima)

1. Fase 0 → 1 → 2 (motore coperto da `npm test`).
2. Fase 3 minima: 1 corpo, 3 espressioni, 3 scenari (parco, treno, bar), fumetto base.
3. Fase 4 + 5 + 6: loop giocabile modalità casuale.
4. Completare asset, poi Fasi 7–8.
5. Fasi 9–11.
