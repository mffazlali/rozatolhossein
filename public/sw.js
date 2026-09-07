// روضة الحسین - Service Worker
// نسخه: 1.0.0

const CACHE_VERSION = 'v3';
const CACHE_STATIC = `rozatolhossein-static-${CACHE_VERSION}`;
const CACHE_DYNAMIC = `rozatolhossein-dynamic-${CACHE_VERSION}`;
const CACHE_IMAGES = `rozatolhossein-images-${CACHE_VERSION}`;
const CACHE_API = `rozatolhossein-api-${CACHE_VERSION}`;

// فایل‌های استاتیک برای کش اولیه
const STATIC_ASSETS = [
  '/',
  '/icon.svg',
  '/manifest.json',
];

// حداکثر تعداد آیتم‌ها در کش داینامیک
const MAX_CACHE_SIZE = {
  dynamic: 50,
  images: 100,
  api: 30,
};

// محدود کردن سایز کش
const limitCacheSize = (cacheName, maxItems) => {
  caches.open(cacheName).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => limitCacheSize(cacheName, maxItems));
      }
    });
  });
};

// Install Event - کش کردن فایل‌های استاتیک
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - پاک کردن کش‌های قدیمی
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('rozatolhossein-') && !name.includes(CACHE_VERSION))
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - استراتژی‌های کش
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // فقط درخواست‌های GET را کش کن
  if (request.method !== 'GET') {
    return;
  }

  // استراتژی 1: تصاویر - Cache First با fallback
  if (request.destination === 'image' || /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then(response => {
          // فقط response های موفق را کش کن
          if (response && response.status === 200) {
            return caches.open(CACHE_IMAGES).then(cache => {
              cache.put(request, response.clone());
              limitCacheSize(CACHE_IMAGES, MAX_CACHE_SIZE.images);
              return response;
            });
          }
          return response;
        }).catch(() => {
          // fallback image در صورت عدم دسترسی
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#181818" width="200" height="200"/><text fill="#7d7d7d" x="50%" y="50%" text-anchor="middle" dy=".3em">تصویر</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        });
      })
    );
    return;
  }

  // استراتژی 2: فایل‌های Next.js استاتیک - Cache First
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        return cachedResponse || fetch(request).then(response => {
          if (response && response.status === 200) {
            return caches.open(CACHE_STATIC).then(cache => {
              cache.put(request, response.clone());
              return response;
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // استراتژی 3: فونت‌ها - Cache First
  if (request.destination === 'font' || /\.(woff|woff2|ttf|otf|eot)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        return cachedResponse || fetch(request).then(response => {
          if (response && response.status === 200) {
            return caches.open(CACHE_STATIC).then(cache => {
              cache.put(request, response.clone());
              return response;
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // استراتژی 4: API Calls - بدون کش (IndexedDB مدیریت می‌کند)
  // API calls را کش نمی‌کنیم تا IndexedDB بتواند در حالت آفلاین کار کند
  if (url.pathname.startsWith('/ape-api/') || url.origin.includes('ape-api')) {
    event.respondWith(fetch(request));
    return;
  }

  // استراتژی 5: صفحات HTML - Cache First برای آفلاین، اما داده‌ها از IndexedDB
  if (request.destination === 'document' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.status === 200) {
            return caches.open(CACHE_DYNAMIC).then(cache => {
              cache.put(request, response.clone());
              limitCacheSize(CACHE_DYNAMIC, MAX_CACHE_SIZE.dynamic);
              return response;
            });
          }
          return response;
        })
        .catch(() => {
          // در حالت آفلاین، از کش HTML استفاده کن
          // داده‌ها توسط IndexedDB مدیریت می‌شوند
          return caches.match(request).then(cachedResponse => {
            return cachedResponse || caches.match('/');
          });
        })
    );
    return;
  }

  // استراتژی 6: سایر منابع - Network First
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.status === 200) {
          return caches.open(CACHE_DYNAMIC).then(cache => {
            cache.put(request, response.clone());
            limitCacheSize(CACHE_DYNAMIC, MAX_CACHE_SIZE.dynamic);
            return response;
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Message Event - پاک کردن کش از client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('rozatolhossein-'))
            .map(name => caches.delete(name))
        );
      })
    );
  }
});
