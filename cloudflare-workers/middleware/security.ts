/**
 * 보안 미들웨어
 * Rate limiting, 보안 헤더, 요청 검증
 */

import { Env } from '../index';

// Rate limiting을 위한 간단한 인메모리 스토어
// 실제 프로덕션에서는 Redis나 D1을 사용해야 함
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit 설정
const RATE_LIMITS = {
  // 엔드포인트별 제한
  '/api/content': { windowMs: 60 * 1000, maxRequests: 100 }, // 1분에 100개
  '/api/analytics': { windowMs: 60 * 1000, maxRequests: 200 }, // 1분에 200개
  '/api/search': { windowMs: 60 * 1000, maxRequests: 50 }, // 1분에 50개
  '/api/admin': { windowMs: 60 * 1000, maxRequests: 30 }, // 1분에 30개

  // 글로벌 제한
  global: { windowMs: 60 * 1000, maxRequests: 500 }, // 1분에 500개
};

export async function applySecurityHeaders(response: Response): Promise<Response> {
  const headers = new Headers(response.headers);

  // 보안 헤더 추가
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // HSTS (HTTPS에서만)
  if (new URL(response.url).protocol === 'https:') {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // CSP (Content Security Policy)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://*.googletagmanager.com https://*.google-analytics.com https://*.googlesyndication.com https://*.adtrafficquality.google",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.indexnow.org https://www.google.com https://www.bing.com https://*.workers.dev https://*.googlesyndication.com https://*.googletagmanager.com https://*.google-analytics.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google",
    "frame-src 'self' https://*.googlesyndication.com https://*.doubleclick.net https://googleads.g.doubleclick.net",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  headers.set('Content-Security-Policy', csp);

  return new Response(response.body, {
    ...response,
    headers,
  });
}

export async function checkRateLimit(request: Request, env: Env): Promise<{ allowed: boolean; headers?: Record<string, string> }> {
  const clientIP = getClientIP(request);
  const url = new URL(request.url);
  const path = url.pathname;

  // 엔드포인트별 제한 확인
  const endpointLimit = getEndpointLimit(path);
  const globalLimit = RATE_LIMITS.global;

  // 엔드포인트별 제한 체크
  const endpointKey = `${clientIP}:${path}`;
  const endpointAllowed = await checkLimit(endpointKey, endpointLimit, env);

  // 글로벌 제한 체크
  const globalKey = `${clientIP}:global`;
  const globalAllowed = await checkLimit(globalKey, globalLimit, env);

  if (!endpointAllowed || !globalAllowed) {
    return {
      allowed: false,
      headers: {
        'Retry-After': Math.ceil(endpointLimit.windowMs / 1000).toString(),
      },
    };
  }

  return { allowed: true };
}

async function checkLimit(key: string, limit: { windowMs: number; maxRequests: number }, env: Env): Promise<boolean> {
  const now = Date.now();
  const windowStart = now - limit.windowMs;

  try {
    // KV를 사용한 rate limiting (실제로는 더 효율적인 방법 사용 권장)
    const keyData = await env.CACHE.get(`ratelimit:${key}`);

    if (keyData) {
      const { count, resetTime } = JSON.parse(keyData);

      if (now > resetTime) {
        // 윈도우가 지났으므로 리셋
        await env.CACHE.put(`ratelimit:${key}`, JSON.stringify({
          count: 1,
          resetTime: now + limit.windowMs,
        }), { expirationTtl: Math.ceil(limit.windowMs / 1000) });

        return true;
      } else if (count >= limit.maxRequests) {
        // 제한 초과
        return false;
      } else {
        // 카운트 증가
        await env.CACHE.put(`ratelimit:${key}`, JSON.stringify({
          count: count + 1,
          resetTime,
        }), { expirationTtl: Math.ceil((resetTime - now) / 1000) });

        return true;
      }
    } else {
      // 첫 요청
      await env.CACHE.put(`ratelimit:${key}`, JSON.stringify({
        count: 1,
        resetTime: now + limit.windowMs,
      }), { expirationTtl: Math.ceil(limit.windowMs / 1000) });

      return true;
    }
  } catch (error) {
    console.warn('Rate limiting error:', error);
    // 에러가 발생해도 요청은 허용 (fail-open)
    return true;
  }
}

function getClientIP(request: Request): string {
  // Cloudflare에서 제공하는 헤더들에서 IP 추출
  const cfConnectingIP = request.headers.get('CF-Connecting-IP');
  const xForwardedFor = request.headers.get('X-Forwarded-For');
  const xRealIP = request.headers.get('X-Real-IP');

  return cfConnectingIP || xForwardedFor?.split(',')[0] || xRealIP || 'unknown';
}

function getEndpointLimit(path: string): { windowMs: number; maxRequests: number } {
  // 경로에 맞는 제한 찾기
  for (const [endpoint, limit] of Object.entries(RATE_LIMITS)) {
    if (endpoint !== 'global' && path.startsWith(endpoint)) {
      return limit as { windowMs: number; maxRequests: number };
    }
  }

  // 기본 제한
  return { windowMs: 60 * 1000, maxRequests: 100 };
}

export async function validateRequest(request: Request): Promise<{ valid: boolean; error?: string }> {
  // 요청 크기 제한 (10MB)
  const contentLength = parseInt(request.headers.get('Content-Length') || '0');
  if (contentLength > 10 * 1024 * 1024) {
    return { valid: false, error: 'Request too large' };
  }

  // User-Agent 검증 (봇 차단)
  const userAgent = request.headers.get('User-Agent') || '';
  if (isSuspiciousUserAgent(userAgent)) {
    return { valid: false, error: 'Suspicious user agent' };
  }

  // 요청 메소드 검증
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'];
  if (!allowedMethods.includes(request.method)) {
    return { valid: false, error: 'Method not allowed' };
  }

  return { valid: true };
}

function isSuspiciousUserAgent(userAgent: string): boolean {
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /python/i, // 일반적인 스크래핑 도구
  ];

  // 허용된 봇들
  const allowedBots = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i, // Yahoo
    /duckduckbot/i,
    /baiduspider/i,
  ];

  // 의심스러운 패턴이 있고 허용된 봇이 아니면 차단
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
  const isAllowed = allowedBots.some(pattern => pattern.test(userAgent));

  return isSuspicious && !isAllowed;
}

// 요청 로깅 (감사 로그용)
export async function logRequest(request: Request, response: Response, env: Env, userId?: string) {
  try {
    const url = new URL(request.url);
    const clientIP = getClientIP(request);

    // 감사 로그 저장 (중요한 요청만)
    if (url.pathname.startsWith('/api/admin') || request.method !== 'GET') {
      await env.DB.prepare(`
        INSERT INTO audit_logs (
          user_id, action, resource_type, resource_id,
          old_values, new_values, ip_address, user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        userId || null,
        request.method,
        url.pathname.split('/')[2] || 'api', // 리소스 타입 추출
        url.pathname,
        null, // old_values
        null, // new_values
        clientIP,
        request.headers.get('User-Agent')
      ).run();
    }

    // 액세스 로그 (KV에 임시 저장)
    const logKey = `access:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    await env.CACHE.put(logKey, JSON.stringify({
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      status: response.status,
      userAgent: request.headers.get('User-Agent'),
      ip: clientIP,
      userId,
    }), { expirationTtl: 3600 }); // 1시간 후 자동 삭제

  } catch (error) {
    console.warn('Request logging failed:', error);
    // 로깅 실패해도 요청 처리 계속
  }
}
