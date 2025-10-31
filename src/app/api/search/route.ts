/**
 * 검색 API 엔드포인트
 * @description 꿈 심볼 검색 및 자동완성
 */
import { NextRequest, NextResponse } from 'next/server';
import { dreamDb } from '@/lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
        message: '검색어를 2글자 이상 입력해주세요.'
      });
    }

    // 검색 로그 저장 (비동기로 실행)
    dreamDb.saveSearchLog(query, request.headers.get('user-agent') || undefined)
      .catch(error => console.error('Search log error:', error));

    // 꿈 심볼 검색
    const results = await dreamDb.searchDreamSymbols(query, 20);

    return NextResponse.json({
      success: true,
      results,
      total: results.length,
      query
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '검색 중 오류가 발생했습니다.',
        results: []
      },
      { status: 500 }
    );
  }
}
