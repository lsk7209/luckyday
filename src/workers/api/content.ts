/**
 * 콘텐츠 API 핸들러
 * 블로그, 가이드, 계산기 CRUD 및 조회
 */

import { Env } from '../index';
import { createResponse, createErrorResponse } from './handler';

export async function handleContentAPI(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // 콘텐츠 목록 조회
  if (method === 'GET' && path === '/api/content') {
    return handleGetContentList(request, env);
  }

  // 콘텐츠 상세 조회
  if (method === 'GET' && path.match(/^\/api\/content\/\d+$/)) {
    const id = path.split('/').pop();
    return handleGetContent(parseInt(id!), env);
  }

  // 콘텐츠 생성
  if (method === 'POST' && path === '/api/content') {
    return handleCreateContent(request, env);
  }

  // 콘텐츠 수정
  if (method === 'PUT' && path.match(/^\/api\/content\/\d+$/)) {
    const id = path.split('/').pop();
    return handleUpdateContent(parseInt(id!), request, env);
  }

  // 콘텐츠 삭제
  if (method === 'DELETE' && path.match(/^\/api\/content\/\d+$/)) {
    const id = path.split('/').pop();
    return handleDeleteContent(parseInt(id!), env);
  }

  // 블로그별 API
  if (path.startsWith('/api/blog')) {
    return handleBlogAPI(request, env, ctx);
  }

  // 가이드별 API
  if (path.startsWith('/api/guide')) {
    return handleGuideAPI(request, env, ctx);
  }

  // 계산기별 API
  if (path.startsWith('/api/utility')) {
    return handleUtilityAPI(request, env, ctx);
  }

  return createErrorResponse('Not found', 404);
}

// 콘텐츠 목록 조회
async function handleGetContentList(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const status = url.searchParams.get('status') || 'published';
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  try {
    let query = 'SELECT * FROM content WHERE 1=1';
    const params: any[] = [];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const result = await env.DB.prepare(query).bind(...params).all();

    return createResponse({
      content: result.results,
      total: result.results.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get content list error:', error);
    return createErrorResponse('Failed to fetch content list', 500);
  }
}

// 콘텐츠 상세 조회
async function handleGetContent(id: number, env: Env): Promise<Response> {
  try {
    const result = await env.DB.prepare(
      'SELECT * FROM content WHERE id = ?'
    ).bind(id).first();

    if (!result) {
      return createErrorResponse('Content not found', 404);
    }

    // 계산기인 경우 추가 정보 조회
    if (result.type === 'utility') {
      const utilityResult = await env.DB.prepare(
        'SELECT * FROM utilities WHERE content_id = ?'
      ).bind(id).first();

      if (utilityResult) {
        result.utility = utilityResult;
      }
    }

    return createResponse(result);
  } catch (error) {
    console.error('Get content error:', error);
    return createErrorResponse('Failed to fetch content', 500);
  }
}

// 콘텐츠 생성
async function handleCreateContent(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json();
    const {
      type,
      slug,
      title,
      summary,
      seoTitle,
      seoDescription,
      body: contentBody,
      status = 'draft',
      tags = [],
      jsonld,
      faq = [],
      related = [],
      // 계산기 전용 필드
      category,
      version = '1.0.0',
      formulaKey,
      inputs,
      outputs,
      sources = [],
    } = body;

    // 필수 필드 검증
    if (!type || !slug || !title) {
      return createErrorResponse('Missing required fields', 400);
    }

    // 콘텐츠 삽입
    const result = await env.DB.prepare(`
      INSERT INTO content (
        type, slug, title, summary, seo_title, seo_description,
        body, status, tags, jsonld, faq, related, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      type,
      slug,
      title,
      summary,
      seoTitle,
      seoDescription,
      contentBody,
      status,
      JSON.stringify(tags),
      jsonld,
      JSON.stringify(faq),
      JSON.stringify(related)
    ).run();

    const contentId = result.meta.last_row_id;

    // 계산기인 경우 추가 정보 삽입
    if (type === 'utility' && category && formulaKey) {
      await env.DB.prepare(`
        INSERT INTO utilities (
          content_id, category, version, formula_key,
          inputs_json, outputs_json, sources
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        contentId,
        category,
        version,
        formulaKey,
        JSON.stringify(inputs || []),
        JSON.stringify(outputs || []),
        JSON.stringify(sources)
      ).run();
    }

    return createResponse({ id: contentId, message: 'Content created successfully' }, 201);
  } catch (error) {
    console.error('Create content error:', error);
    return createErrorResponse('Failed to create content', 500);
  }
}

// 콘텐츠 수정
async function handleUpdateContent(id: number, request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json();
    const {
      slug,
      title,
      summary,
      seoTitle,
      seoDescription,
      body: contentBody,
      status,
      tags,
      jsonld,
      faq,
      related,
      // 계산기 전용 필드
      category,
      version,
      formulaKey,
      inputs,
      outputs,
      sources,
    } = body;

    // 콘텐츠 업데이트
    await env.DB.prepare(`
      UPDATE content SET
        slug = ?, title = ?, summary = ?, seo_title = ?, seo_description = ?,
        body = ?, status = ?, tags = ?, jsonld = ?, faq = ?, related = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      slug,
      title,
      summary,
      seoTitle,
      seoDescription,
      contentBody,
      status,
      JSON.stringify(tags || []),
      jsonld,
      JSON.stringify(faq || []),
      JSON.stringify(related || []),
      id
    ).run();

    // 계산기인 경우 추가 정보 업데이트
    if (category && formulaKey) {
      await env.DB.prepare(`
        UPDATE utilities SET
          category = ?, version = ?, formula_key = ?,
          inputs_json = ?, outputs_json = ?, sources = ?
        WHERE content_id = ?
      `).bind(
        category,
        version,
        formulaKey,
        JSON.stringify(inputs || []),
        JSON.stringify(outputs || []),
        JSON.stringify(sources || []),
        id
      ).run();
    }

    return createResponse({ message: 'Content updated successfully' });
  } catch (error) {
    console.error('Update content error:', error);
    return createErrorResponse('Failed to update content', 500);
  }
}

// 콘텐츠 삭제
async function handleDeleteContent(id: number, env: Env): Promise<Response> {
  try {
    await env.DB.prepare('DELETE FROM content WHERE id = ?').bind(id).run();
    return createResponse({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    return createErrorResponse('Failed to delete content', 500);
  }
}

// 블로그별 API (임시 구현)
async function handleBlogAPI(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  // TODO: 블로그별 특화 API 구현
  return createResponse({ message: 'Blog API not implemented yet' });
}

// 가이드별 API (임시 구현)
async function handleGuideAPI(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  // TODO: 가이드별 특화 API 구현
  return createResponse({ message: 'Guide API not implemented yet' });
}

// 계산기별 API (임시 구현)
async function handleUtilityAPI(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  // TODO: 계산기별 특화 API 구현
  return createResponse({ message: 'Utility API not implemented yet' });
}
