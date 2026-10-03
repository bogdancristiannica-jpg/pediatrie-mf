// Asamblează sursele într-un singur fișier HTML, fără dependențe externe.
// Produce:
//   dist/index.html     documentul complet (doctype, meta, manifest, service worker) — pentru GitHub Pages și uz local
//   dist/artifact.html  același conținut fără învelișul de document — pentru publicarea ca artefact claude.ai
//   dist/sw.js, dist/manifest.webmanifest, dist/icon-*.png
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = (p) => resolve(root, "src", p);
const dist = (p) => resolve(root, "dist", p);
const read = (p) => readFileSync(p, "utf8");

// Ordinea contează: datele înaintea codului care le folosește; app.js ultimul (pornește rutarea).
const JS_ORDER = ["data/conditions.js", "data/tools.js", "js/calc.js", "js/scores.js", "js/pages.js", "js/app.js"];

function version() {
  try {
    return execSync("git rev-parse --short HEAD", { cwd: root, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export function build() {
  const ver = version();
  const css = read(src("css/app.css")).trim();
  const js = JS_ORDER.map((f) => `/* ── ${f} ── */\n${read(src(f)).trim()}`).join("\n\n");
  const tpl = read(src("index.html"));
  if (!tpl.includes("/*@@CSS@@*/") || !tpl.includes("/*@@JS@@*/")) throw new Error("src/index.html: lipsesc marcajele @@CSS@@ / @@JS@@");

  const artifact = tpl
    .replace("/*@@CSS@@*/", css)
    .replace("/*@@JS@@*/", js)
    .replace(/__BUILD_VERSION__/g, ver);

  const icon180 = readFileSync(src("assets/icon-180.png")).toString("base64");
  const head = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Fișe clinice pediatrice 0–6 ani pentru medicul de familie: 35 de afecțiuni, calculator de doze, scoruri clinice, după ghidurile europene în vigoare.">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'none'">
<meta name="referrer" content="no-referrer">
<meta name="theme-color" content="#0A5C6B">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Fișe pediatrice">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="manifest" href="./manifest.webmanifest">
<link rel="apple-touch-icon" href="data:image/png;base64,${icon180}">
<link rel="icon" href="./icon-192.png" type="image/png">
`;
  const swReg = `<script>
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
</script>
`;
  // Împărțim șablonul: tot ce e înainte de </style> intră în <head>, restul în <body>.
  const i = artifact.indexOf("</style>") + "</style>".length;
  const page = `${head}${artifact.slice(0, i)}\n</head>\n<body>\n${artifact.slice(i)}\n${swReg}</body>\n</html>\n`;

  mkdirSync(dist(""), { recursive: true });
  writeFileSync(dist("index.html"), page);
  writeFileSync(dist("artifact.html"), artifact);
  writeFileSync(dist("sw.js"), read(src("sw.js")).replace(/__BUILD_VERSION__/g, ver));
  copyFileSync(src("manifest.webmanifest"), dist("manifest.webmanifest"));
  for (const f of ["icon-180.png", "icon-192.png", "icon-512.png"]) if (existsSync(src(`assets/${f}`))) copyFileSync(src(`assets/${f}`), dist(f));
  writeFileSync(dist(".nojekyll"), "");
  return { ver, bytes: Buffer.byteLength(page) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { ver, bytes } = build();
  console.log(`build ${ver}: dist/index.html ${(bytes / 1024).toFixed(0)} KB, dist/artifact.html, dist/sw.js`);
}
