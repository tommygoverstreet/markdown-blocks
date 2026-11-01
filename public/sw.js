/* Service worker: precache the app shell, serve it offline, refresh in the background. */
const VERSION = 'v1.3.1';
const CACHE = `markdown-blocks-${VERSION}`;
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/icons/favicon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./css/tokens.css",
  "./css/app.css",
  "./css/output-themes.css",
  "./css/responsive.css",
  "./css/polish.css",
  "./css/modern.css",
  "./css/pastel.css",
  "./js/config/blocks.js",
  "./js/config/templates.js",
  "./js/core/state.js",
  "./js/core/markdown.js",
  "./js/core/history.js",
  "./js/ui/preview.js",
  "./js/ui/attributes.js",
  "./js/ui/blocks.js",
  "./js/ui/canvas-events.js",
  "./js/ui/palette-dnd.js",
  "./js/ui/format.js",
  "./js/ui/panels.js",
  "./js/io/files.js",
  "./js/ui/themes.js",
  "./js/ui/drawer.js",
  "./js/ui/custom-css.js",
  "./js/ui/toast.js",
  "./js/ui/extras.js",
  "./js/ui/touch-dnd.js",
  "./js/pwa.js",
  "./js/main.js"
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy));
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
