self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache =>
      cache.addAll([
        './',
        './index.html',
        './style.css',
        './game.js',
        './manifest.json',
        'https://cdn.pixabay.com/download/audio/2022/03/15/audio_8c4f674fa6.mp3?filename=laser-small-81720.mp3'
      ])
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
