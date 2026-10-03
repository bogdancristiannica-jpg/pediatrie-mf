// Teste unitare pentru aritmetica calculatorului. Rulează cu `node --test` (fără browser).
// Valorile așteptate sunt calculate de mână din dozele pe kg din surse, nu copiate din rezultatul programului.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

globalThis.esc = (s) => String(s);
globalThis.fmt = (s) => String(s);
const require = createRequire(import.meta.url);
const { calcGroups, mg, ml, ageMonths, CALC } = require("../../src/js/calc.js");

const item = (groups, name) => {
  for (const g of groups) for (const d of g.items) if (d.n.startsWith(name)) return d;
  throw new Error("lipsește " + name);
};
const text = (d) => [...d.lines, ...d.warn].join("\n");

test("rotunjiri: mg întregi peste 10, o zecimală sub 10; ml la 0,1 sub 10 și la 0,5 peste", () => {
  assert.equal(mg(187.5), "188");
  assert.equal(mg(1.875), "1,9");
  assert.equal(ml(7.8125), "7,8");
  assert.equal(ml(31.25), "31,5");
  assert.equal(ml(31.1), "31");
});

test("vârsta în luni", () => {
  CALC.y = "";
  CALC.m = "";
  assert.equal(ageMonths(), null);
  CALC.y = "2";
  CALC.m = "3";
  assert.equal(ageMonths(), 27);
});

test("12,5 kg: paracetamol 125–188 mg/doză, maxim 750 mg/zi; ibuprofen max 125 mg/doză, 250–375 mg/zi", () => {
  CALC.pc = "24";
  CALC.ic = "20";
  const g = calcGroups(12.5, 27);
  const p = text(item(g, "Paracetamol oral"));
  assert.match(p, /125–188 mg/);
  assert.match(p, /5,2–7,8 ml/);
  assert.match(p, /750 mg/);
  const i = text(item(g, "Ibuprofen oral"));
  assert.match(i, /maximum \[\[125 mg\]\]/);
  assert.match(i, /250–375 mg/);
  assert.match(i, /100 mg ×3\/zi/); // doza fixă RCP la 1–3 ani
});

test("20 kg, 3 ani: prednisolonul în criza de wheezing e plafonat la 30 mg; fierul la 100 mg/zi", () => {
  const g = calcGroups(20, 36);
  assert.match(text(item(g, "Prednisolon, criză")), /20–30 mg\/zi/); // 1–2 mg/kg = 20–40, plafon 30
  assert.match(text(item(g, "Fier elemental")), /40–100 mg\/zi/); // 2–6 mg/kg = 40–120, plafon 100
});

test("15 kg: adrenalina nebulizată e plafonată la 5 ml; dexametazona în crup e 2,3 mg", () => {
  const g = calcGroups(15, null);
  assert.match(text(item(g, "Adrenalină")), /\[\[5 ml\]\]/); // 0,4 × 15 = 6 → 5
  assert.match(text(item(g, "Dexametazonă, crup")), /\[\[2,3 mg\]\]/); // 0,15 × 15 = 2,25
});

test("4 kg, 2 luni: ibuprofenul e contraindicat (vârstă și greutate), paracetamolul doar la recomandarea medicului", () => {
  const g = calcGroups(4, 2);
  const i = item(g, "Ibuprofen oral");
  assert.ok(i.warn.some((w) => /Sub 3 luni/.test(w)));
  assert.ok(i.warn.some((w) => /Sub 5 kg/.test(w)));
  assert.ok(item(g, "Paracetamol oral").warn.some((w) => /1–3 luni/.test(w)));
});

test("claritromicina pe benzi de greutate (NICE)", () => {
  assert.match(text(item(calcGroups(6, null), "Claritromicină")), /45 mg ×2\/zi/); // 7,5 × 6
  assert.match(text(item(calcGroups(10, null), "Claritromicină")), /62,5 mg ×2\/zi/);
  assert.match(text(item(calcGroups(15, null), "Claritromicină")), /125 mg ×2\/zi/);
});

test("fără vârstă: dozele pe benzi de vârstă afișează tot tabelul, nu o bandă", () => {
  const g = calcGroups(10, null);
  assert.match(text(item(g, "Amoxicilină")), /1–11 luni .*1–4 ani .*5–11 ani/);
  assert.match(text(item(g, "Convulsie febrilă")), /2,5 mg.*5 mg.*5 mg.*10 mg/);
});
