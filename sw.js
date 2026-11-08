// 인터넷이 끊겨도 대진표와 점수판이 열리도록 저장해 두는 서비스 워커
const CACHE = 'pingpong2-v3';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all([
    c.add('./'),
    c.add('score.html'),
    c.add(new Request('https://cdn.tailwindcss.com', { mode: 'no-cors' })).catch(() => {})
  ])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// 인터넷이 되면 새 내용을 받고, 끊기면 저장해 둔 내용을 쓴다
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
