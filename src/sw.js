/* Service worker: pagina merge fără internet după prima deschidere.
   Strategie: pentru pagină, rețea întâi (ca actualizările să ajungă), cu rezervă din cache;
   pentru restul (pictograme, manifest), cache întâi. Numele cache-ului conține versiunea de build,
   deci o versiune nouă înlocuiește cache-ul vechi la activare. */
const CACHE = "fise-pediatrice-__BUILD_VERSION__";
const PRECACHE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const isPage = req.mode === "navigate" || req.destination === "document";
  if (isPage) {
    e.respondWith(
      fetch(req)
        .then((r) => {
          const copy = r.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy));
          return r;
        })
        .catch(() => caches.match("./index.html"))
    );
  } else {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((r) => {
            const copy = r.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
            return r;
          })
      )
    );
  }
});
