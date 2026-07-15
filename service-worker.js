const CACHE_NAME = "hill-rider-v1";

const urlsToCache = [
    "./",
    "./index.html",

    "./css/style.css",
    "./css/mobile.css",

    "./js/engine.js",
    "./js/terrain.js",
    "./js/car.js",
    "./js/camera.js",
    "./js/background.js",
    "./js/particles.js",
    "./js/controls.js",
    "./js/physics.js",
    "./js/fuel.js",
    "./js/coin.js",
    "./js/sound.js",
    "./js/garage.js",
    "./js/menu.js",
    "./js/checkpoint.js",
    "./js/pause.js",
    "./js/mobile-controls.js",
    "./js/mobile-ui.js",
    "./js/car-select.js",
    "./js/save.js",
    "./js/game.js",

    "https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.20.0/matter.min.js",
    "https://cdn.jsdelivr.net/npm/poly-decomp@0.3.0/build/decomp.min.js"
];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

        .then(cache => cache.addAll(urlsToCache))

    );

});

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

        .then(response => {

            return response || fetch(event.request);

        })

    );

});

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys

                .filter(key => key !== CACHE_NAME)

                .map(key => caches.delete(key))

            );

        })

    );

});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});