// Service Worker for Eduford University PWA
const CACHE_NAME = 'eduford-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/course.html',
    '/blog.html',
    '/contact.html',
    '/style.css',
    '/main.js',
    '/images/IMG_5922.PNG',
    '/images/images33.jpg',
    '/images/images2.jpg',
    '/images/university-old-building-campus-college.jpg',
    '/images/about_meredith_blog_2-1.jpg',
    '/images/20230731VisitMilledgevilleHistoricDay-38_95E70AD1-5056-BF65-D6277A4C7D8187C0-95e70a435056bf6_95e70d99-5056-bf65-d69ef5040af37f50.jpg',
    '/images/images333.jpg',
    '/images/Untitled.jpg',
    '/images/img_1042_3.jpg',
    '/images/studentmale.jpg',
    '/images/studentfemale.jpg',
    '/images/bar-1.jpg',
    '/images/drahomir-hugo-posteby-mach-n4y3eiQSIoc-unsplash.jpg',
    '/images/inaki-del-olmo-NIJuEQw0RKg-unsplash.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch((err) => {
                console.log('Cache failed:', err);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Don't cache if not a valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // Clone the response
                        const responseToCache = networkResponse.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return networkResponse;
                    })
                    .catch(() => {
                        // Return offline fallback for HTML pages
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-forms') {
        event.waitUntil(syncFormSubmissions());
    }
});

async function syncFormSubmissions() {
    // Implementation for background sync
    console.log('Background sync executed');
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/images/IMG_5922.PNG',
        badge: '/images/IMG_5922.PNG',
        vibrate: [100, 50, 100],
        data: {
            url: '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('Eduford University', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
