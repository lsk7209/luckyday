'use client';

/**
 * PWA 설치 및 서비스 워커 등록 컴포넌트
 */
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, X, Smartphone, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // 서비스 워커 등록
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('[PWA] 서비스 워커 등록 성공:', registration.scope);

            // 서비스 워커 업데이트 확인
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // 새 버전 사용 가능
                    console.log("PWA 업데이트 가능: 새 버전이 있습니다. 페이지를 새로고침해주세요.");
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('[PWA] 서비스 워커 등록 실패:', error);
            // PWA 기능이 작동하지 않을 수 있지만 앱은 계속 작동함
            console.warn('[PWA] 오프라인 기능 및 캐싱이 제한될 수 있습니다.');
          });
      });
    }

    // PWA 설치 프롬프트 이벤트 리스너
    const handleBeforeInstallPrompt = (e: Event) => {
      try {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowInstallPrompt(true);

        // 3일간 보지 않기로 설정한 경우 제외
        try {
          const dismissedUntil = localStorage.getItem('pwa-dismissed-until');
          if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) {
            setShowInstallPrompt(false);
            return;
          }
        } catch (error) {
          // localStorage가 지원되지 않는 환경
          console.warn('[PWA] localStorage 접근 불가');
        }
      } catch (error) {
        console.error('[PWA] 설치 프롬프트 처리 중 오류:', error);
        setShowInstallPrompt(false);
      }
    };

    // PWA 설치 완료 이벤트 리스너
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);

      console.log("PWA 설치 완료! DreamScope가 성공적으로 설치되었습니다.");
    };

    // 온라인/오프라인 상태 감지
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 초기 설치 상태 확인
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('[PWA] 사용자가 설치 수락');
        setIsInstalled(true);
      } else {
        console.log('[PWA] 사용자가 설치 거부');
      }

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('[PWA] 설치 중 오류:', error);
      // 사용자에게 에러 표시 (toast 없이)
      alert('앱 설치 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // 3일간 다시 보지 않기
    try {
      const threeDaysFromNow = Date.now() + (3 * 24 * 60 * 60 * 1000);
      localStorage.setItem('pwa-dismissed-until', threeDaysFromNow.toString());
    } catch (error) {
      // localStorage가 지원되지 않는 환경
      console.warn('[PWA] localStorage 접근 불가 - 설치 프롬프트 숨김 유지 불가');
    }
  };

  // 설치 불가능한 환경이거나 이미 설치됨
  if (!showInstallPrompt || isInstalled) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 max-w-sm shadow-lg border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">앱 설치</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          DreamScope를 앱처럼 사용해보세요
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center space-x-1">
            <Monitor className="h-4 w-4 text-green-500" />
            <span>데스크톱</span>
          </div>
          <div className="flex items-center space-x-1">
            <Smartphone className="h-4 w-4 text-blue-500" />
            <span>모바일</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            오프라인 지원
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>빠른 로딩 및 오프라인 사용</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>홈 화면에 바로가기 추가</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>푸시 알림 지원 (향후)</span>
          </div>
        </div>

        {!isOnline && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ 오프라인 상태에서는 설치가 제한될 수 있습니다.
            </p>
          </div>
        )}

        <Button
          onClick={handleInstallClick}
          className="w-full"
          disabled={!isOnline}
        >
          <Download className="mr-2 h-4 w-4" />
          지금 설치하기
        </Button>
      </CardContent>
    </Card>
  );
}

// PWA 상태 모니터링 훅
export function usePWAStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // 온라인 상태 감지
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA 설치 상태 확인
    try {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    } catch (error) {
      console.warn('[PWA] display-mode 확인 실패:', error);
    }

    // 서비스 워커 업데이트 감지
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          setUpdateAvailable(true);
        });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isInstalled,
    updateAvailable,
    swRegistration: navigator.serviceWorker?.controller ? true : false,
  };
}
