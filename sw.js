var V = "tspl-v2";
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(["./", "index.html", "manifest.webmanifest", "icon-192.png"]); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== V; }).map(function (x) { return caches.delete(x); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) { return; }   /* Supabase and CDN requests go straight to the network */
  e.respondWith(fetch(e.request).then(function (r) {
    var copy = r.clone(); caches.open(V).then(function (c) { c.put(e.request, copy); }); return r;
  }).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match("index.html"); }); }));
});
