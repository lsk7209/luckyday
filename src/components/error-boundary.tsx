/**
 * 에러 바운더리 컴포넌트
 * @description React 애플리케이션 에러 처리
 */
'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: Error;
    resetError: () => void;
  }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // 에러 로깅 (실제로는 외부 로깅 서비스로 전송)
    if (process.env.NODE_ENV === 'production') {
      // Sentry, LogRocket 등으로 에러 전송
      console.error('Production error logged:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            resetError={this.resetError}
          />
        );
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: DefaultErrorFallbackProps) {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">오류가 발생했습니다</CardTitle>
          <CardDescription>
            죄송합니다. 예기치 않은 오류가 발생했습니다.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs bg-muted p-3 rounded">
              <summary className="cursor-pointer font-medium">개발자 정보</summary>
              <pre className="mt-2 whitespace-pre-wrap text-red-600">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}

          <div className="flex flex-col space-y-2">
            <Button onClick={resetError} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>

            <Button variant="outline" onClick={handleReload} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              페이지 새로고침
            </Button>

            <Button variant="outline" onClick={handleGoHome} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            문제가 지속되면 고객 지원팀에 문의해주세요.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// React 18+용 Error Boundary Hook
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    console.error('Error Handler:', error, errorInfo);

    // 실제로는 에러 로깅 서비스로 전송
    if (process.env.NODE_ENV === 'production') {
      // 에러 트래킹 서비스 호출
    }
  };
}

// 로딩 상태 컴포넌트
export function LoadingSpinner({ message = '로딩 중...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

// 로딩 스켈레톤 컴포넌트
export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`}>
      <div className="h-full bg-muted-foreground/10"></div>
    </div>
  );
}

// API 에러 처리 유틸리티
export function handleApiError(error: any) {
  if (error?.code === 'UNAUTHORIZED') {
    // 로그인 페이지로 리다이렉트
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return '인증이 필요합니다.';
  }

  if (error?.code === 'FORBIDDEN') {
    return '접근 권한이 없습니다.';
  }

  if (error?.code === 'NOT_FOUND') {
    return '요청한 리소스를 찾을 수 없습니다.';
  }

  if (error?.code === 'NETWORK_ERROR') {
    return '네트워크 연결을 확인해주세요.';
  }

  return error?.message || '알 수 없는 오류가 발생했습니다.';
}
