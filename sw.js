const C = 'motortester-v8';
const FILES = ['./', 'index.html', 'manifest.json', 'icon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))));
  self.clients.claim();
});
// 항상 인터넷에서 최신 파일을 먼저 받고(브라우저 임시저장 무시), 안 되면 저장해 둔 것 사용
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request.url, { cache: 'no-store' }).then(r => {
    const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
