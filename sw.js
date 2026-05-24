const CACHE_NAME = 'patchara-v1';
const urlsToCache = [
	'./',
	'/index.html',
	'./templatemo-prism-flux.min.css',
	'./templatemo-prism-scripts.min.js',
	'./images/',
	'./api/'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll([
				'./',
				'/index.html',
				'/templatemo-prism-flux.min.css',
				'/templatemo-prism-scripts.min.js'
			]).catch((err) => {
				console.log('Cache addAll error:', err);
			});
		})
	);
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
	const request = event.request;
	
	// Only handle GET requests
	if (request.method !== 'GET') {
		return;
	}
	
	// Strategy: Cache first, fallback to network
	event.respondWith(
		caches.match(request).then((response) => {
			if (response) {
				return response;
			}
			
			const clonedRequest = request.clone();
			return fetch(clonedRequest)
				.then((fetchResponse) => {
					// Don't cache error responses
					if (!fetchResponse || fetchResponse.status === 400 || fetchResponse.status === 500) {
						return fetchResponse;
					}
					
					const clonedResponse = fetchResponse.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(request, clonedResponse);
					});
					
					return fetchResponse;
				})
				.catch(() => {
					// Fallback to cached index if offline
					return caches.match('/');
				});
		})
	);
});
