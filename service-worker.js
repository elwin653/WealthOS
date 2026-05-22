// WealthOS Service Worker — optimised for iOS PWA home screen
const CACHE = 'wealthos-v5';
const CDN = [
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Mono:wght@400;500&display=swap'
];

// Install — pre-cache CDN assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CDN).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// Activate — delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip non-GET requests and API calls
  if (e.request.method !== 'GET') return;
  if (url.hostname.includes('groq.com') ||
      url.hostname.includes('binance.com') ||
      url.hostname.includes('yahoo.com') ||
      url.hostname.includes('coingecko.com') ||
      url.hostname.includes('exchangerate-api.com') ||
      url.hostname.includes('generativelanguage.googleapis.com') ||
      url.hostname.includes('openrouter.ai') ||
      url.hostname.includes('pollinations.ai')) {
    return; // Let API calls go straight to network
  }

  // CDN resources — cache first
  if (url.hostname.includes('cdn.jsdelivr.net') ||
      url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // App files — network first, fall back to cache for offline use
  if (url.hostname === self.location.hostname) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  }
});
