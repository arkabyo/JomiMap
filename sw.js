// sw.js
const CACHE_NAME = "jomimap-v1";
const ASSETS = [
  "index.html",
  "js/script2.js",
  "css/styles.css",
  "css/bootstraps/bootstrap.min.css",
  "css/bootstraps/bootstrap-icons.css",
  "images/JomiMap-Logo.svg",
  "favicon-96x96.png"
];

self.addEventListener("install", evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .catch(err => console.error("SW cache failed:", err))
  );
});

self.addEventListener("fetch", evt => {
  evt.respondWith(
    caches.match(evt.request).then(cached => {
      return cached || fetch(evt.request);
    })
  );
});
