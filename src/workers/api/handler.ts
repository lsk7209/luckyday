/**
 * API 요청 핸들러
 * 라우팅 및 엔드포인트 처리
 */

import { Env } from '../index';
import { handleContentAPI } from './content';
import { handleSearchAPI } from './search';
import { handleAnalyticsAPI } from './analytics';
import { handleAdminAPI } from './admin';
import { handleWebhookAPI } from './webhook';
import { corsHeaders } from '../lib/cors';

// API 응답 헬퍼
export function createResponse(
  data: any,
  status = 200,
  headers: Record<string, string> = {}
): Response {
  return new Response(
    JSON.stringify({
      success: status >= 200 && status < 300,
      data,
      timestamp: new Date().toISOString(),
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
        ...headers,
      },
    }
  );
}

export function createErrorResponse(
  message: string,
  status = 500,
  code?: string
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        message,
        code: code || `HTTP_${status}`,
        timestamp: new Date().toISOString(),
      },
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    }
  );
}

// 메인 핸들러
export async function handleRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  console.log(`${method} ${path}`);

  try {
    // Health check
    if (path === '/api/health') {
      return createResponse({ status: 'ok', timestamp: new Date().toISOString() });
    }

    // 콘텐츠 API
    if (path.startsWith('/api/content') || path.startsWith('/api/blog') || path.startsWith('/api/guide') || path.startsWith('/api/utility')) {
      return handleContentAPI(request, env, ctx);
    }

    // 검색 API
    if (path.startsWith('/api/search')) {
      return handleSearchAPI(request, env, ctx);
    }

    // 분석 API
    if (path.startsWith('/api/analytics')) {
      return handleAnalyticsAPI(request, env, ctx);
    }

    // 관리자 API
    if (path.startsWith('/api/admin')) {
      return handleAdminAPI(request, env, ctx);
    }

    // 웹훅 API
    if (path.startsWith('/api/webhook')) {
      return handleWebhookAPI(request, env, ctx);
    }

    // 관련 콘텐츠 API
    if (path.startsWith('/api/related')) {
      return handleRelatedAPI(request, env, ctx);
    }

    // 404
    return createErrorResponse('API endpoint not found', 404, 'NOT_FOUND');

  } catch (error) {
    console.error('API Error:', error);
    return createErrorResponse(
      process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      500,
      'INTERNAL_ERROR'
    );
  }
}

// 관련 콘텐츠 API 핸들러 (임시 구현)
async function handleRelatedAPI(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== 'GET') {
    return createErrorResponse('Method not allowed', 405);
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');

  if (!slug) {
    return createErrorResponse('Slug parameter is required', 400);
  }

  // TODO: 실제 관련 콘텐츠 로직 구현
  const related = [
    {
      slug: 'sample-related-1',
      title: '관련 콘텐츠 1',
      type: 'blog',
      similarity: 0.85,
    },
  ];

  return createResponse(related);
}
