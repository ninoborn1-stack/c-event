/* C-Event Service Worker: Offline-Grundlage für PWA. Seiten network-first, Assets cache-first. */
const CACHE = 'cev-v2';
// Basis aus dem Scope ableiten, damit es auch unter einem Unterpfad (GitHub Pages) läuft.
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, '');
const CORE = ['/', '/konfigurator/', '/anfrage/', '/icons/icon-192.png'].map((p) => BASE + p);

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  const path = url.pathname.slice(BASE.length);
  if (req.method !== 'GET' || url.origin !== location.origin || path.startsWith('/api/') || path.startsWith('/demo')) return;
  const isAsset = /^\/(_next\/static|stock|icons)\//.test(path) || path.startsWith('/_next/image');
  if (isAsset) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
            return res;
          }),
      ),
    );
    return;
  }
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match(BASE + '/'))),
    );
  }
});
