/* ==========================================================
   SMS Hindi Shayari
   Service Worker
   ========================================================== */

const CACHE_NAME = "sms-hindi-shayari-v1";

const STATIC_ASSETS = [
    "/",
    "/manifest.json",

    "/css/style.css",
    "/css/admin.css",
    "/css/auth.css",
    "/css/shayari.css",
    "/css/responsive.css",
    "/css/print.css",

    "/js/app.js",
    "/js/admin.js",
    "/js/auth.js",
    "/js/comments.js",
    "/js/image-generator.js",
    "/js/lazyload.js",
    "/js/pwa.js",
    "/js/search.js"
];

/* ===========================
   Install
=========================== */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())

    );

});

/* ===========================
   Activate
=========================== */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys =>

            Promise.all(

                keys.map(key => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            )

        )

    );

    self.clients.claim();

});

/* ===========================
   Fetch
=========================== */

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        caches.match(event.request)

            .then(cacheResponse => {

                if (cacheResponse) {

                    return cacheResponse;

                }

                return fetch(event.request)

                    .then(networkResponse => {

                        const cloned = networkResponse.clone();

                        caches.open(CACHE_NAME)

                            .then(cache => {

                                cache.put(event.request, cloned);

                            });

                        return networkResponse;

                    });

            })

            .catch(() => caches.match("/"))

    );

});
