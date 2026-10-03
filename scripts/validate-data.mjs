// Verifică integritatea datelor clinice înainte de build și de commit.
// Nu verifică corectitudinea medicală (asta e treaba omului + a surselor), ci forma:
// câmpuri obligatorii, id-uri unice, legături interne valide, marcaje închise, diacritice corecte.
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { G, C } = require(resolve(root, "src/data/conditions.js"));
const { NEWS, ABX, EXCL, AMBER, RED, CENTOR, FP, CDS } = require(resolve(root, "src/data/tools.js"));

const errors = [];
const warn = [];
const err = (m) => errors.push(m);
const ids = new Set();
const REQUIRED = ["id", "g", "n", "alt", "key", "sym", "dx", "alarm", "tx", "no", "src"];

for (const c of C) {
  const where = `fișa „${c.id ?? c.n}”`;
  for (const k of REQUIRED) if (!(k in c)) err(`${where}: lipsește câmpul ${k}`);
  if (ids.has(c.id)) err(`${where}: id duplicat`);
  ids.add(c.id);
  if (!/^[a-z0-9-]+$/.test(c.id)) err(`${where}: id-ul trebuie să fie ASCII minuscul (literele cu diacritice strică adresa #)`);
  if (!G[c.g]) err(`${where}: grupă necunoscută ${c.g}`);
  if (!Array.isArray(c.src) || c.src.length === 0) err(`${where}: fără sursă`);
  for (const s of c.src ?? []) if (!Array.isArray(s) || typeof s[0] !== "string" || !s[0]) err(`${where}: sursă fără titlu`);
  if (c.sym.length === 0 || c.dx.length === 0 || c.tx.length === 0) err(`${where}: sym/dx/tx nu pot fi goale`);
  if (c.key.length > 180) warn.push(`${where}: decizia-cheie are ${c.key.length} caractere (țintă ≤180)`);
  const all = [c.key, c.note, c.uv, ...c.sym, ...c.dx, ...c.alarm, ...c.tx, ...c.no].filter(Boolean).join("\n");
  for (const [open, close, name] of [
    ["[[", "]]", "doză"],
    ["{{", "}}", "neverificat"],
  ]) {
    const o = all.split(open).length - 1,
      cl = all.split(close).length - 1;
    if (o !== cl) err(`${where}: marcaj ${name} neînchis (${o} deschideri, ${cl} închideri)`);
  }
  if ((all.match(/\*\*/g) ?? []).length % 2) err(`${where}: ** neînchis`);
  if (/[şţŞŢ]/.test(all + c.n + c.alt)) err(`${where}: ș/ț cu sedilă; folosește virgula (ș, ț)`);
  if (/\bmg\/kg\b/.test(all) && !/\[\[/.test(all)) warn.push(`${where}: conține mg/kg dar nicio doză marcată [[...]]`);
}

const link = (id, where) => {
  if (id && !ids.has(id)) err(`${where}: trimite la fișa inexistentă „${id}”`);
};
NEWS.forEach((r, i) => {
  if (r.length !== 4) err(`NEWS[${i}]: 4 câmpuri așteptate`);
  link(r[3], `NEWS[${i}]`);
});
ABX.forEach((r, i) => {
  if (r.length !== 8) err(`ABX[${i}]: 8 câmpuri așteptate`);
  link(r[1], `ABX[${i}] „${r[0]}”`);
});
EXCL.forEach((r, i) => {
  if (r.length !== 3) err(`EXCL[${i}]: 3 câmpuri așteptate`);
  link(r[1], `EXCL[${i}] „${r[0]}”`);
});
if (RED.length !== 10) err(`RED: NICE NG143 are 10 rânduri roșii, aici ${RED.length}`);
if (AMBER.length !== 13) err(`AMBER: NICE NG143 are 13 rânduri galbene, aici ${AMBER.length}`);
if (CENTOR.length !== 4 || FP.length !== 5) err("Centor are 4 criterii, FeverPAIN 5");
if (CDS.length !== 4 || CDS.some((r) => r[2].length !== 3)) err("Scala clinică de deshidratare: 4 itemi cu 3 niveluri");

const perGroup = Object.fromEntries(Object.keys(G).map((g) => [g, C.filter((c) => c.g === g).length]));
console.log(`${C.length} fișe`, perGroup, `· ${NEWS.length} noutăți · ${ABX.length} rânduri antibiotice · ${EXCL.length} rânduri excludere`);
for (const w of warn) console.log("  avertisment:", w);
if (errors.length) {
  for (const e of errors) console.error("  EROARE:", e);
  process.exit(1);
}
console.log("validare: OK");
