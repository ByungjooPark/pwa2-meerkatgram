import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';

const PREFIX = 'meerkatgram';
const VERSION = 'v1.0.4';

// -------------------------
// 정적 파일 캐싱
// -------------------------
precacheAndRoute(self.__WB_MANIFEST);

// -------------------------------------------
// HTML 오프라인 대응 (새로고침 살리기, SPA Routing 대비)
// -------------------------------------------
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: `${PREFIX}-html-cache-${VERSION}`,
    networkTimeoutSeconds: 3,
  })
);

// -------------------------------------------
// API 요청 캐싱 (최소 동작 보장, POST/PUT/DELETE 등은 제외)
// -------------------------------------------
registerRoute(
  ({ url, request }) => url.origin === 'http://localhost:3000' && request.method === 'GET',
  new NetworkFirst({
    cacheName: `${PREFIX}-api-cache-${VERSION}`,
    networkTimeoutSeconds: 3,
  })
);

// -------------------------------------------
// 이미지 캐싱
// -------------------------------------------
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: `${PREFIX}-image-cache-${VERSION}`,
  })
);

// -------------------------------------------
// 웹푸시 핸들러
// -------------------------------------------
self.addEventListener('push', e => {
  const data = e.data.json();
  console.log('푸시 수신:', data);

  self.registration.showNotification(data.title, {
    body: data.message,
    icon: '/icons/meerkat_32.png'
  });
});

self.addEventListener("install", () => {
  console.log("SW installing...");
});

self.addEventListener("activate", (e) => {
  console.log("SW activating...");
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key.startsWith(PREFIX) && !key.includes(VERSION))
          .map((key) => {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          })
      );
    })
  );

  self.clients.claim(); // 모든 페이지 즉시 제어
});
