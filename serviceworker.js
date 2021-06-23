const cacheName = "cache-files";
const files = ["/", "/index.html", "/second.html", "/formhandler.js"];

self.addEventListener("activate", (e) => {
  self.clients.claim();
  console.log('lol');
});
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(files)));
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches
      .match(e.request)
      .then((response) => (response ? response : fetch(e.request)))
  );
});
