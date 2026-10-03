---
name: verificare-surse
description: Procedura obligatorie pentru orice schimbare de conținut clinic (doză, prag, recomandare, semn de alarmă) — verificare în sursa primară, citare în fișă și în docs/SURSE.md, marcare a ce nu s-a putut verifica. Folosește-l înainte de a edita src/data/conditions.js sau src/data/tools.js.
---

# Verificarea surselor pentru conținut clinic

Regula zero a proiectului: **nicio doză, niciun prag, nicio recomandare nu se scrie din memorie.** Memoria unui model
e mai veche decât ghidul și greșește exact acolo unde contează (cifre, unități, vârste).

## Ierarhia surselor

1. Ghidul societății europene de specialitate (ESPGHAN, ESPID, ERS, EAACI, EAU/ESPU, EuroGuiDerm, ESCMID, EPOS), versiunea în vigoare.
2. NICE (Regatul Unit), când nu există ghid european actual. NICE CKS și BNFC nu se pot deschide din afara Regatului Unit: ce vine doar de acolo rămâne „neverificat”.
3. RCP-ul (Rezumatul caracteristicilor produsului) autorizat în România, pentru doze, vârste minime și contraindicații: nomenclatorul ANMDMR, https://nomenclator.anm.ro/medicamente.
4. Studii primare și Cochrane, doar ca sprijin pentru o recomandare din ghid.

Bloguri, rezumate SEO, pagini de farmacie, „ce se face de obicei”: nu sunt surse.

## Procedura

1. Deschide documentul (WebFetch sau curl prin proxy; PDF → `pdftotext`). Un fragment de căutare nu e sursă.
2. Găsește recomandarea exactă; notează numărul recomandării sau pagina și citatul.
3. Scrie în fișă în limbajul ghidului: unități ca în sursă (µmol/L cu mg/dL în paranteză; mg/kg; ml pentru concentrația dată), intervalul, durata, plafonul.
4. Marchează doza cu `[[...]]`. Ce nu ai putut verifica: `{{...}}` în text și câmpul `uv` al fișei.
5. Actualizează câmpul `src` al fișei (titlu + an + adresă), `docs/SURSE.md` și `CHANGELOG.md`.
6. Rulează `npm run validate` și `npm test`. Dacă ai schimbat o doză pe kg, adaugă sau ajustează un test în `tests/unit/calc.test.mjs` calculat de mână.
7. În mesajul de commit: ce s-a schimbat și sursa, în prima linie.

## Formulări

- Perimetrul explicit la final: „Am verificat: X, Y. NU am verificat: Z.” Un verdict fără perimetru se respinge.
- Fără avertismente deontologice în text; conformitatea o gestionează medicul responsabil.
- Diacritice cu virgulă (ș, ț), nu cu sedilă.
