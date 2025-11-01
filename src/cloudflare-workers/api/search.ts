/**
 * 검색 API 핸들러
 * 통합 검색 기능
 */

import { Env } from '../index';
import { createResponse, createErrorResponse } from './handler';

export async function handleSearchAPI(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== 'GET') {
    return createErrorResponse('Method not allowed', 405);
  }

  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  const type = url.searchParams.get('type'); // blog, guide, utility
  const tag = url.searchParams.get('tag');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  if (!query || query.trim().length < 2) {
    return createErrorResponse('Query must be at least 2 characters', 400);
  }

  try {
    let sql = `
      SELECT id, type, slug, title, summary, tags, created_at
      FROM content
      WHERE status = 'published'
      AND (
        title LIKE ? OR
        summary LIKE ? OR
        body LIKE ?
      )
    `;

    const params: any[] = [
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
    ];

    // 타입 필터
    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    // 태그 필터
    if (tag) {
      sql += ' AND tags LIKE ?';
      params.push(`%${tag}%`);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await env.DB.prepare(sql).bind(...params).all();

    // 검색어 로깅 (분석용)
    await logSearchQuery(query, result.results.length, env);

    return createResponse({
      query,
      results: result.results,
      total: result.results.length,
      limit,
      offset,
      hasMore: result.results.length === limit,
    });
  } catch (error) {
    console.error('Search error:', error);
    return createErrorResponse('Search failed', 500);
  }
}

// 검색어 로깅 함수
async function logSearchQuery(query: string, resultCount: number, env: Env) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // 기존 검색어 통계 확인
    const existing = await env.DB.prepare(`
      SELECT id, searches FROM search_daily_stats
      WHERE query = ? AND date = ?
    `).bind(query, today).first();

    if (existing) {
      // 기존 레코드 업데이트
      await env.DB.prepare(`
        UPDATE search_daily_stats
        SET searches = searches + 1, clicks = clicks + ?
        WHERE id = ?
      `).bind(resultCount > 0 ? 1 : 0, existing.id).run();
    } else {
      // 새 레코드 생성
      await env.DB.prepare(`
        INSERT INTO search_daily_stats (query, date, searches, clicks)
        VALUES (?, ?, 1, ?)
      `).bind(query, today, resultCount > 0 ? 1 : 0).run();
    }
  } catch (error) {
    console.error('Failed to log search query:', error);
    // 로깅 실패해도 검색 결과 반환
  }
}
