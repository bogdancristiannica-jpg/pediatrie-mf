# CLAUDE.md — pediatrie-mf

Reguli pentru orice sesiune Claude Code în acest depozit. Se citesc înainte de prima modificare.

## Ce este

Referință clinică pediatrică (0–6 ani) pentru medicul de familie: un singur fișier HTML static, construit din `src/`.
Fără server, fără cont, fără urmărire, fără date personale. Publicat pe GitHub Pages din `main`.

## Comenzi

- `npm run validate` — datele clinice (rulează înainte de orice commit care atinge `src/data/`)
- `npm run build` — `dist/index.html` + `dist/artifact.html`
- `npm run dev` — build + server pe http://localhost:4173/
- `npm run test:unit` — aritmetica calculatorului
- `npm run test:e2e` — Playwright (Chromium, WebKit, iPhone); fără WebKit local: `npm run test:e2e:chromium`
- `npm run check` — totul, în ordinea din CI

## Reguli nenegociabile

1. **Nicio doză, prag sau recomandare din memorie.** Orice schimbare în `src/data/` urmează skill-ul `verificare-surse`:
   sursa primară deschisă, citată în câmpul `src` al fișei, în `docs/SURSE.md` și în `CHANGELOG.md`. Ce nu se poate
   verifica se marchează `{{...}}` în text și în câmpul `uv`. Un verdict fără perimetru („Am verificat / NU am verificat”)
   se respinge.
2. **Copy-ul clinic îl decide medicul responsabil.** Propunerile de reformulare se marchează ca propuneri, în PR, nu se
   aplică tacit. Fără avertismente deontologice adăugate în pagină.
3. **Datele clinice stau doar în `src/data/`.** Nicio cifră medicală în `js/`, `css/` sau teste, cu excepția valorilor
   așteptate din testele unitare, calculate de mână din sursă.
4. **Fără dependențe la rulare.** Pagina nu încarcă scripturi externe; singura resursă externă sunt fonturile Google, cu
   fallback de sistem. Build-ul și scripturile nu au dependențe npm. Dependențele de dezvoltare se adaugă doar cu motiv.
5. **Accesibilitate:** WCAG 2.2 AA, text curent ≥16 px, ținte ≥44 px, contrast ≥4.5:1, focus vizibil, fără derulare
   orizontală la 320 px, `prefers-reduced-motion` respectat. Toate culorile sunt tokeni în `:root` cu variantă întunecată.
6. **Limba:** română, diacritice cu virgulă (ș, ț). Terminologie medicală, fără calcuri din engleză („sfat de specialist” →
   „consult de specialitate”; „spacer” → „cameră de inhalare”). Identificatorii din cod rămân în engleză.
7. **Fără modificări nesolicitate.** Un task de conținut nu schimbă interfața și invers.

## Cum lucrezi

- Plan cu pași numerotați și criterii de acceptare → STOP pentru aprobare → execuție → `npm run check` → PR. Deciziile la
  porți (plan, PR, merge) sunt ale lui Bogdan.
- Ramuri: `feat/...`, `fix/...`, `clinic/<id-fisa>` pentru conținut. `main` e protejat de CI.
- Pentru interfață pe iPhone: skill-ul `ios-simulator` (simulatorul rulează pe mașina locală, nu în cloud).
- Artefactul claude.ai se republică din `dist/artifact.html` (nu din `index.html`: viewer-ul adaugă el doctype și head).

## Harta codului

| Fișier                   | Rol                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| `src/data/conditions.js` | cele 35 de fișe (`C`) și grupele (`G`)                                                    |
| `src/data/tools.js`      | `NEWS`, `ABX`, `EXCL`, criteriile scorurilor                                              |
| `src/js/calc.js`         | `calcGroups(w, ageMonths)` → grupe de medicamente cu linii de text; `calcOut`, `viewCalc` |
| `src/js/scores.js`       | stare `SC`, `scoreOut(k)`, `viewScores`                                                   |
| `src/js/pages.js`        | `viewAbx`, `viewAlarm`, `viewExcl`                                                        |
| `src/js/app.js`          | `fmt` (marcaje → HTML), căutare (`viewSearch`), `viewSheet`, `route()` pe `location.hash` |
| `scripts/build.mjs`      | ordinea de concatenare `JS_ORDER`; învelișul de document; versiunea din `git rev-parse`   |

Un model mental: datele sunt tabele; `app.js` le transformă în HTML la fiecare schimbare de `#hash`; nu există stare
persistentă în afara câmpului de căutare și a valorilor din calculator și scoruri (în memorie, nu pe disc).
