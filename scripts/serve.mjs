// Server static minimal pentru dist/ (dezvoltare locală, teste e2e, simulatorul iOS).
// Fără dependențe. Pornește pe PORT (implicit 4173) și ascultă pe toate interfețele,
// ca să poată fi deschis și din simulator sau de pe un telefon din aceeași rețea.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, dirname, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
};

createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  if (path.endsWith("/")) path += "index.html";
  const file = resolve(root, "." + path);
  if (!file.startsWith(root)) {
    res.writeHead(403);
    return res.end();
  }
  try {
    const s = await stat(file);
    if (!s.isFile()) throw new Error("not a file");
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream", "cache-control": "no-store", "content-length": body.length });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404");
  }
}).listen(port, "0.0.0.0", () => console.log(`dist/ servit la http://localhost:${port}/  (Ctrl+C pentru oprire)`));
