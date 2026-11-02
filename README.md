# Chi ha ragione?

Il tribunale del marciapiede. Una scena in un luogo pubblico, qualcuno che dà fastidio, qualcuno che chiede. Giudichi livello per livello su piani separati (lecito, ragionevole, cortese) e scopri come avrebbero votato cinque personaggi archetipici.

Single page application in un solo file: `index.html`, nessuna build, nessuna dipendenza a runtime.

## Giocare

Apri `index.html` in un browser, oppure pubblicalo con GitHub Pages: *Settings → Pages → Deploy from a branch → `main` / root*. Il gioco sarà su `https://<utente>.github.io/<repo>/`.

Modalità: partita casuale (anche di gruppo sullo stesso dispositivo), laboratorio, indovina la lente, costruisci il caso, editor dei personaggi. Un caso si condivide con il link `#s-<numero>`.

## Sviluppo

Serve Node 22 (`.nvmrc`). Le dipendenze npm servono solo per i test.

```sh
npm install
npm run browsers   # browser di Playwright
npm test           # test unitari di motore e asset
npm run e2e        # end-to-end su Firefox, Chromium, WebKit mobile + accessibilità
npm run serve      # http://127.0.0.1:8765/
```

Documenti: `chi-ha-ragione-spec.md` (specifica), `STYLE.md` (stile e tono), `TODO.md` (piano), `tests/TEST-API.md` (contratto di test), `CLAUDE.md` (note per lo sviluppo assistito).

Nota sui contenuti: le bestemmie non compaiono mai in chiaro, solo come segnaposto censurato. I personaggi sono archetipi di posizione, non persone reali.
