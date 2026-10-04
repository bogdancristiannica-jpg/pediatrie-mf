/* Utilitare, randarea fișelor, căutare, interacțiune și navigare (rutare pe hash). Se încarcă ultimul. */
/* ───────── utilitare ───────── */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fmt = (s) =>
  esc(s)
    .replace(/(\d) (?=(mg|µg|g|ml|UI|UFC|h|zile|luni|ani|kg|min|mmol|µmol|%)\b)/g, "$1\u00a0")
    .replace(/\[\[(.+?)\]\]/g, '<span class="d">$1</span>')
    .replace(/\{\{(.+?)\}\}/g, '<span class="uv">$1</span>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ş/g, "s").replace(/ţ/g, "t");
const byId = Object.fromEntries(C.map((c) => [c.id, c]));
const plain = (c) => [c.n, c.alt, c.key, ...c.sym, ...c.dx, ...c.alarm, ...c.tx, ...c.no].join(" ");
const IDX = C.map((c) => ({ c, n: norm(c.n), h: norm(c.n + " " + c.alt), b: norm(plain(c)) }));
const tagHtml = (c) => (c.nou ? `<span class="tag">Nou ${esc(c.nou)}</span>` : "");
const ICON_ALARM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 21h20L12 3z"/><path d="M12 10v5M12 18h.01"/></svg>';

function list(items) {
  return "<ul>" + items.map((i) => `<li>${fmt(i)}</li>`).join("") + "</ul>";
}

function rows(cs) {
  if (!cs.length) return '<p class="empty">Nicio afecțiune nu corespunde căutării. Încearcă un simptom (de exemplu „stridor”) sau un medicament.</p>';
  return (
    '<ul class="rows">' +
    cs.map((c) => `<li><a href="#${c.id}"><span class="nm">${esc(c.n)} ${tagHtml(c)}</span><span class="ky">${fmt(c.key)}</span></a></li>`).join("") +
    "</ul>"
  );
}

function renderIndex(cur) {
  $("#idx").innerHTML = Object.keys(G)
    .map(
      (g) =>
        `<div class="grp"><h2>${G[g].t} · ${G[g].s}</h2><ul class="ilist">` +
        C.filter((c) => c.g === g)
          .map((c) => `<li><a href="#${c.id}"${c.id === cur ? ' aria-current="true"' : ""}>${esc(c.n)}${c.nou ? '<span class="tag">Nou</span>' : ""}</a></li>`)
          .join("") +
        "</ul></div>"
    )
    .join("");
}

function viewHome() {
  return (
    `<h1 class="vh">Fișe pediatrice 0–6 ani</h1><p class="lead">35 de afecțiuni frecvente, pe grupe de vârstă. Fiecare fișă are aceeași ordine: decizia-cheie (cu doza principală), semne de alarmă, simptome, diagnostic, tratament, ce nu se recomandă, sursa. Unelte: <a href="#calc">calculator de doze</a>, <a href="#scoruri">scoruri clinice</a>, <a href="#abx">antibiotice pe o pagină</a>, <a href="#alarma">semne de alarmă</a>, <a href="#excludere">excludere din colectivitate</a>.</p>` +
    Object.keys(G)
      .map((g) => `<div class="sec-h"><h2>${G[g].t}</h2><span>${G[g].s}</span></div>` + rows(C.filter((c) => c.g === g)))
      .join("")
  );
}

function viewGroup(g) {
  return `<div class="sec-h"><h1>${G[g].t}</h1><span>${G[g].s}</span></div>` + rows(C.filter((c) => c.g === g));
}

function viewSheet(c) {
  const sib = C.filter((x) => x.g === c.g),
    i = sib.indexOf(c);
  const prev = sib[i - 1],
    next = sib[i + 1];
  const srcs = c.src.map(([t, u]) => (u ? `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a></li>` : `<li>${esc(t)}</li>`)).join("");
  return `<article class="sheet">
    <p class="crumb"><a href="#${c.g}">← ${G[c.g].t} · ${G[c.g].s}</a></p>
    <h1>${esc(c.n)}</h1>
    ${c.nou ? `<p class="alt">${tagHtml(c)}</p>` : ""}
    <div class="key"><b>Decizia-cheie</b>${fmt(c.key)}</div>
    ${c.alarm.length ? `<section class="blk alarm"><h2>${ICON_ALARM}Semne de alarmă / trimitere</h2>${list(c.alarm)}</section>` : ""}
    <section class="blk"><h2>Simptome</h2>${list(c.sym)}</section>
    <section class="blk"><h2>Diagnostic</h2>${list(c.dx)}</section>
    <section class="blk tx"><h2>Tratament</h2>${list(c.tx)}</section>
    ${c.no.length ? `<section class="blk no"><h2>Nu se recomandă</h2>${list(c.no)}</section>` : ""}
    <div class="src"><strong>Sursa</strong><ul>${srcs}</ul>${c.note ? `<p>${fmt(c.note)}</p>` : ""}${c.uv ? `<p><span class="uv">Neverificat</span> ${fmt(c.uv)}</p>` : ""}</div>
    <nav class="pager" aria-label="Afecțiuni din aceeași grupă">
      ${prev ? `<a href="#${prev.id}">← ${esc(prev.n)}</a>` : "<span></span>"}
      ${next ? `<a href="#${next.id}">${esc(next.n)} →</a>` : ""}
    </nav>
  </article>`;
}

function viewNews() {
  return (
    `<div class="sec-h"><h1>Ce s-a schimbat (2024–2026)</h1></div>
  <p class="lead">Schimbările față de practica obișnuită, de la cea mai recentă.</p>
  <div class="tw news"><table><thead><tr><th>Când</th><th>Afecțiune</th><th>Ce e nou</th></tr></thead><tbody>` +
    NEWS.map(([d, n, t, id]) => `<tr><td style="white-space:nowrap">${esc(d)}</td><td><a href="#${id}">${esc(n)}</a></td><td>${esc(t)}</td></tr>`).join("") +
    "</tbody></table></div>"
  );
}

function viewSources() {
  const L = (t, u) => (u ? `<li><a href="${u}" target="_blank" rel="noopener">${t}</a></li>` : `<li>${t}</li>`);
  return `<div class="prose">
  <div class="sec-h"><h1>Surse și perimetru</h1></div>
  <p class="lead">Sursele au fost deschise și citite pe 3 octombrie 2026. Fiecare fișă își citează sursa la final.</p>
  <h2>Am verificat</h2>
  <ul><li>Versiunea în vigoare a fiecărui ghid citat.</li><li>Criteriile de diagnostic, schemele și dozele de tratament, așa cum apar în ghid sau în RCP.</li><li>RCP-urile românești pentru Vermox, Vermigal Novo, diazepam intrarectal și antipireticele de la febră.</li></ul>
  <h2>Nu am verificat</h2>
  <ul><li>NICE CKS și BNFC (accesibile doar din Regatul Unit).</li><li>RCP-urile românești ale celorlalte produse; vârstele de autorizare din România pot diferi de cele din Regatul Unit.</li><li>Disponibilitatea în România a cremei cu peroxid de hidrogen 1%, a flucloxacilinei orale, a nistatinei suspensie și a dimeticonei 4%.</li><li>O eventuală recomandare ESPID pentru nirsevimab.</li><li>Doza exactă de amoxicilină din consensul spaniol SEIP 2023 pentru OMA.</li><li>Dozele pe kg de midazolam și diazepam (revizia italiană dă 0,5 mg/kg pentru midazolam, în dezacord cu RCP-ul).</li><li>Recomandările de conduită din Rome V; textul integral WAO DRACMA.</li></ul>
  <h2>Societăți europene și internaționale</h2>
  <ul>${[
    ["ESPGHAN, alergia la laptele de vacă, 2024", "https://pubmed.ncbi.nlm.nih.gov/38374567/"],
    ["WAO DRACMA, formule, 2024", "https://pubmed.ncbi.nlm.nih.gov/38706757/"],
    ["NASPGHAN/ESPGHAN, refluxul, 2018", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5958910/"],
    ["ESPGHAN/ESPID, gastroenterita acută, 2014 (Guarino, JPGN 2014;59:132–152)", ""],
    ["ESPGHAN, probioticele, 2023 (Szajewska, JPGN 2023;76:232–247)", ""],
    ["ESPGHAN/NASPGHAN, constipația funcțională, 2026", "https://europepmc.org/article/PMC/PMC13446596"],
    ["ESPGHAN, anemia în bolile digestive, 2025", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11874238/"],
    ["Rome V, 2026", "https://theromefoundation.org/rome-v-criteria/"],
    ["EAU/ESPU, urologie pediatrică, 2026", "https://uroweb.org/guidelines/paediatric-urology/chapter/urinary-tract-infections-in-children"],
    ["EuroGuiDerm, eczema atopică, v4.1, 2026", "https://guidelines.edf.one/guidelines/atopic-ezcema"],
    ["Ghidul internațional al urticariei, 2026", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC13466004/"],
    ["ESCMID, faringita acută, 2012", "https://pubmed.ncbi.nlm.nih.gov/22432746/"],
    ["ERS, wheezingul preșcolar (declarație), 2024", "https://pubmed.ncbi.nlm.nih.gov/38843917/"],
    ["EPOS 2020, rinosinuzitele", "https://www.rhinologyjournal.com/Documents/Supplements/EPOS2020_executive_summary.pdf"],
    ["GINA 2026", "https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf"],
    ["ECDC; EMA; OMS", ""],
  ]
    .map(([t, u]) => L(esc(t), u))
    .join("")}</ul>
  <h2>NICE (Regatul Unit)</h2>
  <ul>${[
    ["CG98 icterul neonatal", "cg98"],
    ["NG195 infecția neonatală", "ng195"],
    ["NG1 refluxul", "ng1"],
    ["NG143 febra sub 5 ani", "ng143"],
    ["NG91 otita medie acută", "ng91"],
    ["NG9 bronșiolita", "ng9"],
    ["NG84 faringita", "ng84"],
    ["NG250 pneumonia", "ng250"],
    ["NG245 astmul", "ng245"],
    ["CG84 gastroenterita", "cg84"],
    ["NG224 și NG111 infecția urinară", "ng224"],
    ["NG153 impetigo", "ng153"],
  ]
    .map(([t, n]) => L(esc(t), NICE(n)))
    .join("")}</ul>
  <h2>Alte surse</h2>
  <ul>${[
    [
      "UKHSA: scarlatina, 2023; excluderea din colectivități, 2026",
      "https://www.gov.uk/government/publications/scarlet-fever-managing-outbreaks-in-schools-and-nurseries",
    ],
    [
      "NHS Highland, crupul, 2024",
      "https://www.rightdecisions.scot.nhs.uk/tam-treatments-and-medicines-nhs-highland/paediatric-therapeutic-guidelines/respiratory-paediatric-guidelines/croup-paediatric-guidelines/",
    ],
    ["Cochrane: crup 2023, crusta de lapte 2019, conjunctivita 2023, varicela", ""],
    ["AAPOS, obstrucția lacrimonazală, 2025", "https://aapos.org/glossary/nasolacrimal-duct-obstruction"],
    ["PCDS, dermatita de scutec, 2023", "https://www.pcds.org.uk/clinical-guidance/eczema-napkin-eczema"],
    ["Revizia italiană, convulsiile febrile, 2024", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11089695/"],
    ["RCP: miconazol, nistatină (UK); Buccolam (UE); Vermox, Vermigal Novo, diazepam, paracetamol, ibuprofen (RO)", ""],
    ["NHS.uk: roseola, eritemul infecțios, boala mână-gură-picior, varicela, conjunctivita, oxiuriaza, pediculoza, molluscum", ""],
  ]
    .map(([t, u]) => L(esc(t), u))
    .join("")}</ul>
  </div>`;
}

function viewSearch(q) {
  const nq = norm(q.trim());
  const terms = nq
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => (t.length > 5 ? t.slice(0, -2) : t));
  const ws = (str, t) => str.split(/[^a-z0-9]+/).some((w) => w.startsWith(t));
  const sc = (x) => (terms.every((t) => ws(x.n, t)) ? 3 : terms.every((t) => ws(x.h, t)) ? 2 : terms.every((t) => x.h.includes(t)) ? 1 : 0);
  const hits = IDX.filter((x) => terms.every((t) => x.b.includes(t))).sort((a, b) => sc(b) - sc(a));
  return (
    `<div class="sec-h"><h1>Rezultate pentru „${esc(q.trim())}”</h1><span role="status">${hits.length} ${hits.length === 1 ? "rezultat" : "rezultate"}</span></div>` +
    rows(hits.map((x) => x.c))
  );
}

/* interacțiune unelte */
document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.closest("#calc")) {
    CALC.w = $("#cw").value;
    CALC.y = $("#cy").value;
    CALC.m = $("#cm").value;
    CALC.pc = $("#cpc").value;
    CALC.ic = $("#cic").value;
    $("#calc-out").innerHTML = calcOut();
    return;
  }
  const card = t.closest("[data-sc]");
  if (!card) return;
  const k = card.dataset.sc;
  if (k === "sem") {
    SC.sem = new Set(
      [...card.querySelectorAll('input[name="sem"]:checked')]
        .map((i) => +i.value + 100)
        .concat([...card.querySelectorAll('input[name="semA"]:checked')].map((i) => +i.value))
    );
  } else if (k === "centor" || k === "fp") {
    SC[k] = new Set([...card.querySelectorAll("input:checked")].map((i) => +i.value));
  } else if (k === "cds") {
    CDS.forEach(([c]) => {
      const r = card.querySelector(`input[name="cds-${c}"]:checked`);
      SC.cds[c] = r ? +r.value : 0;
    });
  } else if (k === "crup") {
    const r = card.querySelector("input:checked");
    SC.crup = r ? r.value : "";
  }
  $("#r-" + k).innerHTML = scoreOut(k);
});

/* ───────── navigare ───────── */
let lastRoute = "";
function route() {
  const h = (location.hash || "#acasa").slice(1);
  const q = $("#q").value;
  let html,
    cur = "",
    tab = "";
  if (q.trim()) {
    html = viewSearch(q);
  } else if (byId[h]) {
    html = viewSheet(byId[h]);
    cur = h;
    tab = byId[h].g;
  } else if (G[h]) {
    html = viewGroup(h);
    tab = h;
  } else if (h === "noutati") {
    html = viewNews();
    tab = h;
  } else if (h === "calc") {
    html = viewCalc();
    tab = h;
  } else if (h === "scoruri") {
    html = viewScores();
    tab = h;
  } else if (h === "abx") {
    html = viewAbx();
    tab = h;
  } else if (h === "alarma") {
    html = viewAlarm();
    tab = h;
  } else if (h === "excludere") {
    html = viewExcl();
    tab = h;
  } else if (h === "surse") {
    html = viewSources();
    tab = h;
  } else {
    html = viewHome();
    tab = "acasa";
  }
  $("#main").innerHTML =
    html +
    `<p class="foot">Ghiduri în vigoare la 3 octombrie 2026. Dozele sunt orientative; se confirmă în RCP-ul produsului disponibil în România. Versiunea __BUILD_VERSION__.</p>`;
  document.querySelectorAll(".tabs a").forEach((a) => {
    if (a.dataset.v === tab) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  renderIndex(cur);
  const r = q.trim() ? "q" : h;
  if (r !== lastRoute && !q.trim() && document.activeElement !== qEl) {
    window.scrollTo(0, 0);
    if (byId[h]) $("#main").focus({ preventScroll: true });
  }
  const at = document.querySelector(".tabs [aria-current]");
  if (at && at.scrollIntoView) at.scrollIntoView({ inline: "nearest", block: "nearest" });
  lastRoute = r;
  const t = byId[h] && !q.trim() ? byId[h].n + " · Fișe pediatrice" : "Fișe pediatrice 0–6 ani";
  document.title = t;
}

const qEl = $("#q"),
  qc = $("#qclear");
qEl.addEventListener("input", () => {
  qc.hidden = !qEl.value;
  route();
});
qc.addEventListener("click", () => {
  qEl.value = "";
  qc.hidden = true;
  route();
  qEl.focus();
});
qEl.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    qEl.value = "";
    qc.hidden = true;
    route();
  }
  if (e.key === "Enter") {
    const a = $("#main .rows a");
    if (a) {
      e.preventDefault();
      const id = a.getAttribute("href");
      qEl.value = "";
      qc.hidden = true;
      if (location.hash === id) route();
      else location.hash = id;
      qEl.blur();
    }
  }
});
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (a && qEl.value) {
    qEl.value = "";
    qc.hidden = true;
    if (location.hash === a.getAttribute("href")) {
      e.preventDefault();
      route();
    }
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== qEl && !e.metaKey && !e.ctrlKey) {
    e.preventDefault();
    qEl.focus();
  }
});
window.addEventListener("hashchange", () => {
  if (qEl.value) {
    qEl.value = "";
    qc.hidden = true;
  }
  route();
});
$(".skip").addEventListener("click", (e) => {
  e.preventDefault();
  $("#main").focus();
});
document.documentElement.lang = "ro";
route();
