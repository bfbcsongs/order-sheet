const CACHE_NAME = "order-sheet-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./sw.js"
];

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(APP_FILES);
        })
    );

    self.skipWaiting();

});


self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(cacheNames => {

            return Promise.all(

                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))

            );

        })

    );

    self.clients.claim();

});


self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        caches.match(event.request).then(cachedResponse => {

            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then(networkResponse => {

                return networkResponse;

            }).catch(() => {

                return caches.match("./index.html");

            });

        })

    );

});
