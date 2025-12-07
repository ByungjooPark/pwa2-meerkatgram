import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

const PREFIX = 'meerkatgram';

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
    cacheName: `${PREFIX}-html-cache`,
    networkTimeoutSeconds: 3,
  })
);

// -------------------------------------------
// API 요청 캐싱 (최소 동작 보장, POST/PUT/DELETE 등은 제외)
// -------------------------------------------
registerRoute(
  ({ url, request }) => url.origin === 'http://localhost:3000' && request.method === 'GET',
  new NetworkFirst({
    cacheName: `${PREFIX}-api-cache`,
    networkTimeoutSeconds: 3,
  })
);

// -------------------------------------------
// 이미지 캐싱
// -------------------------------------------
registerRoute(
  ({ request }) => request.destination === 'image',
  new NetworkFirst({
    cacheName: `${PREFIX}-image-cache`,
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
    icon: '/icons/meerkat_32.png',
    data: {
      postId: data.data.postId
    }
  });
});

// -------------------------------------------
// 웹푸시 클릭 이벤트
// -------------------------------------------
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const urlToOpen = new URL(`/posts/show/${event.notification.data.postId}`, self.location.origin);
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {

      // 이미 열려있는 탭이 있다면 그 탭을 포커스
      for (const client of clients) {
        if (client.url === urlToOpen && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      // 없으면 새 창 열기
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
