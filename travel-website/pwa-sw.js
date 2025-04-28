// Service Worker for PWA caching
const CACHE_NAME = 'travel-agency-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/packages.html',
  '/about.html',
  '/contact.html',
  '/css/style.css',
  '/js/script.js',
  '/travel-website/css/style.css',
  '/travel-website/js/script.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
