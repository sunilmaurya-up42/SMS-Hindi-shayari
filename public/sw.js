/**
 * ==========================================
 * SMS Hindi Shayari
 * Service Worker
 * ==========================================
 */

"use strict";

const CACHE_NAME = "sms-hindi-shayari-v1";

const STATIC_CACHE = [

    "/",

    "/about",

    "/contact",

    "/privacy",

    "/terms",

    "/disclaimer",

    "/search",

    "/manifest.json",

    "/favicon/favicon.ico",

    "/css/style.css",

    "/css/admin.css",

    "/js/app.js",

    "/js/main.js",

    "/js/theme.js",

    "/logos/logo.png"

];

/* ==========================================
   Install
========================================== */

self.addEventListener("install", (event) => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then((cache) => {

            return cache.addAll(STATIC_CACHE);

        })

    );

    self.skipWaiting();

});

/* ==========================================
   Activate
========================================== */

self.addEventListener("activate", (event) => {

    event.waitUntil(

        caches.keys().then((keys) => {

            return Promise.all(

                keys.map((key) => {

                    if (key !== CACHE_NAME) {

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});

/* ==========================================
   Fetch
========================================== */

self.addEventListener("fetch", (event) => {

    if (event.request.method !== "GET") {

        return;

    }

    event.respondWith(

        caches.match(event.request)

        .then((cachedResponse) => {

            if (cachedResponse) {

                return cachedResponse;

            }

            return fetch(event.request)

            .then((networkResponse) => {

                if (

                    !networkResponse ||

                    networkResponse.status !== 200 ||

                    networkResponse.type !== "basic"

                ) {

                    return networkResponse;

                }

                const responseClone =

                    networkResponse.clone();

                caches.open(CACHE_NAME)

                .then((cache) => {

                    cache.put(

                        event.request,

                        responseClone

                    );

                });

                return networkResponse;

            })

            .catch(() => {

                return caches.match("/");

            });

        })

    );

});

/* ==========================================
   Message
========================================== */

self.addEventListener("message", (event) => {

    if (event.data === "SKIP_WAITING") {

        self.skipWaiting();

    }

});
