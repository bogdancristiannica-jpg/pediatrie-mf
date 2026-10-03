/* Scoruri clinice: stare + randare + decizie. Criteriile sunt în data/tools.js. */
/* Scoruri */
const SC = { centor: new Set(), fp: new Set(), cds: { a: 0, o: 0, m: 0, l: 0 }, crup: "", sem: new Set() };

function checks(name, items, set) {
  return items
    .map((t, i) => `<label class="ck"><input type="checkbox" name="${name}" value="${i}"${set.has(i) ? " checked" : ""}><span>${esc(t)}</span></label>`)
    .join("");
}
function scoreOut(k) {
  if (k === "centor") {
    const s = SC.centor.size;
    return `<strong>Centor ${s}/4</strong> — ${s <= 2 ? "fără antibiotic (NICE)." : "antibiotic imediat sau rețetă amânată (NICE); ESCMID: test antigenic rapid, antibiotic dacă e pozitiv."}`;
  }
  if (k === "fp") {
    const s = SC.fp.size;
    return `<strong>FeverPAIN ${s}/5</strong> — ${s <= 1 ? "fără antibiotic." : s <= 3 ? "fără antibiotic sau rețetă amânată." : "antibiotic imediat sau rețetă amânată."}`;
  }
  if (k === "cds") {
    const s = SC.cds.a + SC.cds.o + SC.cds.m + SC.cds.l;
    return `<strong>Scor ${s}/8</strong> — ${s === 0 ? "fără deshidratare." : s <= 4 ? "deshidratare ușoară: SRO 50 ml/kg în 4 h plus întreținere." : "deshidratare moderată sau severă: rehidratare supravegheată (SRO pe sondă sau IV), trimitere."}`;
  }
  if (k === "crup") {
    return SC.crup
      ? `<strong>${{ u: "Ușor", m: "Moderat", s: "Sever" }[SC.crup]}</strong> — dexametazonă 0,15 mg/kg oral, doză unică${SC.crup !== "u" ? "; observație 1–2 h după doză; internare dacă persistă efortul respirator, FR >60 sau aspect toxic" : "; acasă, cu instrucțiuni de revenire"}${SC.crup === "s" ? "; adrenalină nebulizată în spital" : ""}.`
      : "Alege nivelul.";
  }
  if (k === "sem") {
    const r = [...SC.sem].some((i) => i >= 100),
      a = [...SC.sem].some((i) => i < 100);
    return r
      ? "<strong>Roșu</strong> — risc înalt: examinare clinică în cel mult 2 h sau trimitere de urgență la pediatrie."
      : a
        ? "<strong>Galben</strong> — risc intermediar: evaluare față în față; plasă de siguranță sau trimitere dacă nu există diagnostic."
        : "<strong>Verde</strong> — risc scăzut: îngrijire la domiciliu, cu instrucțiuni de revenire.";
  }
}
function viewScores() {
  return `<div class="sec-h"><h2>Scoruri clinice</h2><span>bifează, decizia apare dedesubt</span></div>
  <div class="cards sc">
  <section class="card" data-sc="sem"><h3>Febra sub 5 ani: semaforul NICE</h3><p class="sub">Semne roșii</p>${checks("sem", RED, new Set([...SC.sem].filter((i) => i >= 100).map((i) => i - 100)))}<p class="sub">Semne galbene</p>${AMBER.map((t, i) => `<label class="ck"><input type="checkbox" name="semA" value="${i}"${SC.sem.has(i) ? " checked" : ""}><span>${esc(t)}</span></label>`).join("")}<p class="res" id="r-sem">${scoreOut("sem")}</p><p class="cs">NICE NG143</p></section>
  <section class="card" data-sc="centor"><h3>Centor</h3>${checks("centor", CENTOR, SC.centor)}<p class="res" id="r-centor">${scoreOut("centor")}</p><p class="cs">NICE NG84; ESCMID 2012. Sub 3 ani: testarea nu e indicată.</p></section>
  <section class="card" data-sc="fp"><h3>FeverPAIN</h3>${checks("fp", FP, SC.fp)}<p class="res" id="r-fp">${scoreOut("fp")}</p><p class="cs">NICE NG84</p></section>
  <section class="card" data-sc="cds"><h3>Scala clinică de deshidratare</h3>${CDS.map(([k, t, o]) => `<fieldset class="rad"><legend>${esc(t)}</legend>${o.map((x, i) => `<label class="ck"><input type="radio" name="cds-${k}" value="${i}"${SC.cds[k] === i ? " checked" : ""}><span>${i} · ${esc(x)}</span></label>`).join("")}</fieldset>`).join("")}<p class="res" id="r-cds">${scoreOut("cds")}</p><p class="cs">ESPGHAN/ESPID 2014 (scala Goldman)</p></section>
  <section class="card" data-sc="crup"><h3>Severitatea crupului</h3>${[
    ["u", "Ușor: tuse lătrătoare, fără stridor sau detresă în repaus"],
    ["m", "Moderat: stridor sau detresă în repaus"],
    ["s", "Sever: ca la moderat, plus agitație sau letargie"],
  ]
    .map(([v, t]) => `<label class="ck"><input type="radio" name="crup" value="${v}"${SC.crup === v ? " checked" : ""}><span>${esc(t)}</span></label>`)
    .join("")}<p class="res" id="r-crup">${scoreOut("crup")}</p><p class="cs">NHS Highland 2024</p></section>
  </div>`;
}
