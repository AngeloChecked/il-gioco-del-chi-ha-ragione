# Contratto di test

Il gioco (`index.html`) deve esporre questo contratto, così la suite `tests/suite.js` può pilotarlo da Chrome MCP o dalla console.

## 0. Struttura di `index.html`

- `<script id="motore">`: logica pura (RNG, dati, generatore, formule, escalation, testi). Definisce `globalThis.Motore`. **Non tocca DOM, `window`, `localStorage`**: i test unitari lo eseguono in `node:vm` senza browser e falliscono se lo fa.
- `<script id="asset">`: funzioni pure che restituiscono SVG (avatar, fondali, scena, icone). Definisce `globalThis.Asset`. Testato in `node:vm` (`tests/unit/asset.test.mjs`).
- `<script id="app">`: rendering, eventi, stato, storage, router. Usa `Motore` e `Asset` ed espone `window.__CHR__`. `__CHR__._interno` serve solo ai test e agli strumenti, non fa parte del contratto.

Test:
- `tests/unit/*.test.mjs` → `npm test`, `Motore` e `Asset`.
- `tests/e2e/*.spec.mjs` → `npm run e2e`, pagina vera su Firefox, Chromium, WebKit mobile, più axe in tema chiaro e scuro.
- `tests/e2e/accettazione.spec.mjs` esegue `tests/suite.js` e si salta da solo finché `__CHR__` non è completo.

## 1. `window.__CHR__`

```ts
window.__CHR__ = {
  version: string;
  stato(): { seed: number; situazione: Situazione; livello: number; storico: Passo[]; voti: Voto[]; finito: boolean };
  nuova(seed?: number): void;
  avanti(): void;
  vota(risposte: Record<string, string | number>): void;
  generaSituazione(seed: number): Situazione;
  simulaPercorso(seed: number): Passo[];
  testiPercorso(seed: number): string[];
  lenti(livello: number, domanda: string): { id: string; valore: string | number }[];
  dati: { PERSONAGGI; LUOGHI; CONDOTTE; MODULATORI; RICHIESTE; TEMPLATE };
  storageKey: string;
  resetStorage(): void;
};
```

Requisiti:
- `generaSituazione` e `simulaPercorso` sono **pure**: non toccano DOM, stato o storage.
- `simulaPercorso(seed)` restituisce lo stesso percorso che si ottiene giocando con `nuova(seed)` + `avanti()` ripetuto, votando qualsiasi cosa (i voti non influenzano il motore).
- `testiPercorso(seed)` restituisce tutti i testi a schermo per quel seed (narrazione, fumetti, domande), con `[bestemmia]` già renderizzato come lo vedrebbe l'utente (testo alternativo incluso).

## 2. Selettori `data-testid`

| testid | Elemento |
|---|---|
| `btn-nuova` | Pulsante "Nuova situazione" |
| `btn-avanti` | Pulsante "Cosa succede dopo" |
| `seed` | Seed visibile (testo contiene il numero) |
| `scena` | Contenitore SVG della scena |
| `didascalia` | Didascalia del narratore (cartello giallo in alto nella scena) |
| `scena-luogo` | Fondale (attributo `data-luogo`) |
| `personaggio` | Ogni avatar in scena (attributi `data-id`, `data-ruolo`, `data-espressione`, `aria-label`) |
| `fumetto` | Ogni fumetto (attributo `data-tipo`) |
| `censura` | Adesivo `[bestemmia]` (attributo `data-intensita`) |
| `semaforo-luce` | Ogni luce (attributi `data-livello`, `data-accesa="true/false"`, `aria-label`) |
| `variabile` | Ogni chip variabile attiva (attributo `data-nome`) |
| `voto-pannello` | Pannello voto (attributo `data-livello`) |
| `voto-domanda` | Ogni domanda (attributo `data-id`, `data-tipo="scala/sino/scelta/oggetto"`) |
| `voto-opzione` | Ogni opzione cliccabile (attributo `data-valore`) |
| `voto-perche` | Campo "perché" (presente solo con `CHIEDI_PERCHE = true` nell'app; disattivato di default) |
| `btn-vota` | Conferma voto |
| `lente` | Mini-avatar lente (attributi `data-id`, `data-valore`) |
| `finale` | Schermata finale |
| `finale-etichetta` | Etichetta del caso |
| `finale-identita` | Avviso richiesta identità (presente solo se serve) |
| `finale-somiglianza` | Personaggio più simile |
| `lab-variabile` | Controllo variabile in laboratorio (attributo `data-nome`, `data-attiva`) |
| `lab-grafico` | Grafico laboratorio |
| `editor-personaggio` | Scheda personaggio nell'editor (attributo `data-id`) |
| `editor-tratto` | Cursore tratto (attributo `data-tratto`) |
| `editor-esaspera` | Cursore esaspera |
| `editor-duplica` · `editor-nuovo` · `editor-ripristina` | Pulsanti editor |
| `intro` · `btn-intro-nuova` | Schermata iniziale senza partita |
| `livello-nome` | Titolo del livello corrente sopra la scena |
| `voto-confermato` | Frase "la pensi come…" dopo il voto |
| `finale-confronto` | Tabella tuoi voti vs lenti |
| `btn-finale-nuova` · `btn-rigioca` · `btn-cambia-variabile` · `btn-condividi` | Pulsanti della schermata finale |
| `annunci` | Regione `aria-live` con i fumetti del passo |
| `toast` | Messaggi brevi (link copiato, ecc.) |
| `btn-tema` | Cambio tema auto/chiaro/scuro |
| `nav-gioco` · `nav-laboratorio` · `nav-indovina` · `nav-costruisci` · `nav-personaggi` | Navigazione |
| `lab-scena` · `lab-voto` · `lab-opzione` · `btn-lab-reset` | Laboratorio |
| `costruisci-campo` · `costruisci-anteprima` · `costruisci-probabilita` · `costruisci-esiti` · `costruisci-errore` · `btn-costruisci-avvia` · `btn-costruisci-reset` | Costruisci il caso |
| `indovina-scena` · `indovina-personaggio` · `indovina-opzione` · `indovina-esito` · `indovina-punteggio` · `btn-indovina-nuovo` | Indovina la lente |
| `btn-multi` | Attiva/disattiva la partita di gruppo (`aria-pressed`) |
| `multi-setup` · `multi-nome` · `multi-errore` · `btn-multi-aggiungi` · `btn-multi-rimuovi` · `btn-multi-inizia` · `btn-multi-annulla` | Setup della partita di gruppo |
| `multi-banner` | Elenco della giuria sopra la scena |
| `turno-schermo` · `turno-nome` · `btn-turno-pronto` | Schermata di passaggio tra un giocatore e l'altro |
| `voto-giocatore` | Voto di un giocatore nella rivelazione (attributi `data-nome`, `data-valore`) |
| `finale-gruppo` · `finale-giocatore` · `finale-unanimi` | Verdetto della giuria |
| `editor` · `editor-elenco` · `editor-nome` · `editor-lente` · `editor-anteprima` · `editor-esempio` · `editor-elimina` | Editor personaggi |

## 3. Domande attese per livello (spec §5)

| Livello | Numero domande | id |
|---|---|---|
| 0 | 1 | `appropriata` |
| 1 | 1 | `fastidio_comprensibile` |
| 2 | 3 | `richiesta_lecita`, `richiesta_ragionevole`, `condotta_o_identita` |
| 3 | 2 | `risposta_lecita`, `cortese_accontentare` |
| 4 | 1 | `piu_ragionevole` |
| 5 | 1 | `responsabilita` |
| 6 | 1 | `chi_ha_ragione` |
