/**
 * DreamScope Service Worker
 * PWA 오프라인 기능 및 캐싱 제공
 */

const CACHE_NAME = 'dreamscope-v1.0.0';
const STATIC_CACHE = 'dreamscope-static-v1.0.0';
const DYNAMIC_CACHE = 'dreamscope-dynamic-v1.0.0';

// 캐시할 정적 리소스들
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  // 폰트
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  // 아이콘 (실제 아이콘 파일들이 추가되면 여기에 추가)
];

// 캐시하지 않을 패턴들
const CACHE_EXCLUDE_PATTERNS = [
  /\/api\//,           // API 요청
  /\/_next\/static\//, // Next.js 정적 파일 (자동으로 캐시됨)
  /\/admin\//,         // 관리자 페이지
  /\?/,                // 쿼리 파라미터가 있는 요청
  /google-analytics/,  // 분석 스크립트
  /googletagmanager/,  // GTM 스크립트
];

// 설치 이벤트 - 정적 리소스 캐싱
self.addEventListener('install', (event) => {
  console.log('[SW] 설치 중...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] 정적 리소스 캐싱 중...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] 설치 완료');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] 캐시 실패:', error);
      })
  );
});

// 활성화 이벤트 - 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('[SW] 활성화 중...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 현재 버전이 아닌 캐시는 삭제
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('[SW] 오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] 활성화 완료');
      return self.clients.claim();
    })
  );
});

// 페치 이벤트 - 캐싱 전략 적용
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 제외 패턴 확인
  const shouldExclude = CACHE_EXCLUDE_PATTERNS.some(pattern => pattern.test(request.url));
  if (shouldExclude) {
    return;
  }

  // HTML 페이지 요청
  if (request.destination === 'document') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request)
            .then((response) => {
              // 성공적인 응답만 캐시
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => cache.put(request, responseClone));
              }
              return response;
            })
            .catch(() => {
              // 네트워크 실패 시 오프라인 페이지 반환
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // 정적 리소스 요청 (CSS, JS, 이미지 등)
  if (request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'image' ||
      request.destination === 'font') {

    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request)
            .then((response) => {
              // 성공적인 응답만 캐시
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then((cache) => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
    return;
  }

  // 기타 요청은 네트워크 우선
  event.respondWith(
    fetch(request)
      .then((response) => {
        // 성공적인 GET 요청만 캐시
        if (request.method === 'GET' && response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // 네트워크 실패 시 캐시된 응답 반환
        return caches.match(request);
      })
  );
});

// 푸시 알림 (향후 구현)
self.addEventListener('push', (event) => {
  console.log('[SW] 푸시 알림 수신:', event);

  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-96.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] 알림 클릭:', event);

  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// 주기적 백그라운드 동기화 (향후 구현)
self.addEventListener('sync', (event) => {
  console.log('[SW] 백그라운드 동기화:', event.tag);

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// 백그라운드 동기화 함수 (플레이스홀더)
async function doBackgroundSync() {
  try {
    // 캐시된 데이터 동기화 로직
    console.log('[SW] 백그라운드 동기화 실행');
    // TODO: 오프라인 중 쌓인 데이터 서버로 전송
  } catch (error) {
    console.error('[SW] 백그라운드 동기화 실패:', error);
  }
}

// 메시지 처리 (메인 스레드와 통신)
self.addEventListener('message', (event) => {
  console.log('[SW] 메시지 수신:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_CACHE_INFO') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        const cacheInfo = {
          cacheNames,
          timestamp: Date.now()
        };
        event.ports[0].postMessage(cacheInfo);
      })
    );
  }
});

// 에러 처리
self.addEventListener('error', (event) => {
  console.error('[SW] 서비스 워커 에러:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] 처리되지 않은 Promise 거부:', event.reason);
});
