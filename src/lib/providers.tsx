/**
 * 앱 프로바이더 컴포넌트
 * React Query, Theme 등의 전역 프로바이더 설정
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // React Query 클라이언트 설정
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 캐시 시간 5분
            staleTime: 5 * 60 * 1000,
            // 캐시 유지 시간 10분
            gcTime: 10 * 60 * 1000,
            // 재시도 설정
            retry: (failureCount, error: any) => {
              // 401 에러는 재시도하지 않음
              if (error?.code === 'UNAUTHORIZED') return false;
              // 404 에러는 재시도하지 않음
              if (error?.code === 'NOT_FOUND') return false;
              // 기타 에러는 최대 3번 재시도
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // 뮤테이션 재시도 설정
            retry: 1,
            retryDelay: 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 React Query DevTools 표시 */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
