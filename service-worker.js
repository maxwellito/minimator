var APP_NAME = 'minimator',
  APP_VERSION = 5,
  CACHE_NAME = APP_NAME + '_' + APP_VERSION;

//# Give up and set up a build system coz this list is ridiculous
var filesToCache = [
  './',
  './?utm_source=homescreen',
  './assets/fonts/DMSerifDisplay-Regular.ttf',
  './assets/vendor/vivus.0.4.6.min.js',
  './dist/components/about/about.cmp.js',
  './dist/components/create/create.cmp.js',
  './dist/components/helper-tooltip/helper-tooltip.cmp.js',
  './dist/components/home/home.cmp.js',
  './dist/components/home-card/home-card.cmp.js',
  './dist/components/project/project.cmp.js',
  './dist/components/surface/surface.cmp.js',
  './dist/components/theme-switch/theme-switch.cmp.js',
  './dist/components/toolbar/toolbar.cmp.js',
  './dist/components/vivus/vivus.cmp.js',
  './dist/components/base.cmp.js',
  './dist/components/page.cmp.js',
  './dist/services/historyStack/historyStack.js',
  './dist/services/router/router.js',
  './dist/services/shortcut/shortcut.js',
  './dist/services/storage/storage.js',
  './dist/services/touchController/touchController.js',
  './dist/services/feather.icons.js',
  './dist/services/features.js',
  './dist/services/samples.js',
  './dist/services/theme.js',
  './dist/services/utils.js',
  './dist/main.js',
  './dist/store.js',
  './src/components/about/about.style.css',
  './src/components/create/create.style.css',
  './src/components/helper-tooltip/helper-tooltip.style.css',
  './src/components/home/home.style.css',
  './src/components/home-card/home-card.style.css',
  './src/components/project/project.style.css',
  './src/components/surface/surface.style.css',
  './src/components/theme-switch/theme-switch.style.css',
  './src/components/toolbar/toolbar.style.css',
  './src/components/vivus/vivus.style.css',
  './src/style.css'
];

// Service worker from Google Documentation
self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName.indexOf(APP_NAME) === 0 && CACHE_NAME !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // IMPORTANT: Clone the request. A request is a stream and
      // can only be consumed once. Since we are consuming this
      // once by cache and once by the browser for fetch, we need
      // to clone the response.
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});