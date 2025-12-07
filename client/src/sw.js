import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

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
  new StaleWhileRevalidate({
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
      targetUrl: data.data.targetUrl
    }
  });
});

// -------------------------------------------
// 웹푸시 클릭 이벤트
// -------------------------------------------
self.addEventListener('notificationclick', function(e) {
  e.notification.close();

  // 페이로드에서 백엔드가 전달해 준 전체 URL을 추출
  const urlToOpen = e.notification.data.targetUrl;

  // Origin 획득
  const origin = self.location.origin;

  e.waitUntil(
    // clients의 구조
    // [
    //   WindowClient = {
    //     focused: false,
    //     frameType: "top-level",
    //     id: "f6e4c645-16ba-4ebe-9600-443b91141742",
    //     type: "window",
    //     url: "http://localhost:3000/posts",
    //     visibilityState: "visible"
    //   },
    //   // ...
    // ]
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      // 앱의 루트 도메인 탭이 있는지 확인
      const focusClient = clients.find(client => client.url.startsWith(origin));

      // 재활용할 탭을 찾았다면 포커스 및 내비게이션
      if(focusClient) {
        focusClient.focus();
        return focusClient.navigate(urlToOpen);
      }

      // 재활용할 탭이 없다면 새 창 열기
      if(self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
