
const CACHE_NAME = "techhistory-v1";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARQUIVOS);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((nomes) => {
      return Promise.all(
        nomes
          .filter((nome) => nome !== CACHE_NAME)
          .map((nome) => caches.delete(nome))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((respostaCache) => {
      if (respostaCache) return respostaCache;

      return fetch(event.request).then((resposta) => {
        if (
          resposta &&
          resposta.status === 200 &&
          new URL(event.request.url).origin === self.location.origin
        ) {
          const copia = resposta.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, copia);
          });
        }

        return resposta;
      });
    })
  );
});
