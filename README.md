# Fișe pediatrice 0–6 ani

Referință clinică rapidă pentru medicul de familie: 35 de afecțiuni frecvente ale nou-născutului, sugarului, copilului mic
și preșcolarului, după ghidurile europene în vigoare (ESPGHAN, ESPID, ERS, EAACI, EAU/ESPU, EuroGuiDerm, ESCMID, EPOS, GINA)
și NICE acolo unde nu există ghid european. Cu calculator de doze pe greutate, scoruri clinice, antibioticele pe o pagină,
semnele de alarmă și perioadele de excludere din colectivitate.

Pagina este un singur fișier HTML, fără server, fără cont, fără urmărire. Merge pe iPhone (Safari), pe Chrome
(Windows/Mac) și fără internet după prima deschidere.

**Adresa publicată:** https://pediatrie-mf.pages.dev (Cloudflare Pages, din `main`; publicat 4 octombrie 2026). Varianta
Workers (`wrangler.jsonc`) rămâne disponibilă; vezi „Publicare”.

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

## Publicare

Publicarea principală este pe **Cloudflare**, care construiește direct din acest depozit, pe serverele Cloudflare, fără
GitHub Actions. Panoul Cloudflare oferă două variante; depozitul e pregătit pentru amândouă. Etichetele de mai jos sunt cele
din documentația oficială la 4 octombrie 2026 (paginile se schimbă; dacă nu le mai găsești, caută „Workers Builds” sau
„Pages Git integration” în developers.cloudflare.com).

**Varianta A, Workers cu fișiere statice** (direcția actuală a Cloudflare; folosește `wrangler.jsonc` din depozit):

1. Workers & Pages → **Create application** → **Import a repository** (sau „Connect to Git”) → depozitul `pediatrie-mf`.
2. Numele Worker-ului: `pediatrie-mf` (trebuie să fie identic cu `name` din `wrangler.jsonc`, altfel build-ul eșuează).
3. Build command: `npm ci && npm run build` · Deploy command: `npx wrangler deploy` (valoarea implicită) · Root directory: gol.
4. Deploy. Adresa: `https://pediatrie-mf.<subdomeniul-contului>.workers.dev`. Fiecare push pe `main` republică.
5. Publicare manuală de pe Mac, fără panou: `npx wrangler login` o singură dată, apoi `npm run deploy`.

**Varianta B, Pages** (dacă în panou apare încă fila Pages):

1. Workers & Pages → **Create application** → **Pages** → **Connect to Git** → depozitul `pediatrie-mf` → Begin setup.
2. Production branch: `main` · Build command: `npm ci && npm run build` · Build output directory: `dist`.
3. Save and Deploy. Adresa: `https://pediatrie-mf.pages.dev`. Fiecare pull request primește o adresă de previzualizare.

Versiunea Node: ambele variante citesc `.nvmrc` (= 22); dacă vrei să fii sigur, adaugă variabila `NODE_VERSION` = `22`
(ordinea de prioritate documentată: variabila, apoi `.nvmrc`, apoi `.node-version`).

Domeniu propriu (opțional, ambele variante): în proiect, **Custom domains** → Set up a custom domain. Pentru un domeniu
`.dev`, HTTPS e obligatoriu (listă HSTS preîncărcată); Cloudflare îl oferă automat.

Antetele HTTP (securitate, cache corect pentru `sw.js` și `index.html`) sunt în `src/_headers`, copiat în `dist/` la build;
fișierul e citit la fel de Pages și de Workers.

**GitHub Pages** rămâne disponibil ca alternativă (`.github/workflows/pages.yml`), dar cele două workflow-uri GitHub
(CI și Pages) pornesc deocamdată **manual** (Actions → Run workflow): contul nu are acces la runnerele GitHub Actions
cât timp metoda de plată e marcată invalidă. Până atunci, verificările obligatorii rulează local: `npm run check`
înainte de fiecare push. Reactivarea declanșării automate: instrucțiunile din comentariul fiecărui workflow.

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
