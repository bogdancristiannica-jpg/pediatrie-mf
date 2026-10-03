# Jurnal de modificări

Formatul urmează [Keep a Changelog](https://keepachangelog.com/ro/1.1.0/); versiunile urmează [SemVer](https://semver.org/lang/ro/).
Schimbările de conținut clinic poartă sursa în paranteză.

## [0.1.1] — 2026-10-03

### Schimbat

- Publicarea principală trece pe Cloudflare Pages (build din depozit, fără GitHub Actions); antete HTTP în `src/_headers`
  (securitate; `no-cache` pentru pagină și service worker).
- Workflow-urile GitHub (CI, Pages) pornesc manual până când contul are acces la runnerele Actions; verificările rulează
  local cu `npm run check`.
- Acțiunile GitHub actualizate la versiunile curente (checkout v7, setup-node v7, upload-artifact v7,
  upload-pages-artifact v5, deploy-pages v5), conform propunerilor Dependabot #1–#5.

## [0.1.0] — 2026-10-03

### Adăugat

- 35 de fișe clinice pe trei grupe de vârstă (nou-născut și sugar mic, 1–36 luni, 3–6 ani), fiecare cu decizia-cheie,
  semne de alarmă, tratament, ce nu se recomandă, diagnostic, simptome și sursa.
- Calculator de doze pe greutate și vârstă: paracetamol, ibuprofen (RCP RO 2019–2026), amoxicilină, amoxicilină-clavulanat,
  claritromicină, penicilină V, flucloxacilină (NICE NG91, NG84, NG153, NG250), azitromicină (ESPGHAN/ESPID 2014),
  dexametazonă și prednisolon în crup (NHS Highland 2024), corticoizi în criza de wheezing (GINA 2026), adrenalină
  nebulizată, SRO (NICE CG84), PEG (ESPGHAN/NASPGHAN 2026), fier (ESPGHAN 2025), benzodiazepine și desloratadină pe vârstă.
- Scoruri clinice: semaforul NICE NG143 (toate semnele roșii și galbene), Centor, FeverPAIN (NICE NG84), scala clinică de
  deshidratare (ESPGHAN 2014), severitatea crupului (NHS Highland 2024).
- Antibioticele pe o pagină, semnele de alarmă pe o pagină, excluderea din colectivitate (UKHSA, 7 sept. 2026).
- PWA: funcționare fără internet, pictogramă pe ecranul de start.
- Infrastructură: build fără dependențe, validarea datelor, teste unitare și cap-la-cap (Chromium, WebKit, iPhone), CI,
  publicare pe GitHub Pages, reguli și skill-uri pentru Claude Code.

### Corectat (după auditul adversarial din 3 oct. 2026)

- Conjunctivita neonatală purulentă: antibiotic sistemic pentru posibil gonococ fără a aștepta rezultatul (NICE NG195 1.18.2).
- Infecția neonatală: trecerea la amoxicilină orală este „de luat în considerare”, cu condiții (NG195 1.22.1); 7 zile și la
  suspiciune puternică cu hemocultură negativă (1.21.1); a doua doză de gentamicină la 36 h (1.20.4–5).
- APLV: dieta „cel puțin 6 luni sau până la 9–12 luni”; pragul CoMiSS nu e consensual (ESPGHAN 2024).
- Dexametazona în criza de wheezing: 1–2 zile (GINA 2026). Midazolam bucal la 3–6 luni doar în spital (RCP Buccolam).
- Constipație: probioticele nespecifice nu se recomandă; un amestec specific are recomandare condiționată (ESPGHAN/NASPGHAN 2026).
- Bronșiolită: factorii de risc care înclină spre trimitere (NG9 1.2.3). OMA: linia a doua la agravare după ≥2–3 zile (NG91).
