// Service Worker pour Golf Performance Tracker - Bastian MAS
// Version 1.0

const CACHE_NAME = 'golf-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app-light.js',
  '/styles.css',
  '/baremes.js',
  '/logo-192.png',
  '/logo-512.png'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('⚙️ Service Worker: Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Service Worker: Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('❌ Erreur lors de la mise en cache:', err);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('⚙️ Service Worker: Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retourne la réponse en cache
        if (response) {
          return response;
        }

        // Clone la requête
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Vérifie si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone la réponse
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // En cas d'erreur réseau, retourne une page offline basique
        return new Response(
          '<html><body><h1>🏌️ Golf Tracker</h1><p>Mode hors ligne. Reconnectez-vous pour accéder à l\'application.</p></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        );
      })
  );
});
