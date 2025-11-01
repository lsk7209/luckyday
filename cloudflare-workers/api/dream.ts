/**
 * 꿈 해몽 API 핸들러
 * Cloudflare Workers에서 D1 데이터베이스를 사용하는 API 엔드포인트
 */

import { createDreamDb } from '../../lib/d1-client';
import { Env } from '../index';

export interface DreamSymbol {
  id: number;
  slug: string;
  name: string;
  category: string;
  summary: string;
  quick_answer: string;
  body_mdx: string;
  tags: string; // JSON string
  popularity: number;
  polarities: string; // JSON string
  modifiers: string; // JSON string
  last_updated: string;
  created_at: string;
}

/**
 * 꿈 심볼 조회 API
 */
export async function getDreamSymbol(env: Env, slug: string): Promise<Response> {
  try {
    const db = createDreamDb(env.DB);
    const dream = await db.getDreamSymbol(slug);

    if (!dream) {
      return new Response(
        JSON.stringify({
          success: false,
          error: '꿈을 찾을 수 없습니다.'
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // JSON 문자열을 객체로 파싱
    const parsedDream = {
      ...dream,
      tags: JSON.parse(dream.tags || '[]'),
      polarities: JSON.parse(dream.polarities || '{}'),
      modifiers: JSON.parse(dream.modifiers || '{}')
    };

    return new Response(
      JSON.stringify({
        success: true,
        dream: parsedDream
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Get dream symbol error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: '꿈 정보를 불러오는 중 오류가 발생했습니다.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * 꿈 심볼 목록 조회 API
 */
export async function getDreamSymbols(
  env: Env,
  category?: string,
  limit = 20,
  offset = 0,
  orderBy: 'popularity' | 'name' | 'last_updated' = 'popularity'
): Promise<Response> {
  try {
    const db = createDreamDb(env.DB);
    const dreams = await db.getDreamSymbols({ category, limit, offset, orderBy });

    // JSON 문자열을 객체로 파싱
    const parsedDreams = dreams.map(dream => ({
      ...dream,
      tags: JSON.parse(dream.tags || '[]'),
      polarities: JSON.parse(dream.polarities || '{}'),
      modifiers: JSON.parse(dream.modifiers || '{}')
    }));

    return new Response(
      JSON.stringify({
        success: true,
        dreams: parsedDreams,
        total: parsedDreams.length
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Get dream symbols error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: '꿈 목록을 불러오는 중 오류가 발생했습니다.',
        dreams: []
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * 꿈 심볼 검색 API
 */
export async function searchDreamSymbols(env: Env, query: string, limit = 20): Promise<Response> {
  try {
    const db = createDreamDb(env.DB);
    
    // 검색 로그 저장 (비동기)
    db.saveSearchLog(query).catch(err => console.error('Save search log error:', err));

    const results = await db.searchDreamSymbols(query, limit);

    // JSON 문자열을 객체로 파싱
    const parsedResults = results.map(dream => ({
      ...dream,
      tags: JSON.parse(dream.tags || '[]'),
      polarities: JSON.parse(dream.polarities || '{}'),
      modifiers: JSON.parse(dream.modifiers || '{}')
    }));

    return new Response(
      JSON.stringify({
        success: true,
        results: parsedResults,
        query,
        total: parsedResults.length
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Search dream symbols error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: '검색 중 오류가 발생했습니다.',
        results: []
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * 관련 꿈 조회 API
 */
export async function getRelatedDreams(env: Env, slug: string, limit = 5): Promise<Response> {
  try {
    const db = createDreamDb(env.DB);
    const related = await db.getRelatedDreams(slug, limit);

    return new Response(
      JSON.stringify({
        success: true,
        related
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Get related dreams error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: '관련 꿈을 불러오는 중 오류가 발생했습니다.',
        related: []
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * 인기 꿈 조회 API
 */
export async function getPopularDreams(env: Env, limit = 10): Promise<Response> {
  try {
    const db = createDreamDb(env.DB);
    const dreams = await db.getPopularDreams(limit);

    const parsedDreams = dreams.map(dream => ({
      ...dream,
      tags: JSON.parse(dream.tags || '[]'),
      polarities: JSON.parse(dream.polarities || '{}'),
      modifiers: JSON.parse(dream.modifiers || '{}')
    }));

    return new Response(
      JSON.stringify({
        success: true,
        dreams: parsedDreams
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Get popular dreams error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: '인기 꿈을 불러오는 중 오류가 발생했습니다.',
        dreams: []
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

