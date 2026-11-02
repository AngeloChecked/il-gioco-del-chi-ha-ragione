# Contratto di test

Il gioco (`index.html`) deve esporre questo contratto, così la suite `tests/suite.js` può pilotarlo da Chrome MCP o dalla console.

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
| `scena-luogo` | Fondale (attributo `data-luogo`) |
| `personaggio` | Ogni avatar in scena (attributi `data-id`, `data-ruolo`, `data-espressione`, `aria-label`) |
| `fumetto` | Ogni fumetto (attributo `data-tipo`) |
| `censura` | Adesivo `[bestemmia]` (attributo `data-intensita`) |
| `semaforo-luce` | Ogni luce (attributi `data-livello`, `data-accesa="true/false"`, `aria-label`) |
| `variabile` | Ogni chip variabile attiva (attributo `data-nome`) |
| `voto-pannello` | Pannello voto (attributo `data-livello`) |
| `voto-domanda` | Ogni domanda (attributo `data-id`, `data-tipo="scala/sino/scelta/oggetto"`) |
| `voto-opzione` | Ogni opzione cliccabile (attributo `data-valore`) |
| `voto-perche` | Campo "perché" |
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
