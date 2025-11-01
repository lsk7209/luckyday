/**
 * Cloudflare Workers API URL 유틸리티
 * 
 * Cloudflare Pages 환경에서 Workers API URL을 안전하게 결정합니다.
 */

/**
 * Cloudflare Workers API URL을 결정하는 함수
 * 
 * 우선순위:
 * 1. NEXT_PUBLIC_WORKERS_API_URL (직접 설정)
 * 2. NEXT_PUBLIC_SITE_URL에서 자동 변환
 * 3. 기본값 (프로덕션)
 */
export function getWorkersApiUrl(): string {
  // 1. 직접 설정된 환경 변수 사용
  if (process.env.NEXT_PUBLIC_WORKERS_API_URL) {
    return process.env.NEXT_PUBLIC_WORKERS_API_URL.replace(/\/$/, ''); // trailing slash 제거
  }
  
  // 2. Pages URL에서 자동 변환
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
    // 여러 패턴 지원: pages.dev, pages.cloudflare.dev 등
    return siteUrl
      .replace(/\.pages\.dev$/, '.workers.dev')
      .replace(/\.pages\.cloudflare\.dev$/, '.workers.dev')
      .replace(/luckyday\.pages/, 'luckyday-api.workers');
  }
  
  // 3. 기본값 (프로덕션)
  return 'https://luckyday-api.workers.dev';
}

/**
 * Workers API 호출용 fetch 래퍼
 * 에러 처리 및 타임아웃 포함
 */
export async function fetchWorkersApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${getWorkersApiUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초 타임아웃
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('API 요청 시간 초과');
    }
    throw error;
  }
}

