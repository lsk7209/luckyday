/**
 * 관리자 API 핸들러
 * 관리자 전용 기능 (인증 필요)
 */

import { Env } from '../index';
import { createResponse, createErrorResponse } from './handler';

export async function handleAdminAPI(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // TODO: JWT 인증 미들웨어 추가
  // const authHeader = request.headers.get('Authorization');
  // if (!authHeader || !verifyToken(authHeader, env.JWT_SECRET)) {
  //   return createErrorResponse('Unauthorized', 401);
  // }

  // 대시보드 통계
  if (method === 'GET' && path === '/api/admin/dashboard') {
    return handleGetDashboardStats(env);
  }

  // 콘텐츠 관리
  if (path.startsWith('/api/admin/content')) {
    return handleAdminContentAPI(request, env);
  }

  // SEO 관리
  if (path.startsWith('/api/admin/seo')) {
    return handleAdminSEOAPI(request, env);
  }

  // 분석 내보내기
  if (method === 'GET' && path === '/api/admin/analytics/export') {
    return handleExportAnalytics(request, env);
  }

  return createErrorResponse('Admin endpoint not found', 404);
}

// 대시보드 통계 조회
async function handleGetDashboardStats(env: Env): Promise<Response> {
  try {
    // 콘텐츠 통계
    const contentStats = await env.DB.prepare(`
      SELECT
        type,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'published' THEN 1 END) as published
      FROM content
      GROUP BY type
    `).all();

    // 최근 활동
    const recentActivity = await env.DB.prepare(`
      SELECT action, resource_type, created_at
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 10
    `).all();

    // SEO 현황
    const seoStats = await env.DB.prepare(`
      SELECT
        COUNT(CASE WHEN status = 'indexed' THEN 1 END) as indexed,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
      FROM index_submissions
      WHERE created_at >= datetime('now', '-30 days')
    `).first();

    // 분석 개요
    const analyticsOverview = await env.DB.prepare(`
      SELECT
        COUNT(DISTINCT session_id) as sessions,
        COUNT(*) as events,
        COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as page_views
      FROM analytics_events
      WHERE timestamp >= datetime('now', '-30 days')
    `).first();

    return createResponse({
      content: contentStats.results,
      recentActivity: recentActivity.results,
      seo: {
        indexed: seoStats?.indexed || 0,
        pending: seoStats?.pending || 0,
        failed: seoStats?.failed || 0,
      },
      analytics: {
        sessions: analyticsOverview?.sessions || 0,
        events: analyticsOverview?.events || 0,
        pageViews: analyticsOverview?.page_views || 0,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return createErrorResponse('Failed to fetch dashboard stats', 500);
  }
}

// 콘텐츠 관리 API
async function handleAdminContentAPI(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // 콘텐츠 검증
  if (method === 'POST' && path === '/api/admin/content/validate') {
    return handleValidateContent(request, env);
  }

  // 콘텐츠 게시
  if (method === 'POST' && path.match(/^\/api\/admin\/content\/\d+\/publish$/)) {
    const id = path.split('/')[4];
    return handlePublishContent(parseInt(id), env);
  }

  // 기타 콘텐츠 관리 API는 content.ts에서 처리
  return createErrorResponse('Content admin endpoint not found', 404);
}

// 콘텐츠 검증
async function handleValidateContent(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json();
    const { content, type } = body;

    const issues: string[] = [];
    let score = 100;

    // 기본 검증
    if (!content.title || content.title.length < 10) {
      issues.push('제목이 너무 짧거나 없습니다 (최소 10자)');
      score -= 10;
    }

    if (!content.summary || content.summary.length < 50) {
      issues.push('요약이 너무 짧거나 없습니다 (최소 50자)');
      score -= 10;
    }

    if (!content.seoTitle || content.seoTitle.length > 60) {
      issues.push('SEO 제목이 없거나 너무 깁니다 (최대 60자)');
      score -= 5;
    }

    if (!content.seoDescription || content.seoDescription.length > 160) {
      issues.push('SEO 설명이 없거나 너무 깁니다 (최대 160자)');
      score -= 5;
    }

    // 타입별 검증
    if (type === 'blog') {
      if (!content.body || content.body.length < 300) {
        issues.push('본문이 너무 짧습니다 (최소 300자)');
        score -= 15;
      }

      if (!content.readingMinutes) {
        issues.push('읽기 시간이 계산되지 않았습니다');
        score -= 5;
      }
    }

    if (type === 'guide') {
      if (!content.steps || content.steps.length < 3) {
        issues.push('가이드 단계가 너무 적습니다 (최소 3단계)');
        score -= 15;
      }
    }

    if (type === 'utility') {
      if (!content.inputs || content.inputs.length === 0) {
        issues.push('계산기 입력 필드가 없습니다');
        score -= 20;
      }

      if (!content.outputs || content.outputs.length === 0) {
        issues.push('계산기 출력 필드가 없습니다');
        score -= 20;
      }
    }

    // FAQ 검증
    if (!content.faq || content.faq.length < 3) {
      issues.push('FAQ가 부족합니다 (최소 3개 권장)');
      score -= 10;
    }

    return createResponse({
      valid: score >= 70,
      score: Math.max(0, score),
      issues,
      suggestions: generateSuggestions(issues, type),
    });
  } catch (error) {
    console.error('Validate content error:', error);
    return createErrorResponse('Failed to validate content', 500);
  }
}

// 콘텐츠 게시
async function handlePublishContent(id: number, env: Env): Promise<Response> {
  try {
    // 콘텐츠 상태를 published로 변경
    await env.DB.prepare(`
      UPDATE content SET status = 'published', published_at = datetime('now'), updated_at = datetime('now')
      WHERE id = ?
    `).bind(id).run();

    // 감사 로그 기록
    await env.DB.prepare(`
      INSERT INTO audit_logs (action, resource_type, resource_id, user_id)
      VALUES ('publish', 'content', ?, 1)
    `).bind(id).run();

    // 색인 제출 작업 큐에 추가
    await env.DB.prepare(`
      INSERT INTO jobs (kind, payload, priority)
      VALUES ('index_submit', ?, 1)
    `).bind(JSON.stringify({ contentId: id })).run();

    return createResponse({
      message: 'Content published successfully',
      indexed: true,
    });
  } catch (error) {
    console.error('Publish content error:', error);
    return createErrorResponse('Failed to publish content', 500);
  }
}

// 분석 데이터 내보내기
async function handleExportAnalytics(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'json';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // 데이터 조회
    const data = await env.DB.prepare(`
      SELECT * FROM analytics_events
      WHERE timestamp >= ? AND timestamp <= ?
      ORDER BY timestamp DESC
    `).bind(startDate || '2024-01-01', endDate || new Date().toISOString()).all();

    if (format === 'csv') {
      // CSV 형식으로 변환
      const csv = convertToCSV(data.results);
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="analytics-export.csv"',
        },
      });
    }

    return createResponse(data.results);
  } catch (error) {
    console.error('Export analytics error:', error);
    return createErrorResponse('Failed to export analytics', 500);
  }
}

// SEO 관리 API (임시 구현)
async function handleAdminSEOAPI(request: Request, env: Env): Promise<Response> {
  // TODO: SEO 관리 기능 구현
  return createResponse({ message: 'SEO admin API not implemented yet' });
}

// 헬퍼 함수들
function generateSuggestions(issues: string[], type: string): string[] {
  const suggestions: string[] = [];

  if (issues.some(i => i.includes('제목'))) {
    suggestions.push(`${type === 'blog' ? '블로그' : type === 'guide' ? '가이드' : '계산기'} 제목을 더 구체적으로 작성하세요`);
  }

  if (issues.some(i => i.includes('요약'))) {
    suggestions.push('콘텐츠의 핵심 내용을 2-3문장으로 요약하세요');
  }

  if (issues.some(i => i.includes('SEO'))) {
    suggestions.push('SEO 제목과 설명을 검색 키워드를 포함하여 최적화하세요');
  }

  if (issues.some(i => i.includes('본문'))) {
    suggestions.push('본문을 더 풍부하게 작성하세요 (사용팁, 예시 포함)');
  }

  if (issues.some(i => i.includes('FAQ'))) {
    suggestions.push('사용자들이 자주 물어볼 만한 질문을 FAQ로 추가하세요');
  }

  return suggestions;
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row =>
    Object.values(row).map(value =>
      typeof value === 'object' ? JSON.stringify(value) : String(value)
    ).join(',')
  );

  return [headers, ...rows].join('\n');
}
