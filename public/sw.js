/**
 * Legacy service worker cleanup.
 * Unregisters stale SW registrations that cause /sw.js fetch loops and script parse errors.
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const windowClients = await self.clients.matchAll({ type: "window" });
      windowClients.forEach((client) => client.navigate(client.url));
    })(),
  );
});
