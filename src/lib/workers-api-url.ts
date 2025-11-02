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
  
  // 2. 브라우저 환경에서 현재 호스트 기반으로 자동 감지
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Pages URL 패턴 감지 및 변환
    // 예: luckyday-8k6.pages.dev -> luckyday-api.workers.dev (wrangler.toml의 name 사용)
    const pagesMatch = hostname.match(/([a-z0-9-]+)\.pages\.dev$/);
    if (pagesMatch) {
      const projectName = pagesMatch[1];
      // 프로젝트 이름에서 UUID 부분 제거하고 'api' 추가
      // luckyday-8k6 -> luckyday-api
      const baseName = projectName.replace(/-[a-z0-9]{4,}$/, '');
      // Workers 이름은 wrangler.toml의 name 필드 기준으로 'luckyday-api' 사용
      // 만약 프로젝트 이름에 UUID가 있다면 제거, 없으면 그대로 사용
      if (baseName && baseName !== projectName) {
        // UUID가 제거된 경우 (예: luckyday-8k6 -> luckyday)
        return `https://${baseName}-api.workers.dev`;
      } else {
        // UUID가 없거나 패턴이 다른 경우 기본 이름 사용
        // wrangler.toml의 name = "luckyday-api" 기준
        return 'https://luckyday-api.workers.dev';
      }
    }
    
    // 이미 workers.dev인 경우
    if (hostname.includes('.workers.dev')) {
      return `https://${hostname}`;
    }
  }
  
  // 3. 환경 변수에서 Pages URL 가져오기
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
    try {
      const url = new URL(siteUrl);
      const hostname = url.hostname;
      
      // Pages URL 패턴 감지
      const pagesMatch = hostname.match(/([a-z0-9-]+)\.pages\.dev$/);
      if (pagesMatch) {
        const projectName = pagesMatch[1];
        const baseName = projectName.replace(/-[a-z0-9]{4,}$/, '');
        // wrangler.toml의 name = "luckyday-api" 기준으로 고정
        if (baseName && baseName !== projectName) {
          return `https://${baseName}-api.workers.dev`;
        } else {
          return 'https://luckyday-api.workers.dev';
        }
      }
      
      return siteUrl
        .replace(/\.pages\.dev$/, '.workers.dev')
        .replace(/\.pages\.cloudflare\.dev$/, '.workers.dev')
        .replace(/luckyday\.pages/, 'luckyday-api.workers');
    } catch {
      // URL 파싱 실패 시 기본 처리
    }
  }
  
  // 4. 기본값 (프로덕션) - 실제 배포된 Workers URL로 수정 필요
  console.warn('[Workers API] 기본 URL 사용 중. NEXT_PUBLIC_WORKERS_API_URL 환경 변수를 설정하세요.');
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

