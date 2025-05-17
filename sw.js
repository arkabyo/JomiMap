const CACHE_NAME = "jomimap-v1";
const ASSETS = [
  "/JomiMap/index.html",
  "/JomiMap/js/script2.js",
  "/JomiMap/css/styles.css",
  "/JomiMap/css/bootstraps/bootstrap.min.css",
  "/JomiMap/css/bootstraps/bootstrap-icons.css",
  "/JomiMap/images/JomiMap-Logo.svg",
  "/JomiMap/favicon-96x96.png"
];

self.addEventListener("install", e =>
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)))
);

self.addEventListener("fetch", e =>
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
);
