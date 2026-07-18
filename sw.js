/*
 * Suc de la Profu' – PWA V7.3
 * Cache inteligent:
 * - HTML: Network First (conținut mereu proaspăt, cu rezervă offline)
 * - CSS/JS: Stale While Revalidate (încărcare rapidă + actualizare în fundal)
 * - Imagini/fonturi: Cache First (rapid după prima vizită)
 * - Curățare automată a cache-urilor vechi și limitarea imaginilor salvate
 */

const VERSION = "v7.3.0";
const STATIC_CACHE = `profu-static-${VERSION}`;
const PAGES_CACHE = `profu-pages-${VERSION}`;
const IMAGES_CACHE = `profu-images-${VERSION}`;
const FONTS_CACHE = `profu-fonts-${VERSION}`;

const APP_SHELL = [
    "./",
    "./index.html",
    "./css/style.css",
    "./js/script.js",
    "./manifest.webmanifest",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./assets/logo.png",
    "./assets/mere.jpg",
    "./assets/sfecla.jpg"
];

const ALL_CURRENT_CACHES = [
    STATIC_CACHE,
    PAGES_CACHE,
    IMAGES_CACHE,
    FONTS_CACHE
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        Promise.all([
            caches.keys().then(names =>
                Promise.all(
                    names
                        .filter(name => !ALL_CURRENT_CACHES.includes(name))
                        .map(name => caches.delete(name))
                )
            ),
            self.clients.claim()
        ])
    );
});

self.addEventListener("message", event => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

self.addEventListener("fetch", event => {
    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    // Nu interceptăm scheme speciale și hărțile Google încorporate.
    if (!url.protocol.startsWith("http") || url.hostname.includes("google.com")) {
        return;
    }

    // 1. Pagini HTML: rețeaua are prioritate, cache-ul este rezervă offline.
    if (request.mode === "navigate" || request.destination === "document") {
        event.respondWith(networkFirst(request, PAGES_CACHE));
        return;
    }

    // 2. CSS și JavaScript: răspuns imediat din cache, actualizare în fundal.
    if (request.destination === "style" || request.destination === "script") {
        event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
        return;
    }

    // 3. Imagini: cache first, cu limită ca să nu ocupe spațiu nelimitat.
    if (request.destination === "image") {
        event.respondWith(cacheFirst(request, IMAGES_CACHE, 45));
        return;
    }

    // 4. Fonturi locale sau externe: cache first.
    if (request.destination === "font") {
        event.respondWith(cacheFirst(request, FONTS_CACHE, 20));
        return;
    }

    // 5. Alte resurse de pe propriul domeniu: stale while revalidate.
    if (url.origin === self.location.origin) {
        event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    }
});

async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);

    try {
        const response = await fetchWithTimeout(request, 5000);

        if (isCacheable(response)) {
            await cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        const cached =
            (await cache.match(request)) ||
            (await caches.match("./index.html")) ||
            (await caches.match("./"));

        if (cached) {
            return cached;
        }

        throw error;
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    const networkPromise = fetch(request)
        .then(async response => {
            if (isCacheable(response)) {
                await cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => null);

    if (cached) {
        return cached;
    }

    const networkResponse = await networkPromise;
    return networkResponse || Response.error();
}

async function cacheFirst(request, cacheName, maxEntries) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(request);

        if (isCacheable(response)) {
            await cache.put(request, response.clone());
            await trimCache(cacheName, maxEntries);
        }

        return response;
    } catch (error) {
        return Response.error();
    }
}

function isCacheable(response) {
    return response && (response.ok || response.type === "opaque");
}

async function trimCache(cacheName, maxEntries) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    while (keys.length > maxEntries) {
        const oldestKey = keys.shift();
        await cache.delete(oldestKey);
    }
}

function fetchWithTimeout(request, timeoutMs) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(
            () => reject(new Error("Rețeaua răspunde prea lent.")),
            timeoutMs
        );

        fetch(request).then(
            response => {
                clearTimeout(timeoutId);
                resolve(response);
            },
            error => {
                clearTimeout(timeoutId);
                reject(error);
            }
        );
    });
}
