const CACHE_NAME = "PCI-Committee-v1";
const CACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/service-worker.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() =>
        new Response("<h2>Offline Mode</h2><p>Internet connection is required.</p>", {
          headers: {"Content-Type": "text/html"}
        })
      )
  );
});
