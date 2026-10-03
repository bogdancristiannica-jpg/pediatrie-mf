# Securitate

Pagina este statică: nu are server de aplicație, cont, formular, cookie sau urmărire; nu prelucrează date personale sau
medicale ale pacienților. Singurele resurse externe sunt fonturile Google (cu fallback de sistem). Antetul
Content-Security-Policy din `dist/index.html` interzice orice alt script sau conexiune.

Dacă găsești o problemă de securitate (de exemplu conținut injectabil prin căutare sau prin adresa `#`), deschide un issue
cu eticheta `securitate` sau scrie responsabilului din `.github/CODEOWNERS`.
