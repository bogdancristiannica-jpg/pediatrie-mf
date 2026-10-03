/* Pagini de referință: antibiotice, semne de alarmă, excludere. Datele sunt în data/tools.js. */
/* Antibiotice pe o pagină */
function viewAbx() {
  return (
    `<div class="sec-h"><h2>Antibiotice pe o pagină</h2><span>copii 0–6 ani</span></div>
  <p class="lead">Când se dă antibiotic, ce, cât și cât timp. Fiecare rând trimite la fișa completă.</p>
  <div class="cards">` +
    ABX.map(
      ([n, id, when, first, dur, alg, second, src]) => `<article class="card"><h3><a href="#${id}">${esc(n)}</a></h3>
   <dl><dt>Când</dt><dd>${esc(when)}</dd><dt>Prima linie</dt><dd>${esc(first)}</dd><dt>Durată</dt><dd>${esc(dur)}</dd><dt>Alergie la penicilină</dt><dd>${esc(alg)}</dd>${second !== "—" ? `<dt>Linia a doua / observații</dt><dd>${esc(second)}</dd>` : ""}</dl><p class="cs">${esc(src)}</p></article>`
    ).join("") +
    "</div>"
  );
}

/* Semne de alarmă pe o pagină */
function viewAlarm() {
  return (
    `<div class="sec-h"><h2>Semne de alarmă și trimitere</h2><span>toate fișele</span></div>
  <p class="lead">Util la triajul telefonic. Fiecare bloc trimite la fișa lui.</p>` +
    Object.keys(G)
      .map(
        (g) =>
          `<h2 class="calc-g">${G[g].t} · ${G[g].s}</h2><div class="cards">` +
          C.filter((c) => c.g === g && c.alarm.length)
            .map(
              (c) =>
                `<article class="card al"><h3><a href="#${c.id}">${esc(c.n)}</a></h3><ul>${c.alarm.map((a) => `<li>${fmt(a)}</li>`).join("")}</ul></article>`
            )
            .join("") +
          "</div>"
      )
      .join("")
  );
}

/* Excludere din colectivitate */
function viewExcl() {
  return (
    `<div class="sec-h"><h2>Excludere din colectivitate</h2><span>grădiniță, creșă, școală</span></div>
  <p class="lead">Perioadele sunt cele din ghidul UKHSA (Regatul Unit, 7 septembrie 2026) și NHS pentru roseola și molluscum. <span class="uv">Neverificat</span> regulile DSP din România pot diferi.</p>
  <div class="tw"><table><thead><tr><th>Boala</th><th>Cât stă acasă</th></tr></thead><tbody>` +
    EXCL.map(([n, id, t]) => `<tr><td>${id ? `<a href="#${id}">${esc(n)}</a>` : esc(n)}</td><td>${esc(t)}</td></tr>`).join("") +
    "</tbody></table></div>"
  );
}
