// ==========================================================================
// SERVICE WORKER - GOLF PERFORMANCE TRACKER PWA
// Version: 2.0.0
// ==========================================================================

const CACHE_NAME = 'golf-tracker-v2.0.0';
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/baremes.js',
    '/app-light.js',
    '/history-advanced.js',
    '/coach-notes.js',
    '/manifest.json',
    '/logo_bastian.png',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installation en cours...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Service Worker: Mise en cache des fichiers...');
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker: Installation terminée !');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Erreur lors de l\'installation', error);
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker: Activation en cours...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Suppression ancien cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker: Activation terminée !');
            return self.clients.claim();
        })
    );
});

// Stratégie de mise en cache: Cache First, puis Network
self.addEventListener('fetch', (event) => {
    // Ignorer les requêtes non-GET
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Ignorer les requêtes chrome-extension et autres protocoles non-http
    if (!event.request.url.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Si trouvé dans le cache, retourner immédiatement
                if (cachedResponse) {
                    console.log('📦 Cache hit:', event.request.url);
                    
                    // En parallèle, mettre à jour le cache en arrière-plan
                    fetch(event.request)
                        .then((networkResponse) => {
                            if (networkResponse && networkResponse.status === 200) {
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(event.request, networkResponse.clone());
                                });
                            }
                        })
                        .catch(() => {
                            // Erreur réseau silencieuse en arrière-plan
                        });
                    
                    return cachedResponse;
                }
                
                // Sinon, aller chercher sur le réseau
                console.log('🌐 Network fetch:', event.request.url);
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Vérifier que la réponse est valide
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
                            return networkResponse;
                        }
                        
                        // Cloner la réponse car elle ne peut être consommée qu'une fois
                        const responseToCache = networkResponse.clone();
                        
                        // Mettre en cache pour la prochaine fois
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('❌ Fetch error:', error);
                        
                        // Si hors ligne et page HTML demandée, retourner la page d'accueil en cache
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                        
                        // Pour les autres ressources, retourner une erreur
                        return new Response('Offline - Resource not available', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Écouter les messages du client (pour forcer la mise à jour du cache)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('⏭️ Service Worker: Skip waiting activé');
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        console.log('🗑️ Service Worker: Nettoyage du cache demandé');
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => caches.delete(cache))
                );
            }).then(() => {
                console.log('✅ Service Worker: Cache nettoyé !');
                return self.clients.matchAll();
            }).then((clients) => {
                clients.forEach(client => client.postMessage({
                    type: 'CACHE_CLEARED'
                }));
            })
        );
    }
});

console.log('🚀 Service Worker chargé - Version:', CACHE_NAME);
