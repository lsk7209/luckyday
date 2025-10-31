/**
 * Cloudflare Workers API Entry Point
 * CMS Calculator Backend API
 */

import { handleRequest } from './api/handler';
import { corsHeaders, handleOptions } from './lib/cors';
import { handleCron } from './cron';
import { handleQueue } from './queue';
import { checkRateLimit, applySecurityHeaders, validateRequest, logRequest } from './middleware/security';

export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  STORAGE: R2Bucket;
  QUEUE: Queue;
  JWT_SECRET: string;
  INDEXNOW_KEY: string;
  EMAIL_API_URL: string;
  EMAIL_API_KEY: string;
  WEBHOOK_SECRET: string;
  GSC_CLIENT_EMAIL: string;
  GSC_PRIVATE_KEY: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // CORS preflight 처리
    if (request.method === 'OPTIONS') {
      return handleOptions(request);
    }

    try {
      // 요청 검증
      const validation = await validateRequest(request);
      if (!validation.valid) {
        return applySecurityHeaders(new Response(
          JSON.stringify({
            success: false,
            error: validation.error,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        ));
      }

      // Rate limiting 체크
      const rateLimitResult = await checkRateLimit(request, env);
      if (!rateLimitResult.allowed) {
        return applySecurityHeaders(new Response(
          JSON.stringify({
            success: false,
            error: 'Rate limit exceeded',
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              ...rateLimitResult.headers
            }
          }
        ));
      }

      // API 요청 처리
      const response = await handleRequest(request, env, ctx);

      // 보안 헤더 적용
      const securedResponse = await applySecurityHeaders(response);

      // 요청 로깅 (비동기로 실행)
      ctx.waitUntil(logRequest(request, securedResponse, env));

      return securedResponse;

    } catch (error) {
      console.error('API Error:', error);

      const errorResponse = new Response(
        JSON.stringify({
          success: false,
          error: 'Internal Server Error',
          message: env.JWT_SECRET ? error.message : '서버 오류가 발생했습니다.' // 개발환경에서만 상세 에러 표시
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );

      // 보안 헤더 적용 후 반환
      return applySecurityHeaders(errorResponse);
    }
  },

  // Cron 작업 핸들러 (자동화 기능)
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    await handleCron(event, env);
  },

  // Queue 작업 핸들러
  async queue(batch: MessageBatch, env: Env, ctx: ExecutionContext) {
    await handleQueue(batch, env);
  }
};
