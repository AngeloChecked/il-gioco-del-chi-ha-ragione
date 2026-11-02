# Chi ha ragione? — Style guide

Documento di riferimento per grafica, asset, fumetti e tono di voce.
Base: spec §8, §9, §11. Questo file la estende, non la contraddice.

---

## 1. Concept: "Il tribunale del marciapiede"

Il gioco è un processo sommario in mezzo alla strada. Gli spazi pubblici sono il tribunale, la segnaletica urbana è il linguaggio, chi gioca è il giudice (che non ha studiato legge).

Tre parole guida:

- **Segnaletica** — cartelli, semafori, strisce pedonali, nastro bianco-rosso dei lavori in corso.
- **Fumetto** — personaggi piatti, contorni spessi, fumetti che spuntano, espressioni esagerate.
- **Faccia tosta** — testi che pungono, verdetti con il timbro, ironia su tutti in egual misura.

L'interfaccia di servizio (voto, pannelli, editor) resta **sobria e leggibile**. Il divertimento vive nella scena, nei fumetti e nei micro-testi.

---

## 2. Tono di voce

### 2.1 Principi

1. **Pungente, mai cattivo.** Si ride della situazione, non di una persona o di un gruppo reale.
2. **Equidistante nel prendere in giro.** Se una battuta punge Ettore, la successiva punge Luca. Nessun personaggio è "quello giusto".
3. **Controverso sulle domande, non sulle risposte.** Il gioco provoca chiedendo cose scomode ("Ma la fede vale più del fumo?"), non sentenziando.
4. **Breve.** Fumetti massimo 90 caratteri. Didascalie massimo 120.
5. **Italiano parlato.** Frasi da bar, intercalari, puntini di sospensione. Niente burocratese, tranne quando è parodia (verdetti).

### 2.2 Registri

| Dove | Registro | Esempio |
|---|---|---|
| Fumetti personaggi | Parlato, colorito | "Scusa eh, ma qui c'è gente che mangia." |
| Didascalia narratore | Ironico, secco | "Il treno è in ritardo di 40 minuti. Anche la pazienza." |
| Domande di voto | Neutro, chiaro (mai ironico) | "È lecito fare questa richiesta?" |
| Feedback lenti | Complice | "Hai votato come Sara. Lei approva, ma non te lo dirà." |
| Verdetto finale | Parodia burocratica | "SENTENZA N. 482913 — Richiesta lecita, ragionevolezza divisa, rifiuto lecito. Le parti sono invitate a non rivolgersi più la parola." |
| Errori / vuoti | Autoironico | "Lo storage è sparito. Come la buona educazione." |

> Regola d'oro: **le domande di voto non scherzano mai.** Sono il cuore del gioco e devono essere comprese al primo colpo (spec §1.1).

### 2.3 Micro-testi pronti

**Pulsanti**
- Nuova situazione → "Nuova grana"
- Cosa succede dopo → "E poi?" (con sottotitolo "Cosa succede dopo")
- Rigioca stesso seed → "Riapri il processo"
- Cambia una variabile → "E se invece…?"
- Condividi → "Fai litigare un amico"

**Etichette semaforo** (numero + nome + battuta)
| # | Nome | Battuta |
|---|---|---|
| 0 | La scena | "Tutto tranquillo. Per ora." |
| 1 | Il fastidio | "Qualcuno ha alzato un sopracciglio." |
| 2 | La richiesta | "Ha deciso di dirlo." |
| 3 | La risposta | "La palla passa." |
| 4 | Dopo il rifiuto | "Silenzio imbarazzante." |
| 5 | Lo scontro | "Si alzano i toni." |
| 6 | La chiusura | "Fine dei giochi." |

**Somiglianza con i personaggi**
- Marco: "Diplomatico. Probabilmente chiedi scusa anche ai lampioni."
- Luca: "Credi nel dialogo. E forse anche in altro."
- Gigi: "Hai già chiamato il gestore, vero?"
- Sara: "Non stavi parlando con loro, e si vede."
- Ettore: "Il prete del quartiere ti saluta. Dall'altra parte della strada."

**Caso identità (avviso finale)**
"⚠ Attenzione: qui non si chiedeva di cambiare cosa fai, ma cosa sei. Cambia tutto."
Questo avviso è l'unico testo che **non** fa battute.

### 2.4 Linee rosse

- Nessuna bestemmia esplicita, mai. Solo segnaposto censurati (§6.3).
- Nessun insulto reale verso gruppi religiosi, etnici, di genere o orientamento.
- Karim, Nonna Rosa, Luca: le battute riguardano la situazione, mai la loro fede in sé.
- Nessuna violenza fisica, né disegnata né descritta. Lo scontro massimo è verbale (spec §1.5).
- Nessun riferimento a persone reali, live reali o streamer reali.

---

## 3. Colori

### 3.1 Token

| Token | Chiaro | Scuro | Uso |
|---|---|---|---|
| `--asfalto` | `#2E3136` | `#2E3136` | Testo (chiaro), sfondo (scuro), contorni avatar |
| `--gesso` | `#F7F7F2` | `#F7F7F2` | Sfondo (chiaro), testo (scuro) |
| `--bg` | `#F7F7F2` | `#2E3136` | Sfondo pagina |
| `--fg` | `#2E3136` | `#F7F7F2` | Testo principale |
| `--surface` | `#FFFFFF` | `#3A3E44` | Card, pannelli voto, fumetti |
| `--muted` | `#6B6F76` | `#A9ADB3` | Testo secondario |
| `--blu` | `#1F4E9C` | `#5B8DEF` | Intestazioni, accenti, link |
| `--blu-pulsante` | `#1F4E9C` | `#2F62C0` | Sfondo pulsanti primari con testo bianco (in scuro `#5B8DEF` col bianco non passa AA) |
| `--giallo` | `#F2C230` | `#F5CD4E` | Livelli intermedi, evidenziazioni, focus |
| `--rosso` | `#C8322B` | `#E5544C` | Livelli alti, urla |
| `--verde` | `#3F8F5B` | `#5DB37A` | Qualcuno cede, esiti pacifici |
| `--verde-testo` | `#2F6E45` | `#5DB37A` | Verde usato come testo (contrasto AA) |

```css
:root {
  --asfalto:#2E3136; --gesso:#F7F7F2;
  --bg:var(--gesso); --fg:var(--asfalto); --surface:#FFFFFF; --muted:#6B6F76;
  --blu:#1F4E9C; --blu-pulsante:#1F4E9C; --giallo:#F2C230; --rosso:#C8322B; --verde:#3F8F5B; --verde-testo:#2F6E45;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg:var(--asfalto); --fg:var(--gesso); --surface:#3A3E44; --muted:#A9ADB3;
    --blu:#5B8DEF; --blu-pulsante:#2F62C0; --giallo:#F5CD4E; --rosso:#E5544C; --verde:#5DB37A; --verde-testo:#5DB37A;
  }
}
:root[data-theme="dark"] { /* stessi valori del blocco sopra */ }
body { background: var(--bg); color: var(--fg); }
```

### 3.2 Regole di contrasto

- Giallo **solo come riempimento**, con testo `--asfalto` sopra. Mai testo giallo su gesso.
- Testo bianco su `--blu-pulsante` e `--rosso`: ok (AA). Mai testo bianco su `--blu` in tema scuro.
- Verde come testo → usare `--verde-testo`.
- Contorni avatar sempre `--asfalto`, anche in tema scuro (gli avatar stanno su fondali chiari).

### 3.3 Palette personaggi

Colore principale = vestito. Pelle da set di 5 toni neutri (`#F1D3B8`, `#E0B48F`, `#C08A63`, `#8E5C3C`, `#5E3B26`), assegnati per varietà, mai legati a stereotipi.

| Personaggio | Colore | Distintivo |
|---|---|---|
| Marco | `#4A7A8C` petrolio | Maglione a collo alto |
| Luca | `#7A5C99` viola | Giacca con bottoni |
| Gigi | `#D9822B` arancio | Cappello a falda (borsalino) |
| Sara | `#2E8C83` verde acqua | Occhiali tondi spessi |
| Ettore | `#8C2E2E` bordeaux | Giubbotto di pelle con spilla |
| Nonna Rosa | `#C77D9A` rosa antico | Foulard + borsetta |
| Karim | `#3D6E4E` verde bosco | Kufi, barba curata |
| Giulia | `#E0A030` senape | Passeggino + bambino |
| Teo | `#5A7FBF` azzurro | Cuffie al collo, felpa |
| Vale | `#9AA5B1` grigio perla | Mascherina sul mento, tappi orecchie |
| Dario | `#222222` nero | Occhiali da sole, sorrisetto |
| Il gestore | `#1F4E9C` blu cartello | Badge, cravatta, fischietto |

---

## 4. Tipografia

| Ruolo | Font | Peso | Size desktop / mobile |
|---|---|---|---|
| Titolo app | Bricolage Grotesque | 800 | 32 / 24 px |
| Titoli sezione | Bricolage Grotesque | 700 | 22 / 18 px |
| Fumetti | Bricolage Grotesque | 600 | 17 / 15 px |
| Urla nei fumetti | Bricolage Grotesque | 800 MAIUSCOLO | 19 / 16 px |
| Timbro verdetto | Bricolage Grotesque | 800 MAIUSCOLO, `letter-spacing: .08em` | 28 / 20 px |
| Testo, domande voto | Atkinson Hyperlegible | 400 / 700 | 17 / 16 px |
| Etichette, seed | Atkinson Hyperlegible | 700 | 13 px |

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Atkinson+Hyperlegible:wght@400;700&display=swap" rel="stylesheet">
```

Interlinea testo 1.5, fumetti 1.25. Fallback: `system-ui, sans-serif`.

---

## 5. Personaggi (SVG)

### 5.1 Costruzione

Stile **flat cartoon "da cartello"**: forme geometriche, niente sfumature, contorno unico.

- Viewbox `0 0 120 200`. Testa grande (cerchio r=28), proporzione testa/corpo ~1:2,5 (buffa, non realistica).
- Contorno `stroke: var(--asfalto)`, spessore **3px**, `stroke-linejoin: round`.
- Riempimenti piatti, una sola ombra opzionale (stesso colore con opacità 0,15 spostata di 3px).
- Busto: rettangolo arrotondato. 3 corporature: esile (larghezza 44), media (56), robusta (70).
- Gambe: due rettangoli, piedi ovali. Seduto = gambe piegate a 90°.
- Il distintivo deve essere riconoscibile anche nel mini-avatar 32px.

### 5.2 Espressioni

Solo sopracciglia, occhi, bocca e un accessorio. Esagerare.

| Espressione | Sopracciglia | Bocca | Extra |
|---|---|---|---|
| Calmo | Piatte | Sorriso leggero | — |
| Perplesso | Una alzata | Linea storta | "?" piccolo sopra la testa |
| Infastidito | Inclinate verso il centro | Linea piatta | Occhi socchiusi |
| Arrabbiato | V marcata | Aperta, denti | Vapore dalle orecchie, guance `--rosso` 40% |
| Imbarazzato | Alzate | Sorriso forzato | Goccia di sudore, rossore |
| Sollevato | Rilassate | Sorriso largo | Sospiro (nuvoletta) |

Mappa espressione ↔ livello:
- Liv. 0: tutti calmi.
- Liv. 1: osservatore perplesso/infastidito.
- Liv. 2: autore perplesso.
- Liv. 3: dipende dall'esito (accetta → imbarazzato; rifiuta sgarbato → osservatore arrabbiato).
- Liv. 4–5: entrambi arrabbiati, amici imbarazzati.
- Liv. 6 / chi cede: sollevato (verde nel semaforo).

### 5.3 Pose

- **In piedi**: frontale 3/4.
- **Seduto**: su panchina/sedile dello scenario.
- **Voltato**: specchiato, testa girata (per "fa finta di niente").
- **Che si allontana**: di schiena, 3 linee di movimento, leggera inclinazione, opacità che cala.

### 5.4 Ruoli in scena

- Autore e osservatore più grandi (scala 1), amici scala 0,9, folla scala 0,6 in grigio `#B8BCC2` senza volto.
- Bambini: scala 0,5, colori vivaci, sempre lontani dallo scontro.
- Il terzo (gestore, capotreno, maschera…) entra da destra con un cartello o un fischietto.

---

## 6. Fumetti

### 6.1 Tipi

| Tipo | Forma | Uso |
|---|---|---|
| Parlato | Ovale/rettangolo arrotondato (r=16), bordo 3px | Battute normali |
| Urlato | Bordo a spine (esplosione), testo maiuscolo, contorno `--rosso` | Livello 5, stile aggressivo |
| Sussurro | Bordo tratteggiato, testo `--muted` corsivo | Battute a mezza voce, commenti degli amici |
| Pensiero | Nuvola + 3 bollicine | Livello 1 (fastidio silenzioso) |
| Narratore | Rettangolo `--giallo`, testo asfalto, angoli vivi, in alto a sinistra | Didascalie di scena |
| Sistema | Cartello stradale (rombo/cerchio) | Interventi del terzo ("REGOLAMENTO DEL LOCALE") |

### 6.2 Regole

- Sfondo `--surface`, testo `--fg`, padding 10/14 px, larghezza massima 260px.
- Coda: triangolo che punta alla testa del personaggio, lato calcolato dalla posizione nello slot.
- Massimo **3 fumetti visibili** per volta. I vecchi sfumano al 40% e poi spariscono.
- Animazione ingresso: scale 0.6 → 1.05 → 1 in 220ms (`cubic-bezier(.34,1.56,.64,1)`). Con `prefers-reduced-motion`: solo comparsa.
- Ogni nuovo fumetto è annunciato da una regione `aria-live="polite"` con "Nome dice: testo".

### 6.3 Censura `[bestemmia]`

La bestemmia non si legge mai. Diventa un **adesivo di censura** inline, che è anche la gag visiva ricorrente.

| Intensità | Resa | Esempio |
|---|---|---|
| 1 | Grawlix piccolo `#@§!` su fondo giallo | "Ma porc* `#@§!`, ho perso il treno" |
| 2 | Barra nera con fulmine ⚡ e "BIIP" | `█⚡ BIIP █` |
| 3 | Adesivo rosso ruotato -6° con nastro bianco-rosso e "CENSURATO" | Fumetto che trema 1 volta |

- `aria-label="bestemmia censurata, intensità 2"`.
- In "Luoghi sacri" (sagrato) l'adesivo ha anche un'aureola ironica sopra. Leggera, non sacrilega.

---

## 7. Scenari

### 7.1 Costruzione

- Viewbox `0 0 800 400`, scalato con `preserveAspectRatio="xMidYMax slice"`.
- Fondale in 3 piani: cielo/muro (colore tenue), piano medio (3–5 oggetti riconoscibili), pavimento con linea d'orizzonte.
- Colori fondale **desaturati** (saturazione −40%) così i personaggi risaltano.
- Contorni oggetti 2px (più sottili dei personaggi, per gerarchia).
- Un **dettaglio comico** per scenario, sempre presente:

| Luogo | Oggetti | Dettaglio comico |
|---|---|---|
| Parco | Panchina, albero, lampione | Piccione che giudica |
| Piazza | Fontana, palazzo, folla | Statua con espressione perplessa |
| Fermata bus | Pensilina, palina | Display "IN ARRIVO: forse" |
| Treno regionale | Sedili, finestrino, portapacchi | Cartello "Ritardo: 40'" |
| Ristorante | Tavoli, tovaglia a quadri | Cameriere che fa finta di non sentire |
| Bar | Bancone, macchina caffè, sgabelli | Lavagna "Oggi: polemica del giorno" |
| Palestra | Manubri, specchio, panca | Poster motivazionale "NO PAIN NO RAGIONE" |
| Cinema | Poltrone, schermo, luce uscita | Schermo con "SSSHHH" |
| Biblioteca | Scaffali, lampada verde | Cartello "SILENZIO" storto |
| Sagrato | Scalinata, portone, campanile | Campana con occhi socchiusi |
| Live streaming | Cornice webcam, chat laterale | Chat che scrive "F" e "📢 RAGA" |

### 7.2 Variabili visualizzate in scena

- **Volume**: onde sonore accanto all'autore (1–4 archi).
- **Bambini**: sagome piccole lontane o vicine.
- **Folla**: sagome grigie sul piano medio.
- **Fumo**: nuvoletta grigia che va verso l'osservatore.
- **Terzo presente**: cartello del luogo visibile sullo sfondo.

---

## 8. Componenti UI

### 8.1 Semaforo dell'escalation (elemento memorabile)

- Colonna verticale, sfondo `--asfalto`, angoli r=20, larghezza 72px, come un vero semaforo.
- 7 luci circolari 36px. Spente: `#444` con riflesso. Accese:
  - 0–1 `--verde`, 2–4 `--giallo`, 5–6 `--rosso`.
  - Se qualcuno cede: la luce corrente diventa `--verde` con bagliore.
- Ogni luce ha il numero dentro e l'etichetta a destra (desktop) o sotto (mobile).
- Accensione: fade + glow (`box-shadow 0 0 16px`) in 300ms.
- Mobile: barra orizzontale sopra la scena, luci 24px, etichetta solo per quella attiva.

### 8.2 Pulsanti

- **Primario**: forma cartello rettangolare, `--blu`, testo bianco Bricolage 700, bordo bianco interno 2px (come i cartelli stradali), r=8.
- **Secondario**: contorno `--fg` 2px, sfondo trasparente.
- **"E poi?"**: primario grande con freccia di direzione obbligatoria (cerchio blu con freccia bianca).
- Hover: leggero tilt -1°. Focus: anello `--giallo` 3px + offset 2px.

### 8.3 Scheda di voto

- Card `--surface`, bordo sinistro 6px del colore del livello corrente.
- Domanda in Atkinson 700, 18px. Una domanda per riga.
- Scala 1–5: 5 cerchi grandi (44px, area di tocco), etichette agli estremi ("per niente" / "del tutto").
- Sì/No: due cartelli (✓ verde / ✕ rosso), sempre con testo.
- Campo "perché": input con contatore "0/140".
- **Lenti**: dopo il voto, i mini-avatar scivolano sulla scala alla loro posizione, con tooltip della lente in corsivo.

### 8.4 Barra variabili

Chip con icona + testo: `🔊 alto` · `👶 vicini` · `🚪 difficile andarsene` · `👮 c'è il capotreno`. Icone SVG monocrome nello stile segnaletica (pittogrammi tondi), non emoji, nella versione finale.

### 8.5 Schermata finale

- Grande **timbro** ruotato -4°, bordo doppio `--rosso`, testo maiuscolo "SENTENZA N. <seed>".
- Sotto: etichetta del caso, riepilogo a fumetti, tabella voti vs lenti.
- "Somigli a…": avatar grande del personaggio con la battuta di §2.3.
- Avviso identità: box con bordo `--rosso`, sfondo neutro, nessuna animazione, nessuna battuta.

---

## 9. Motion

| Elemento | Animazione | Durata |
|---|---|---|
| Fumetto | Pop elastico | 220ms |
| Luce semaforo | Fade + glow | 300ms |
| Cambio espressione | Crossfade | 150ms |
| Personaggio che se ne va | Translate X + fade | 600ms |
| Urlo (liv. 5) | Shake 2px × 2 | 200ms |
| Timbro sentenza | Scale 1.4 → 1 + rotazione | 250ms |

Tutto disattivato con `@media (prefers-reduced-motion: reduce)`, sostituito da comparsa immediata.

---

## 10. Layout e spaziature

- Griglia base 8px. Gutter mobile 16px, desktop 24px.
- Larghezza massima contenuto 1200px.
- Scena: rapporto 2:1 desktop, 4:3 mobile.
- Breakpoint: 720px (mobile ↔ desktop), 1024px (editor personaggi come pannello laterale invece che a schermo intero).
- Nessuno scroll orizzontale a nessuna larghezza.

---

## 11. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Ironia sulla situazione | Ironia sulla fede o sull'identità di qualcuno |
| Censura come gag visiva | Lettere della bestemmia leggibili sotto la censura |
| Domande di voto neutre e chiare | Domande che suggeriscono la risposta |
| Tutti i personaggi a turno ridicoli | Un personaggio sempre "il cattivo" |
| Toni che salgono fino all'urlo | Gesti, pugni, oggetti lanciati |
| Colori di stato anche con testo e numero | Informazioni affidate solo al colore |
| Interfaccia di voto sobria | Animazioni o battute nel pannello di voto |
