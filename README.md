# Fișe pediatrice 0–6 ani

Referință clinică rapidă pentru medicul de familie: 35 de afecțiuni frecvente ale nou-născutului, sugarului, copilului mic
și preșcolarului, după ghidurile europene în vigoare (ESPGHAN, ESPID, ERS, EAACI, EAU/ESPU, EuroGuiDerm, ESCMID, EPOS, GINA)
și NICE acolo unde nu există ghid european. Cu calculator de doze pe greutate, scoruri clinice, antibioticele pe o pagină,
semnele de alarmă și perioadele de excludere din colectivitate.

Pagina este un singur fișier HTML, fără server, fără cont, fără urmărire. Merge pe iPhone (Safari), pe Chrome
(Windows/Mac) și fără internet după prima deschidere.

**Adresa publicată:** https://bogdancristiannica-jpg.github.io/pediatrie-mf/ (se activează la primul push pe `main`)

> Conținutul este un instrument de lucru pentru medici, nu înlocuiește judecata clinică și nici RCP-ul produsului prescris.
> Dozele sunt calculate aritmetic din sursele citate pe fiecare rând; plafoanele și vârstele minime se verifică în RCP-ul
> autorizat în România. Starea verificării fiecărei surse este în [docs/SURSE.md](docs/SURSE.md).

## Pornire rapidă

```bash
npm ci                 # instalează uneltele (Node 22+)
npm run dev            # construiește dist/ și pornește http://localhost:4173/
npm run check          # validare date + lint + build + teste unitare + teste e2e
```

Pentru testele cap-la-cap pe WebKit (motorul Safari) local: `npx playwright install --with-deps chromium webkit`.
Fără WebKit instalat: `npm run test:e2e:chromium`.

## Comenzi

| Comandă                           | Ce face                                                                                                                 |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `npm run validate`                | Verifică datele clinice: câmpuri obligatorii, id-uri unice, legături interne, marcaje închise, diacritice               |
| `npm run build`                   | Asamblează `src/` în `dist/index.html` (document complet, PWA) și `dist/artifact.html` (fără înveliș, pentru claude.ai) |
| `npm run serve` / `npm run dev`   | Server static pentru `dist/`, port 4173                                                                                 |
| `npm run test:unit`               | Aritmetica calculatorului (`node --test`, fără browser)                                                                 |
| `npm run test:e2e`                | Playwright pe Chromium, WebKit și emulare iPhone                                                                        |
| `npm run lint` / `npm run format` | ESLint + Prettier                                                                                                       |
| `npm run icons`                   | Regenerează pictogramele PWA din `scripts/make-icons.mjs`                                                               |

## Structura

```
src/
  index.html           șablonul paginii (markup + marcajele unde intră CSS și JS)
  css/app.css          stiluri; toate culorile sunt tokeni în :root, cu temă întunecată
  data/conditions.js   cele 35 de fișe — singura sursă de adevăr clinic
  data/tools.js        noutăți, antibiotice pe o pagină, excludere din colectivitate, criteriile scorurilor
  js/calc.js           calculatorul de doze (funcții pure, testabile în Node)
  js/scores.js         scorurile clinice (semafor NICE, Centor, FeverPAIN, deshidratare, crup)
  js/pages.js          paginile de referință (antibiotice, alarmă, excludere)
  js/app.js            utilitare, randarea fișelor, căutare, rutare pe hash
  sw.js, manifest.webmanifest, assets/   PWA (funcționare fără internet, pictogramă pe ecranul de start)
scripts/               build, validare, server, pictograme — fără dependențe
tests/unit, tests/e2e  teste
docs/                  arhitectură, surse, jurnal de modificări
.claude/               reguli și skill-uri pentru Claude Code (simulator iOS, verificarea surselor)
```

Detalii în [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Cum adaugi sau corectezi o fișă

1. Citește [.claude/skills/verificare-surse/SKILL.md](.claude/skills/verificare-surse/SKILL.md): nimic din memorie, totul din sursa primară.
2. Editează `src/data/conditions.js`. O fișă are: `id` (ASCII), `g` (grupa: `nn`, `sm`, `ps`), `n`, `alt` (sinonime și denumiri
   comerciale pentru căutare), `key` (decizia-cheie, o frază), `sym`, `dx`, `alarm`, `tx`, `no`, `src` (`[[titlu, url]]`),
   opțional `note`, `uv` (ce nu s-a verificat), `nou` (eticheta „Nou”).
   Marcaje în text: `[[...]]` doză sau interval, `**...**` accent, `*...*` italic, `{{...}}` neverificat.
3. `npm run validate && npm test`, apoi `npm run build` și verifică în browser.
4. Actualizează `docs/SURSE.md` și `CHANGELOG.md`. Deschide un pull request; șablonul cere sursa.

## Pe iPhone

Deschide adresa publicată în Safari → Partajare → „Adaugă pe ecranul principal”. Pagina se deschide apoi ca aplicație,
fără bara Safari, și funcționează fără internet (service worker). Verificarea în simulatorul iOS:
[.claude/skills/ios-simulator/SKILL.md](.claude/skills/ios-simulator/SKILL.md).

## Lucrul cu Claude Code

`CLAUDE.md` conține regulile proiectului; `.claude/settings.json` permite comenzile de build și test fără confirmare;
skill-urile din `.claude/skills/` se încarcă automat. Pornește cu `claude` în rădăcina depozitului.

## Perimetrul verificării (3 octombrie 2026)

Verificat: versiunea în vigoare a fiecărui ghid, criteriile de diagnostic, schemele și dozele, RCP-urile românești pentru
antipiretice (6 produse), Vermox, Vermigal Novo, diazepam intrarectal. Neverificat: NICE CKS și BNFC (accesibile doar din
Regatul Unit), RCP-urile românești ale celorlalte produse, regulile DSP de excludere din colectivitate, redarea pe un iPhone
real (testele rulează pe WebKit în Playwright, nu pe iOS). Lista completă: [docs/SURSE.md](docs/SURSE.md).

## Licență

Codul: [MIT](LICENSE). Conținutul clinic citează ghiduri și RCP-uri publice; verifică-l înainte de a-l folosi.
