# Cum contribui

## Conținut clinic

Orice corectură de doză, prag sau recomandare se face cu sursa primară deschisă (ghidul în vigoare sau RCP-ul autorizat
în România), citată în fișă (`src`), în `docs/SURSE.md` și în `CHANGELOG.md`. Procedura completă:
[.claude/skills/verificare-surse/SKILL.md](.claude/skills/verificare-surse/SKILL.md). Fără sursă, PR-ul nu se aprobă.

Dacă nu vrei să editezi codul, deschide un issue cu șablonul „Corectură de conținut clinic”.

## Cod

1. Ramură din `main`: `feat/...`, `fix/...` sau `clinic/<id-fisa>`.
2. `npm ci`, apoi lucrezi; `npm run dev` pentru previzualizare.
3. Înainte de push: `npm run check` (validare, lint, build, teste unitare, teste e2e).
4. Pull request cu șablonul completat. CI trebuie să fie verde; `main` se actualizează doar prin PR.

## Stil

- Diacritice cu virgulă (ș, ț). Terminologie medicală românească; fără calcuri din engleză.
- Fără dependențe la rulare; scripturile de build rămân fără dependențe npm.
- Toate culorile sunt tokeni în `:root` cu variantă întunecată; text curent ≥16 px; ținte de atingere ≥44 px.
- Mesaje de commit: prima linie spune ce s-a schimbat și, pentru conținut clinic, sursa.
