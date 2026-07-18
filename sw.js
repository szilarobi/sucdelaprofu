const CACHE_NAME = "suc-de-la-profu-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./css/style.css",
    "./js/script.js",
    "./manifest.webmanifest",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames
                    .filter(function (name) {
                        return name !== CACHE_NAME;
                    })
                    .map(function (name) {
                        return caches.delete(name);
                    })
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("message", function (event) {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

self.addEventListener("fetch", function (event) {
    if (event.request.method !== "GET") {
        return;
    }

    // Pentru paginile HTML folosim rețeaua prima dată, ca utilizatorii
    // să primească rapid versiunea nouă; cache-ul rămâne rezervă offline.
    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request)
                .then(function (response) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put("./index.html", copy);
                    });
                    return response;
                })
                .catch(function () {
                    return caches.match("./index.html");
                })
        );
        return;
    }

    // Pentru resurse statice: cache imediat, apoi actualizare în fundal.
    event.respondWith(
        caches.match(event.request).then(function (cachedResponse) {
            const networkRequest = fetch(event.request)
                .then(function (response) {
                    if (response && response.status === 200) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(event.request, copy);
                        });
                    }
                    return response;
                })
                .catch(function () {
                    return cachedResponse;
                });

            return cachedResponse || networkRequest;
        })
    );
});
