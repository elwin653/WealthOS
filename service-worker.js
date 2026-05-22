const CACHE = 'wealthos-v3';
const STATIC = [
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

// Install: only cache external CDN libs, not app files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(STATIC)).catch(() => {})
  );
  self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // For CDN resources: cache first (they never change)
  if (url.hostname.includes('cdn.jsdelivr.net') || url.hostname.includes('cdn.tailwindcss.com')) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
    return;
  }

  // For app files (index.html, app.js, style.css):
  // NETWORK FIRST — always get latest, fall back to cache if offline
  if (url.hostname === self.location.hostname || url.protocol === 'file:') {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Everything else: network only (API calls etc)
  e.respondWith(fetch(e.request).catch(() => new Response('Offline', { status: 503 })));
});
