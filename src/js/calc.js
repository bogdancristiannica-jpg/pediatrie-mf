/* Calculator de doze. Funcțiile de calcul sunt pure (fără DOM) ca să poată fi testate în Node. */
const CALC = { w: "", y: "", m: "", pc: "24", ic: "20" };
const nf = (x, d) => Number(x).toLocaleString("ro-RO", { minimumFractionDigits: 0, maximumFractionDigits: d });
const mg = (x) => (x < 10 ? nf(x, 1) : nf(Math.round(x), 0));
const ml = (x) => (x < 10 ? nf(Math.round(x * 10) / 10, 1) : nf(Math.round(x * 2) / 2, Number.isInteger(Math.round(x * 2) / 2) ? 0 : 1));
const rng = (a, b, f) => f(a) + "–" + f(b);
function ageMonths() {
  if (CALC.y === "" && CALC.m === "") return null;
  return (+CALC.y || 0) * 12 + (+CALC.m || 0);
}
function ageLabel(am) {
  if (am === null) return "";
  const y = Math.floor(am / 12),
    m = am % 12;
  return (y ? y + " ani" : "") + (y && m ? " " : "") + (m || !y ? m + " luni" : "");
}

function calcGroups(w, am) {
  const pc = +CALC.pc,
    ic = +CALC.ic,
    G = [];
  // Antipiretice
  const para = {
    n: "Paracetamol oral",
    lines: [
      `Doză: [[${rng(w * 10, w * 15, mg)} mg]] = [[${rng((w * 10) / pc, (w * 15) / pc, ml)} ml]] din ${pc === 24 ? "120 mg/5 ml" : "240 mg/5 ml"} (10–15 mg/kg), la 4–6 h; minimum 4 h între doze; maximum 4 doze în 24 h.`,
      `Maxim zilnic: [[${mg(w * 60)} mg]] = [[${ml((w * 60) / pc)} ml]] (60 mg/kg/zi; unele RCP permit 80 mg/kg/zi sub 37 kg).`,
      "Reevaluare medicală dacă febra durează peste 3 zile.",
    ],
    warn: [],
    src: "RCP RO 2019–2025: Panadol Baby, Bioflu Baby, Paracetamol TIS",
  };
  if (am !== null && am < 1)
    para.warn.push("Sub 1 lună: doar la recomandarea medicului (Bioflu Baby: peste 4 kg, născut la termen; 10 mg/kg/doză, 5 mg/kg dacă e icteric).");
  else if (am !== null && am < 3)
    para.warn.push("1–3 luni: doar la recomandarea medicului; Panadol Baby o limitează la febra post-vaccinare, maximum 2 doze la ≥4 h.");
  if (pc === 48) para.warn.push("Concentrația 240 mg/5 ml: RCP-ul românesc nu a fost deschis; calculul e aritmetic.");
  const supo = { n: "Paracetamol supozitoare (Paracetamol Atb 125 mg)", lines: [], warn: [], src: "RCP RO, rev. apr. 2025" };
  if (am === null)
    supo.lines.push(
      "Introdu vârsta: dozele sunt pe benzi de vârstă. 6–12 luni (7–10 kg): 125 mg ×1–4/zi, maximum 500 mg/zi; 1–3 ani (10–15 kg): 250 mg ×1–3/zi, maximum 750 mg/zi; 3–6 ani (15–22 kg): 250 mg ×1–4/zi, maximum 1000 mg/zi."
    );
  else if (am < 6) supo.lines.push("Sub 6 luni: această concentrație nu este adecvată.");
  else if (am < 12) supo.lines.push("[[125 mg]] de 1–4 ori/zi, la 4–6 h; maximum [[500 mg/zi]] (7–10 kg).");
  else if (am < 36) supo.lines.push("[[250 mg]] de 1–3 ori/zi, la 4–8 h; maximum [[750 mg/zi]] (10–15 kg).");
  else if (am < 72) supo.lines.push("[[250 mg]] de 1–4 ori/zi; maximum [[1000 mg/zi]] (15–22 kg).");
  else supo.lines.push("Peste 6 ani: în afara fișelor.");
  const ibu = {
    n: "Ibuprofen oral",
    lines: [
      `Doză unică maximum [[${mg(w * 10)} mg]] = [[${ml((w * 10) / ic)} ml]] din ${ic === 20 ? "100 mg/5 ml" : "200 mg/5 ml"} (10 mg/kg).`,
      `Pe zi: [[${rng(w * 20, w * 30, mg)} mg]] (20–30 mg/kg/zi) în 3–4 prize, la 6–8 h; minimum 4 h între doze. În 3 prize: [[${rng((w * 20) / 3, w * 10, mg)} mg/doză]] = [[${rng((w * 20) / 3 / ic, (w * 10) / ic, ml)} ml]].`,
      "Contraindicat în deshidratarea semnificativă (risc de insuficiență renală); de evitat în varicelă; poate masca o infecție.",
    ],
    warn: [],
    src: "RCP RO 2022–2025: Nurofen pentru copii, Ibufen Baby, Paduden; Nurofen supozitoare (doza unică)",
  };
  if (am !== null && am < 3) ibu.warn.push("Sub 3 luni: nu se administrează.");
  if (w < 5) ibu.warn.push("Sub 5 kg: nu se administrează.");
  if (am !== null && am >= 3 && am < 6) ibu.lines.push("3–6 luni: consult medical dacă simptomele persistă peste 24 h.");
  if (am !== null && am >= 6) ibu.lines.push("Peste 6 luni: consult medical dacă simptomele persistă peste 3 zile.");
  if (am !== null && am >= 3)
    ibu.lines.push(
      "Doză fixă din RCP (Nurofen pentru copii), pe vârstă: " +
        (am < 12
          ? "[[50 mg ×3/zi]] (3–12 luni, 5–9 kg)"
          : am < 48
            ? "[[100 mg ×3/zi]] (1–3 ani, 10–16 kg)"
            : am < 84
              ? "[[150 mg ×3/zi]] (4–6 ani, 17–20 kg)"
              : "peste 6 ani: în afara fișelor") +
        "."
    );
  if (ic === 40) ibu.warn.push("Concentrația 200 mg/5 ml: RCP-ul românesc nu a fost deschis; calculul e aritmetic.");
  G.push({ t: "Antipiretice", items: [para, supo, ibu] });

  // Antibiotice
  const amox = { n: "Amoxicilină (OMA, pneumonie)", lines: [], warn: [], src: "NICE NG91 (OMA), NG250 (pneumonie); CAP-IT, JAMA 2021" };
  const band =
    am === null ? null : am < 1 ? "sub 1 lună: în afara tabelului NICE" : am < 12 ? "[[125 mg ×3/zi]]" : am < 60 ? "[[250 mg ×3/zi]]" : "[[500 mg ×3/zi]]";
  amox.lines.push(
    band
      ? `Doză NICE pe vârstă (${ageLabel(am)}): ${band}.`
      : "Doză NICE pe vârstă: 1–11 luni [[125 mg ×3/zi]]; 1–4 ani [[250 mg ×3/zi]]; 5–11 ani [[500 mg ×3/zi]]."
  );
  amox.lines.push(`Verificare pe kg (CAP-IT, 35–50 mg/kg/zi): [[${rng(w * 35, w * 50, mg)} mg/zi]] = [[${rng((w * 35) / 3, (w * 50) / 3, mg)} mg ×3/zi]].`);
  amox.lines.push("Durată: OMA [[5–7 zile]]; pneumonie non-severă [[3 zile]] (la 1–2 luni: 5 zile), se prelungește dacă nu e stabil clinic.");
  const coam = {
    n: "Amoxicilină-clavulanat (linia a doua în OMA)",
    lines: [
      `Suspensie 125/31: [[${ml(w * 0.25)} ml ×3/zi]] (0,25 ml/kg) la 1–11 luni; la 1–5 ani [[5 ml ×3/zi]] sau 0,25 ml/kg; la 6–11 ani suspensie 250/62 [[5 ml ×3/zi]] sau 0,15 ml/kg ([[${ml(w * 0.15)} ml]]). Durată [[5–7 zile]].`,
    ],
    warn: [],
    src: "NICE NG91",
  };
  const clar = { n: "Claritromicină (alergie la penicilină)", lines: [], warn: [], src: "NICE NG91, NG153" };
  clar.lines.push(
    w < 8
      ? `[[${mg(w * 7.5)} mg ×2/zi]] (7,5 mg/kg, sub 8 kg).`
      : w < 12
        ? "[[62,5 mg ×2/zi]] (8–11 kg)."
        : w < 20
          ? "[[125 mg ×2/zi]] (12–19 kg)."
          : w < 30
            ? "[[187,5 mg ×2/zi]] (20–29 kg)."
            : "Peste 30 kg: în afara fișelor."
  );
  clar.lines.push("Durată: OMA și impetigo [[5 zile]] (OMA 5–7); faringită [[5 zile]]; scarlatină [[10 zile]]; pneumonie [[3 zile]].");
  const penv = { n: "Penicilină V (faringită SGA, scarlatină)", lines: [], warn: [], src: "NICE NG84; UKHSA 2023; ESCMID 2012" };
  const pb =
    am === null
      ? null
      : am < 1
        ? "sub 1 lună: în afara tabelului"
        : am < 12
          ? "[[62,5 mg ×4/zi]] sau [[125 mg ×2/zi]]"
          : am < 72
            ? "[[125 mg ×4/zi]] sau [[250 mg ×2/zi]]"
            : "[[250 mg ×4/zi]] sau [[500 mg ×2/zi]]";
  penv.lines.push(
    pb
      ? `Doză pe vârstă (${ageLabel(am)}): ${pb}.`
      : "1–11 luni [[62,5 mg ×4/zi]] sau [[125 mg ×2/zi]]; 1–5 ani [[125 mg ×4/zi]] sau [[250 mg ×2/zi]]; 6–11 ani [[250 mg ×4/zi]] sau [[500 mg ×2/zi]]."
  );
  penv.lines.push("Durată: faringită [[5–10 zile]] (NICE; ESCMID: 10); scarlatină [[10 zile]].");
  const flux = { n: "Flucloxacilină (impetigo bulos sau extins)", lines: [], warn: [], src: "NICE NG153" };
  const fb = am === null ? null : am < 1 ? "sub 1 lună: în afara tabelului" : am < 24 ? "[[62,5–125 mg ×4/zi]]" : "[[125–250 mg ×4/zi]]";
  flux.lines.push(
    fb
      ? `Doză pe vârstă (${ageLabel(am)}): ${fb}, [[5 zile]] (până la 7).`
      : "1 lună–1 an [[62,5–125 mg ×4/zi]]; 2–9 ani [[125–250 mg ×4/zi]]; [[5 zile]] (până la 7)."
  );
  if (am !== null && am >= 12 && am < 24) flux.warn.push("NICE dă benzile „1 lună–1 an” și „2–9 ani”; între ele se alege după greutate (BNFc neverificat).");
  const azi = {
    n: "Azitromicină (GEA cu Shigella)",
    lines: [`Ziua 1: [[${mg(w * 12)} mg]] (12 mg/kg); zilele 2–5: [[${mg(w * 6)} mg/zi]] (6 mg/kg).`],
    warn: [],
    src: "ESPGHAN/ESPID 2014",
  };
  G.push({ t: "Antibiotice", items: [amox, coam, clar, penv, flux, azi] });

  // Corticoizi
  const dexc = {
    n: "Dexametazonă, crup",
    lines: [`[[${mg(w * 0.15)} mg]] oral, doză unică (0,15 mg/kg), la orice severitate. Sursa nu precizează un plafon.`],
    warn: [],
    src: "NHS Highland 2024; Cochrane 2023",
  };
  const predc = {
    n: "Prednisolon, crup (dacă nu există dexametazonă)",
    lines: [`[[${mg(w * 1)} mg/zi]] (1 mg/kg), [[2 zile]].`],
    warn: [],
    src: "NHS Highland 2024",
  };
  const capP = am === null ? null : am < 24 ? 20 : 30;
  const p1 = Math.min(w * 1, capP ?? 1e9),
    p2 = Math.min(w * 2, capP ?? 1e9);
  const predw = {
    n: "Prednisolon, criză de wheezing moderată sau severă",
    lines: [
      `[[${rng(p1, p2, mg)} mg/zi]] (1–2 mg/kg)${capP ? ` — plafon ${capP} mg la ${am < 24 ? "sub 2 ani" : "2–5 ani"}` : " — plafon 20 mg sub 2 ani, 30 mg la 2–5 ani"}; [[3–5 zile]].`,
      `Alternativă: dexametazonă [[${rng(Math.min(w * 0.3, 12), Math.min(w * 0.6, 12), mg)} mg]] (0,3–0,6 mg/kg, maximum 12 mg).`,
      "Doar în criza moderată sau severă; nu se inițiază de părinți.",
    ],
    warn: [],
    src: "GINA 2026",
  };
  const adr = {
    n: "Adrenalină nebulizată 1:1000, crup (spital)",
    lines: [`[[${ml(Math.min(w * 0.4, 5))} ml]] = ${mg(Math.min(w * 0.4, 5))} mg (400 µg/kg, maximum 5 mg).`],
    warn: [],
    src: "NHS Highland 2024",
  };
  G.push({ t: "Corticoizi și adrenalină", items: [dexc, predc, predw, adr] });

  // Digestiv și fier
  const sro = {
    n: "Săruri de rehidratare orală (deshidratare ușoară–moderată)",
    lines: [
      `[[${mg(w * 50)} ml în 4 h]] (50 ml/kg), plus necesarul de întreținere; soluție hipoosmolară (Na 50–60 mmol/L). ESPGHAN: 40–50 ml/kg în 3–6 h pe sondă nazogastrică dacă nu bea.`,
    ],
    warn: [],
    src: "NICE CG84; ESPGHAN/ESPID 2014",
  };
  const peg = {
    n: "PEG (macrogol), constipație funcțională",
    lines: [
      `Dezimpactare: [[${rng(w * 1, w * 1.5, mg)} g/zi]] (1–1,5 g/kg/zi), maximum [[6 zile]].`,
      `Întreținere: [[${rng(w * 0.4, w * 0.8, mg)} g/zi]] (0,4–0,8 g/kg/zi), [[≥2 luni]] și ≥1 lună fără simptome, apoi scădere treptată.`,
    ],
    warn: [],
    src: "ESPGHAN/NASPGHAN 2026",
  };
  const fe = {
    n: "Fier elemental oral, anemie feriprivă",
    lines: [
      `[[${rng(Math.min(w * 2, 100), Math.min(w * 6, 100), mg)} mg/zi]] (2–6 mg/kg/zi, maximum 100 mg/zi), o dată pe zi, [[8–12 săptămâni]]. Control Hb la 2–4 săptămâni.`,
      "Atenție: doza e în fier elemental; preparatele indică separat conținutul de fier elemental și cel de sare.",
    ],
    warn: [],
    src: "ESPGHAN 2025",
  };
  G.push({ t: "Digestiv și fier", items: [sro, peg, fe] });

  // Pe vârstă
  const bz = { n: "Convulsie febrilă peste 5 minute (pe vârstă)", lines: [], warn: [], src: "RCP Buccolam (UE); RCP diazepam intrarectal (RO)" };
  if (am === null)
    bz.lines.push("Midazolam bucal: [[2,5 mg]] la 3 luni–<1 an, [[5 mg]] la 1–<5 ani. Diazepam intrarectal: [[5 mg]] până la 3 ani, [[10 mg]] peste 3 ani.");
  else {
    bz.lines.push(
      am < 3
        ? "Midazolam bucal: sub 3 luni, în afara RCP."
        : am < 6
          ? "Midazolam bucal [[2,5 mg]] (3–6 luni: doar în spital)."
          : am < 12
            ? "Midazolam bucal [[2,5 mg]] (6 luni–<1 an)."
            : am < 60
              ? "Midazolam bucal [[5 mg]] (1–<5 ani)."
              : "Midazolam bucal: peste 5 ani, în afara fișelor (RCP: 7,5 mg la 5–<10 ani, neverificat aici)."
    );
    bz.lines.push(am <= 36 ? "Diazepam intrarectal [[5 mg]] (până la 3 ani)." : "Diazepam intrarectal [[10 mg]] (peste 3 ani).");
  }
  const desl = {
    n: "Desloratadină, urticarie acută (pe vârstă)",
    lines: [
      am === null
        ? "[[1,25 mg/zi]] la 1–5 ani; [[2,5 mg/zi]] la 6–11 ani; sub 1 an: neautorizată."
        : am < 12
          ? "Sub 1 an: neautorizată."
          : am < 72
            ? "[[1,25 mg/zi]] (1–5 ani)."
            : "[[2,5 mg/zi]] (6–11 ani).",
    ],
    warn: [],
    src: "Ghidul internațional al urticariei 2026; RCP Aerius (UE)",
  };
  G.push({ t: "Pe vârstă", items: [bz, desl] });
  return G;
}

function calcOut() {
  const w = parseFloat(String(CALC.w).replace(",", "."));
  const am = ageMonths();
  if (!CALC.w) return '<p class="empty">Introdu greutatea. Vârsta este opțională, dar activează avertismentele și dozele pe benzi de vârstă.</p>';
  if (!(w >= 1 && w <= 40)) return '<p class="empty">Greutatea trebuie să fie între 1 și 40 kg.</p>';
  const head = `<p class="calc-sum">Pentru <strong>${nf(w, Number.isInteger(w) ? 0 : 1)} kg</strong>${am !== null ? `, <strong>${ageLabel(am)}</strong>` : ""}. Dozele sunt aritmetice, din sursele de pe fiecare rând; verifică plafoanele și RCP-ul produsului.</p>`;
  return (
    head +
    calcGroups(w, am)
      .map(
        (g) =>
          `<h2 class="calc-g">${esc(g.t)}</h2><div class="cards">` +
          g.items
            .map(
              (d) =>
                `<article class="card"><h3>${esc(d.n)}</h3>${d.warn.map((x) => `<p class="cw">${fmt(x)}</p>`).join("")}<ul>${d.lines.map((l) => `<li>${fmt(l)}</li>`).join("")}</ul><p class="cs">${esc(d.src)}</p></article>`
            )
            .join("") +
          "</div>"
      )
      .join("")
  );
}

function viewCalc() {
  const sel = (id, opts, cur) =>
    `<select id="${id}">${opts.map(([v, t]) => `<option value="${v}"${String(v) === String(cur) ? " selected" : ""}>${t}</option>`).join("")}</select>`;
  return `<div class="sec-h"><h2>Calculator de doze</h2><span>pe greutate și vârstă</span></div>
  <form id="calc" class="calc" autocomplete="off">
    <div class="f"><label for="cw">Greutate (kg)</label><input id="cw" type="text" inputmode="decimal" placeholder="ex. 12,5" value="${esc(CALC.w)}"></div>
    <div class="f"><label for="cy">Ani</label>${sel("cy", [["", ""], ...[0, 1, 2, 3, 4, 5, 6].map((x) => [x, x])], CALC.y)}</div>
    <div class="f"><label for="cm">Luni</label>${sel("cm", [["", ""], ...Array.from({ length: 12 }, (_, i) => [i, i])], CALC.m)}</div>
    <div class="f"><label for="cpc">Paracetamol</label>${sel(
      "cpc",
      [
        ["24", "120 mg/5 ml"],
        ["48", "240 mg/5 ml"],
      ],
      CALC.pc
    )}</div>
    <div class="f"><label for="cic">Ibuprofen</label>${sel(
      "cic",
      [
        ["20", "100 mg/5 ml"],
        ["40", "200 mg/5 ml"],
      ],
      CALC.ic
    )}</div>
  </form>
  <div id="calc-out" aria-live="polite">${calcOut()}</div>`;
}

if (typeof module !== "undefined") module.exports = { CALC, calcGroups, ageMonths, ageLabel, mg, ml, nf };
