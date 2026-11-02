# Chi ha ragione? — Specifica del gioco

Single page application che genera situazioni casuali di convivenza in luogo pubblico (una condotta che dà fastidio, una richiesta, una risposta) e le fa evolvere per livelli di escalation. A ogni livello chi gioca vota. Alla fine confronta il proprio voto con quello che darebbero i personaggi archetipici e con la media degli altri voti.

L'obiettivo non è stabilire una verità, ma rendere visibile **quale variabile sposta il giudizio** e **su quale piano** si sta giudicando (lecito, ragionevole, dovuto, cortese).

---

## 1. Principi di design del gioco

1. **Separare i piani.** Ogni voto chiede una cosa sola. Non si chiede mai solo "chi ha ragione?", ma si distingue se la richiesta è lecita, se è ragionevole, se il rifiuto è lecito, se sarebbe stato cortese accontentare.
2. **Una variabile alla volta.** Oltre alla modalità casuale esiste una modalità laboratorio: si fissa un caso base e si cambia un solo parametro, per vedere come cambia il voto.
3. **Personaggi come lenti, non come bersagli.** I personaggi sono archetipi di posizione, non caricature di persone reali. Ogni personaggio ha tratti numerici e una "lente" che predice come voterebbe.
4. **Niente bestemmie esplicite a schermo.** Nel testo si usano segnaposto (`[bestemmia]`, `porc*`) con un livello di intensità. La discussione riguarda l'atto, non serve riprodurlo.
5. **L'escalation si ferma prima della violenza.** Il livello massimo è lo scontro verbale con intervento di un terzo o con l'abbandono della scena. Nessuna rappresentazione di violenza fisica.

---

## 2. Personaggi

I nomi sono inventati. Le posizioni sono ispirate a quelle emerse nella live, ma i personaggi sono archetipi modificabili. Tutti i tratti sono valori da 0 a 1 e possono essere esasperati con il cursore "esaspera" (moltiplicatore 0,5–1,5, con limite a 1).

### 2.1 Tratti

| Tratto | Significato |
|---|---|
| `sensibilita_religiosa` | Quanto una bestemmia lo ferisce |
| `sensibilita_generica` | Quanto lo infastidiscono rumore, fumo, volgarità |
| `propensione_a_chiedere` | Quanto facilmente passa dal fastidio alla richiesta |
| `cortesia` | Probabilità che usi modi gentili |
| `testardaggine` | Probabilità di non cedere a ogni livello |
| `fastidio_intromissioni` | Quanto lo irrita essere interrotto da estranei |
| `rispetto_contesto` | Quanto modera il proprio comportamento in base al luogo |
| `uso_bestemmia` | Frequenza e intensità con cui bestemmia |

### 2.2 Personaggi principali

**Marco, il diplomatico ateo**
Ateo, critico verso la religione e favorevole a uno Stato molto laico, ma preferisce non urtare la sensibilità altrui senza motivo. Distingue tra critica argomentata (per cui vale la pena litigare) e insulto gratuito (che si può evitare). Pensa che nel conflitto la responsabilità sia condivisa.
Tratti: sensibilità religiosa 0,1 · generica 0,7 · chiedere 0,5 · cortesia 0,8 · testardaggine 0,5 · fastidio intromissioni 0,3 · rispetto contesto 0,9 · uso bestemmia 0,05
Lente: "Se potevi evitarlo a costo zero, dovevi evitarlo".

**Luca, il credente aperto**
Evangelico, tollerante e disposto al dialogo, ma le bestemmie lo feriscono davvero. Non vuole leggi che le puniscano, preferisce la buona educazione.
Tratti: sensibilità religiosa 0,85 · generica 0,5 · chiedere 0,4 · cortesia 0,9 · testardaggine 0,3 · fastidio intromissioni 0,3 · rispetto contesto 0,85 · uso bestemmia 0
Lente: "Per chi crede è come insultare qualcuno di caro".

**Gigi, il mediatore**
Cresciuto in una famiglia molto cattolica, oggi indifferente alle bestemmie. Vede le ragioni di tutti, cerca il compromesso, sdrammatizza con le battute. Tende a cercare un terzo che faccia da arbitro.
Tratti: sensibilità religiosa 0,15 · generica 0,4 · chiedere 0,3 · cortesia 0,8 · testardaggine 0,2 · fastidio intromissioni 0,4 · rispetto contesto 0,7 · uso bestemmia 0,1
Lente: "Uno dei due deve abbozzare, decidiamo chi".

**Sara, la linguista**
Vede la bestemmia come fenomeno linguistico e sociale. Bestemmia abitualmente, ma si modera con chi sa che ne soffre. Non sopporta che estranei si intromettano in una conversazione privata: "non stavo parlando con te".
Tratti: sensibilità religiosa 0 · generica 0,5 · chiedere 0,35 · cortesia 0,6 · testardaggine 0,75 · fastidio intromissioni 0,95 · rispetto contesto 0,7 · uso bestemmia 0,7
Lente: "Il rispetto lo devo al mio interlocutore, non a chi ascolta per caso".

**Ettore, l'anticlericale radicale**
Ex credente, oggi fortemente contrario alla tutela speciale del sentimento religioso. Considera ogni richiesta di non bestemmiare una "pretesa mascherata da educazione". Si modera solo davanti ai bambini, come farebbe con qualsiasi volgarità.
Tratti: sensibilità religiosa 0 · generica 0,4 · chiedere 0,3 · cortesia 0,4 · testardaggine 0,9 · fastidio intromissioni 0,8 · rispetto contesto 0,4 · uso bestemmia 0,85
Lente: "Perché il sentimento religioso dovrebbe valere più di quello politico?".

### 2.3 Personaggi aggiuntivi

| Personaggio | Descrizione | Tratti chiave |
|---|---|---|
| **Nonna Rosa**, devota | Cattolica praticante, anziana, abituata a un linguaggio pulito | sens. religiosa 0,95, cortesia 0,9, chiedere 0,6 |
| **Karim**, musulmano praticante | Credente, riservato, molto sensibile alle offese verso la fede | sens. religiosa 0,95, cortesia 0,85, chiedere 0,3 |
| **Giulia**, madre con due bambini | Non religiosa, ma attenta a ciò che sentono i figli | sens. generica 0,8, chiedere 0,7 (se bambini presenti) |
| **Teo**, l'intercalare | Bestemmia per abitudine regionale, senza intento offensivo | uso bestemmia 0,9, testardaggine 0,3, cortesia 0,7 |
| **Vale**, l'ipersensibile | Infastidita da qualsiasi rumore o volgarità | sens. generica 0,95, chiedere 0,9, cortesia 0,5 |
| **Dario**, il provocatore | Bestemmia apposta per vedere chi reagisce | uso bestemmia 0,9, testardaggine 0,95, cortesia 0,1 |
| **Il gestore** | Terzo con autorità nei luoghi regolati | Entra solo come arbitro, applica le regole del locale |

### 2.4 Editor dei personaggi

Pannello laterale con:
- modifica di nome, descrizione e lente;
- cursori per ogni tratto;
- cursore "esaspera" che amplifica i tratti distintivi;
- pulsante "duplica" per creare varianti;
- pulsante "nuovo personaggio" da zero;
- ripristino ai valori predefiniti.

---

## 3. Dimensioni della situazione

Ogni situazione è una combinazione di variabili. Il generatore le estrae a caso con pesi plausibili.

### 3.1 Luogo

| Luogo | Possibilità di allontanarsi | Durata tipica | Regolato da un terzo | Silenzio atteso |
|---|---|---|---|---|
| Parco | Alta | Breve | No | Basso |
| Piazza affollata | Alta | Breve | No | Basso |
| Fermata dell'autobus | Media | Breve | No | Basso |
| Treno regionale | Bassa | Lunga | Capotreno | Medio |
| Ristorante | Bassa | Lunga | Gestore | Medio |
| Bar | Media | Media | Gestore | Basso |
| Palestra | Media | Media | Istruttore | Basso |
| Cinema | Nulla | Lunga | Maschera | Alto |
| Biblioteca | Media | Lunga | Personale | Alto |
| Sagrato della chiesa | Alta | Breve | No | Medio |
| Live in streaming | Totale (può uscire) | Variabile | Moderatori | Basso |

### 3.2 Condotta che dà fastidio

Include casi di controllo che non riguardano la bestemmia, per confrontare i giudizi.

| Condotta | Tipo | Evitabile dall'autore | Danno oggettivo |
|---|---|---|---|
| Bestemmia singola | Linguaggio | Sì | No |
| Bestemmie ripetute | Linguaggio | Sì | No |
| Turpiloquio senza bestemmie | Linguaggio | Sì | No |
| Parola offensiva verso un gruppo | Linguaggio | Sì | No (ma colpisce persone) |
| Critica alla religione | Opinione | Sì | No |
| Parlare di politica | Opinione | Sì | No |
| Fumare vicino | Comportamento | Sì | Sì |
| Musica o video senza cuffie | Comportamento | Sì | No |
| Telefonata a voce alta | Comportamento | Sì | No |
| Mangiare rumorosamente | Comportamento | In parte | No |
| Odore corporeo | Condizione | Dipende | No |
| Parlare la propria lingua madre | Identità | No (non deve) | No |
| Coppia che si tiene per mano | Identità | No (non deve) | No |

Le ultime due righe servono come **casi di identità**: la richiesta di smettere viene marcata nel sistema come "richiesta che colpisce ciò che una persona è", e il gioco lo segnala nella schermata finale.

### 3.3 Modulatori

| Variabile | Valori |
|---|---|
| Volume | Basso · normale · alto · urlato |
| Frequenza | Una volta · alcune volte · continua |
| Intento | Intercalare · sfogo · battuta · provocazione voluta · offesa mirata |
| Destinatario | Rivolto agli amici · rivolto a nessuno · rivolto a chi ascolta |
| Bambini presenti | No · sì, lontani · sì, vicini |
| Rapporto tra le parti | Sconosciuti · conoscenti di vista · colleghi · amici |
| Religione dei presenti | Nota · ipotizzata · ignota |
| Pubblico intorno | Nessuno · poche persone · folla |

### 3.4 La richiesta

| Variabile | Valori |
|---|---|
| Stile | Gentile · neutro · secco · aggressivo |
| Forma | Domanda ("potresti...?") · affermazione ("non si fa") · ordine ("smettila") |
| Motivazione dichiarata | Nessuna · fastidio personale · fede · bambini · regole del luogo |
| Oggetto | Una condotta · un'identità |
| Richiesta concreta | Smettere · abbassare la voce · spostarsi · cambiare argomento |

---

## 4. Il percorso dell'escalation

Ogni situazione avanza per livelli. A ogni livello il motore decide in modo probabilistico se la scena continua o si chiude, sulla base dei tratti dei personaggi e del contesto.

| Livello | Nome | Chi agisce | Esiti possibili |
|---|---|---|---|
| 0 | La scena | Autore della condotta | Descrizione della situazione |
| 1 | Il fastidio | Chi ascolta | Sopporta in silenzio · si allontana · decide di chiedere |
| 2 | La richiesta | Chi ascolta | Richiesta con lo stile estratto |
| 3 | La risposta | Autore | Accetta · accetta a metà (abbassa la voce) · rifiuta gentilmente · rifiuta sgarbatamente |
| 4 | Dopo il rifiuto | Chi ha chiesto | Accetta il no · si allontana · insiste · chiama un terzo (se il luogo è regolato) |
| 5 | Lo scontro | Entrambi | Uno dei due cede · battuta che stempera · insulti reciproci |
| 6 | La chiusura | Terzo o scena | Interviene il gestore · qualcuno se ne va · gli altri presenti intervengono |

Se a un livello qualcuno cede, la scena va direttamente alla schermata finale.

### 4.1 Probabilità di base

Tutte le formule restituiscono un valore tra 0 e 1, poi limitato. `F` è il fastidio percepito.

```text
F = sensibilita_rilevante(osservatore, condotta)
    × intensita(condotta, volume, frequenza)
    × (1 + 0,3 × bambini_vicini)
    × (1 + 0,4 × (1 − possibilita_allontanarsi(luogo)))
    × (1 + 0,3 × durata(luogo))

P(chiedere)       = F × propensione_a_chiedere(osservatore)
P(allontanarsi)   = (1 − P(chiedere)) × possibilita_allontanarsi(luogo)
P(sopportare)     = resto

P(accettare)      = cortesia(autore) × (1 − testardaggine(autore))
                    × bonus_stile(richiesta)
                    × (1 − 0,5 × fastidio_intromissioni(autore))
                    × (1 + 0,5 × bambini_vicini × rispetto_contesto(autore))

P(insistere)      = testardaggine(osservatore) × F
P(chiamare_terzo) = luogo_regolato × (1 − testardaggine(osservatore))
```

`bonus_stile`: gentile 1,3 · neutro 1,0 · secco 0,7 · aggressivo 0,4.
`sensibilita_rilevante` usa `sensibilita_religiosa` per bestemmie e critiche alla religione, `sensibilita_generica` per tutto il resto.

### 4.2 Seed

Ogni situazione ha un seed numerico mostrato a schermo. Lo stesso seed riproduce la stessa situazione e lo stesso percorso, così si può condividere un caso con un link (`#s-482913`) e confrontare i voti.

---

## 5. Il voto

A ogni livello si apre un pannello di voto con domande diverse, ciascuna su un solo piano.

| Livello | Domande |
|---|---|
| 0 | La condotta è appropriata in questo luogo? (scala 1–5) |
| 1 | Il fastidio di chi ascolta è comprensibile? (scala 1–5) |
| 2 | È lecito fare questa richiesta? (sì · no) · È ragionevole? (scala 1–5) · Riguarda una condotta o un'identità? |
| 3 | La risposta è lecita? (sì · no) · Sarebbe stato cortese accontentare? (scala 1–5) |
| 4 | Chi sta agendo in modo più ragionevole adesso? (A · B · entrambi · nessuno) |
| 5 | Chi ha la responsabilità principale dello scontro? (A · B · condivisa) |
| 6 | Alla fine, chi aveva ragione? (A · B · entrambi · nessuno · dipende) |

Ogni voto ha un campo facoltativo "perché" di massimo 140 caratteri.

### 5.1 Le lenti dei personaggi

Dopo ogni voto il gioco mostra come avrebbero votato i personaggi principali, calcolato dai loro tratti. Esempio per "È ragionevole questa richiesta?":

```text
voto_previsto(personaggio) = arrotonda(1 + 4 × (
    0,4 × sensibilita_rilevante(personaggio, condotta)
  + 0,3 × rispetto_contesto(personaggio)
  + 0,3 × (1 − fastidio_intromissioni(personaggio))
))
```

Le lenti appaiono come piccoli avatar disposti sulla stessa scala del voto, così si vede subito a chi ci si avvicina.

### 5.2 Schermata finale

- riepilogo del percorso livello per livello;
- i tuoi voti a confronto con le lenti dei personaggi;
- il personaggio a cui somigli di più in questa partita e nel totale delle partite;
- un'etichetta del caso, per esempio "richiesta lecita, ragionevolezza divisa, rifiuto lecito";
- avviso esplicito se la richiesta riguardava un'identità;
- pulsanti: nuova situazione · rigioca con lo stesso seed · cambia una variabile · condividi.

---

## 6. Modalità di gioco

**Casuale.** Il pulsante principale genera una situazione completa. Si avanza livello per livello con "Cosa succede dopo".

**Laboratorio.** Parte da un caso base fisso: due adulti parlano a voce normale in un parco, uno bestemmia una volta, uno sconosciuto vicino chiede gentilmente di evitare. Chi gioca cambia **una sola variabile alla volta** da un pannello di controlli e vota di nuovo. Un grafico mostra come cambia il proprio voto di ragionevolezza al variare di quel parametro.

**Indovina la lente.** Il gioco mostra una situazione e un personaggio. Chi gioca deve prevedere come voterebbe quel personaggio. Serve a capire le posizioni altrui.

**Costruisci il caso.** Si scelgono manualmente personaggi, luogo, condotta e richiesta, poi si lascia girare il motore per vedere come evolve. Utile per preparare casi da discutere in live.

---

## 7. Testi e dialoghi

I dialoghi sono template con segnaposto. Ogni personaggio ha almeno tre varianti per ogni azione, così le situazioni non si ripetono.

### 7.1 Segnaposto

`{autore}`, `{osservatore}`, `{luogo}`, `{condotta}`, `{amici}`, `{bambini}`, `{terzo}`, `[bestemmia]`.

### 7.2 Esempi di template

```json
{
  "narrazione": {
    "scena": [
      "{luogo}. {autore} sta raccontando qualcosa a {amici} e a un certo punto scappa un [bestemmia].",
      "{luogo}. {autore} legge un messaggio sul telefono e commenta con un [bestemmia] a mezza voce."
    ],
    "allontanarsi": [
      "{osservatore} sospira, prende la borsa e si sposta qualche metro più in là."
    ],
    "sopportare": [
      "{osservatore} alza gli occhi al cielo ma non dice niente."
    ]
  },
  "richiesta": {
    "gentile": [
      "Scusate, potreste evitare le bestemmie? Mi danno un po' fastidio.",
      "Scusa se mi intrometto, ma se riuscissi a non bestemmiare te ne sarei grato."
    ],
    "secco": [
      "Potete smetterla con le bestemmie?"
    ],
    "aggressivo": [
      "Ma vi sembra il modo di parlare in pubblico?"
    ]
  },
  "risposta": {
    "accetta": [
      "Hai ragione, scusa, non ci avevo fatto caso."
    ],
    "accetta_a_meta": [
      "Ok, parlo più piano, ma non stavo parlando con te."
    ],
    "rifiuta_gentile": [
      "Capisco, ma sto parlando con i miei amici, non ti sto disturbando apposta."
    ],
    "rifiuta_sgarbato": [
      "Fatti i fatti tuoi, non sto parlando con te."
    ]
  }
}
```

### 7.3 Voci dei personaggi

Ogni personaggio può sovrascrivere i template generici. Esempi:

| Personaggio | Quando rifiuta | Quando chiede |
|---|---|---|
| Sara | "Mi dispiace, ma stavo parlando con lui, non con te." | "Scusa, potresti abbassare la voce? Il problema è il volume, non le parole." |
| Ettore | "Me lo chiedi gentilmente, ma resta una pretesa." | "Scusa, potresti non fumarmi addosso?" |
| Marco | "Va bene, hai ragione, non mi costa niente." | "Scusate, se potete evitare vi ringrazio, c'è gente." |
| Luca | — | "Scusate, so che non è un problema per tutti, ma a me fa male sentirlo." |
| Gigi | "Facciamo così, abbasso la voce e siamo tutti contenti?" | "Chiediamo al gestore, così decide lui." |

---

## 8. Asset

### 8.1 Personaggi

Avatar stilizzati in SVG inline, costruiti con forme semplici (testa, busto, elemento distintivo), così si possono ricolorare e generare varianti senza file esterni.

| Asset | Varianti |
|---|---|
| Corpo base | 3 corporature |
| Elemento distintivo | Occhiali (Sara), maglione (Marco), giacca (Luca), cappello (Gigi), giubbotto (Ettore), foulard (Nonna Rosa), passeggino (Giulia) |
| Espressioni | Calmo · perplesso · infastidito · arrabbiato · imbarazzato · sollevato |
| Pose | In piedi · seduto · voltato · che si allontana |

Ogni livello di escalation cambia l'espressione dei personaggi coinvolti.

### 8.2 Scenari

Fondali SVG semplificati per ogni luogo della sezione 3.1, composti da 3–5 forme riconoscibili (panchina e albero per il parco, pensilina per la fermata, tavoli per il ristorante, sedili per il treno). I personaggi si posizionano su punti predefiniti dello scenario.

### 8.3 Interfaccia

- fumetti con coda orientabile;
- icone per ogni variabile (volume, bambini, possibilità di allontanarsi, terzo presente);
- il semaforo dell'escalation, verticale, che si accende livello dopo livello;
- schede di voto;
- avatar mini per le lenti.

### 8.4 Dati

- `personaggi.json`
- `luoghi.json`
- `condotte.json`
- `richieste.json`
- `template.json`

In una SPA a file unico, questi dati vivono come oggetti JavaScript all'inizio dello script.

---

## 9. Direzione visiva

Il gioco parla di spazi pubblici e di regole non scritte, quindi il linguaggio visivo prende spunto dalla segnaletica urbana: cartelli, semafori, strisce pedonali.

| Token | Valore | Uso |
|---|---|---|
| Asfalto | `#2E3136` | Testo principale, contorni degli avatar |
| Gesso | `#F7F7F2` | Sfondo chiaro |
| Blu cartello | `#1F4E9C` | Pulsanti principali, intestazioni |
| Giallo semaforo | `#F2C230` | Livelli intermedi di escalation, evidenziazioni |
| Rosso escalation | `#C8322B` | Livelli alti di escalation |
| Verde quieto | `#3F8F5B` | Esiti in cui qualcuno cede |

In modalità scura, Asfalto diventa lo sfondo e Gesso il testo, gli altri colori restano invariati con luminosità leggermente aumentata.

Tipografia:
- **Bricolage Grotesque** per titoli e fumetti, con un carattere un po' irregolare che richiama i cartelli dipinti a mano;
- **Atkinson Hyperlegible** per il testo e le domande di voto, perché la leggibilità delle domande è centrale.

L'elemento memorabile è il **semaforo dell'escalation**: una colonna verticale a sinistra della scena con sette luci, che si accendono dal verde al rosso. Tutto il resto dell'interfaccia resta sobrio.

### 9.1 Layout

```text
┌──────────────────────────────────────────────────────────┐
│  Chi ha ragione?           [Nuova situazione] [Modalità] │
├────┬─────────────────────────────────────────────────────┤
│ ●  │                                                     │
│ ●  │          SCENA (fondale + personaggi + fumetti)     │
│ ●  │                                                     │
│ ○  ├─────────────────────────────────────────────────────┤
│ ○  │  Variabili attive: luogo · volume · bambini · ...   │
│ ○  ├─────────────────────────────────────────────────────┤
│ ○  │  VOTO del livello corrente                          │
│    │  [domanda] [scala] [lenti dei personaggi]           │
│    │                      [Cosa succede dopo]            │
└────┴─────────────────────────────────────────────────────┘
```

Su mobile il semaforo diventa una barra orizzontale sopra la scena, e le variabili attive si comprimono in una riga di icone.

---

## 10. Architettura tecnica

- **Un solo file HTML**, con CSS e JavaScript inline, nessuna build.
- JavaScript vanilla o React caricato come UMD da CDN con versione fissata.
- Generatore pseudocasuale con seed (per esempio mulberry32), così ogni situazione è riproducibile.
- Stato in un unico oggetto: `{ seed, situazione, livello, storico, voti }`.
- Voti e personaggi modificati salvati in `localStorage`, con gestione degli errori e funzionamento corretto anche se lo storage è vuoto o non disponibile.
- Media dei voti della community: facoltativa, tramite un backend semplice o un database condiviso. Senza backend, il gioco mostra solo i voti personali e le lenti.
- Navigazione tramite hash: `#gioco`, `#laboratorio`, `#indovina`, `#costruisci`, `#personaggi`, più `#s-<seed>` per condividere una situazione.

### 10.1 Modello dati

```ts
type Tratti = {
  sensibilita_religiosa: number;
  sensibilita_generica: number;
  propensione_a_chiedere: number;
  cortesia: number;
  testardaggine: number;
  fastidio_intromissioni: number;
  rispetto_contesto: number;
  uso_bestemmia: number;
};

type Personaggio = {
  id: string;
  nome: string;
  descrizione: string;
  lente: string;
  tratti: Tratti;
  esasperazione: number; // 0,5–1,5
  avatar: { corpo: number; distintivo: string; colore: string };
  voci?: Record<string, string[]>;
};

type Luogo = {
  id: string;
  nome: string;
  allontanarsi: number; // 0–1
  durata: number;       // 0–1
  regolato: boolean;
  terzo?: string;
  silenzio: number;     // 0–1
};

type Condotta = {
  id: string;
  nome: string;
  tipo: "linguaggio" | "opinione" | "comportamento" | "condizione" | "identita";
  evitabile: boolean;
  danno_oggettivo: boolean;
  religiosa: boolean;
};

type Situazione = {
  seed: number;
  luogo: Luogo;
  autore: Personaggio;
  osservatore: Personaggio;
  amici: Personaggio[];
  condotta: Condotta;
  modulatori: {
    volume: number;
    frequenza: number;
    intento: string;
    bambini: 0 | 1 | 2;
    rapporto: string;
    pubblico: number;
  };
  richiesta?: {
    stile: "gentile" | "neutro" | "secco" | "aggressivo";
    forma: string;
    motivazione: string;
    oggetto: "condotta" | "identita";
  };
};

type Passo = { livello: number; esito: string; testo: string[] };
type Voto = { livello: number; domanda: string; valore: string | number; perche?: string };
```

---

## 11. Accessibilità

- tutte le azioni raggiungibili da tastiera, con focus visibile;
- le espressioni dei personaggi descritte anche a parole per gli screen reader;
- il semaforo non si basa solo sul colore: ogni luce ha un numero e un'etichetta;
- `prefers-reduced-motion` disattiva le animazioni dei fumetti;
- contrasto conforme WCAG AA in entrambi i temi.

---

## 12. Criteri di accettazione

1. Il pulsante "Nuova situazione" genera una scena completa con luogo, personaggi, condotta e modulatori visibili.
2. "Cosa succede dopo" fa avanzare di un livello e aggiorna scena, fumetti e semaforo.
3. A ogni livello compare il pannello di voto con le domande previste dalla sezione 5.
4. Dopo ogni voto compaiono le lenti dei personaggi principali.
5. Se qualcuno cede, la scena si chiude e mostra la schermata finale.
6. Lo stesso seed riproduce la stessa situazione e lo stesso percorso.
7. In modalità laboratorio si può cambiare una sola variabile e vedere il confronto dei voti.
8. L'editor permette di modificare, esasperare, duplicare e creare personaggi, e le modifiche persistono dopo il ricaricamento.
9. Le richieste che riguardano un'identità vengono segnalate nella schermata finale.
10. Nessuna bestemmia esplicita compare nei testi, e l'escalation non rappresenta violenza fisica.

---

## 13. Estensioni possibili

- **Modalità live**: il conduttore genera la situazione, la chat vota tramite un link condiviso e i risultati appaiono in sovrimpressione.
- **Statistiche per variabile**: quale variabile sposta di più il giudizio medio della community.
- **Profilo personale**: dopo molte partite, il gioco mostra quanto pesi ciascuna variabile nei tuoi voti.
- **Nuove condotte** proposte dagli utenti e approvate da un moderatore.
