/**
 * 고급 검색 API 엔드포인트
 * @description 꿈 심볼 자연어 검색, 추천 시스템, 자동완성
 */
import { NextRequest, NextResponse } from 'next/server';
import { dreamDb } from '@/lib/supabase-client';

// 자연어 검색을 위한 키워드 매핑
const NATURAL_LANGUAGE_KEYWORDS: Record<string, string[]> = {
  // 감정 관련
  '무서운': ['공포', '무서움', '두려움'],
  '기쁜': ['행복', '기쁨', '즐거움'],
  '슬픈': ['슬픔', '우울', '눈물'],
  '화난': ['분노', '화남', '짜증'],
  '불안한': ['불안', '걱정', '초조'],

  // 상황 관련
  '죽음': ['죽음', '사망', '고인'],
  '결혼': ['결혼', '웨딩', '신랑', '신부'],
  '시험': ['시험', '합격', '불합격', '공부'],
  '돈': ['돈', '부자', '빈곤', '재물'],
  '질병': ['병', '아픔', '치료', '병원'],

  // 동물 관련
  '큰 뱀': ['뱀', '큰뱀', '보아'],
  '작은 뱀': ['뱀', '작은뱀', '독사'],
  '흰 뱀': ['뱀', '흰색', '순수'],
  '검은 뱀': ['뱀', '검정', '어둠'],

  // 색상 관련
  '빨간': ['빨강', '적색', '피'],
  '파란': ['파랑', '청색', '물'],
  '하얀': ['흰색', '백색', '순수'],
  '검은': ['검정', '흑색', '어둠'],
};

// 검색 가중치 계산 함수
function calculateSearchScore(dream: any, query: string, originalQuery: string): number {
  let score = 0;

  // 정확한 이름 일치 (최고 우선순위)
  if (dream.name.includes(query)) {
    score += 100;
  }

  // 태그 일치
  const tagMatches = dream.tags.filter((tag: string) =>
    tag.includes(query)
  ).length;
  score += tagMatches * 50;

  // 요약 내용 일치
  if (dream.summary.includes(query)) {
    score += 30;
  }

  // 자연어 키워드 확장 검색
  const naturalKeywords = NATURAL_LANGUAGE_KEYWORDS[query] || [];
  for (const keyword of naturalKeywords) {
    if (dream.name.includes(keyword) || dream.tags.some((tag: string) => tag.includes(keyword))) {
      score += 40;
    }
  }

  // 인기도 가중치 (조회수 기반)
  score += Math.min(dream.popularity / 100, 20); // 최대 20점

  // 최근 업데이트 가중치
  const daysSinceUpdate = (Date.now() - new Date(dream.last_updated).getTime()) / (1000 * 60 * 60 * 24);
  score += Math.max(0, 10 - daysSinceUpdate / 30); // 최근 30일 이내 업데이트 시 추가 점수

  return score;
}

// 추천 시스템 함수
function getRecommendations(results: any[], originalQuery: string, limit: number = 5): any[] {
  // 검색 결과에서 관련된 꿈들을 찾아 추천
  const relatedDreams = results
    .filter(dream => dream.tags.some((tag: string) => originalQuery.includes(tag)))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);

  return relatedDreams;
}

// 자동완성 함수
function getAutocompleteSuggestions(query: string): string[] {
  const suggestions = new Set<string>();

  // 기본 꿈 이름들에서 추출
  const dreamNames = ['뱀', '이빨', '물', '하늘', '집', '길', '나무', '꽃', '동물', '새'];
  dreamNames.forEach(name => {
    if (name.startsWith(query)) {
      suggestions.add(name);
    }
  });

  // 자연어 키워드에서 추출
  Object.keys(NATURAL_LANGUAGE_KEYWORDS).forEach(keyword => {
    if (keyword.startsWith(query)) {
      suggestions.add(keyword);
    }
  });

  return Array.from(suggestions).slice(0, 8);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();
    const type = searchParams.get('type') || 'search'; // search, autocomplete, recommend
    const limit = parseInt(searchParams.get('limit') || '20');

    // 자동완성 요청
    if (type === 'autocomplete') {
      if (!query || query.length < 1) {
        return NextResponse.json({
          success: true,
          suggestions: [],
          type: 'autocomplete'
        });
      }

      const suggestions = getAutocompleteSuggestions(query);
      return NextResponse.json({
        success: true,
        suggestions,
        type: 'autocomplete'
      });
    }

    // 일반 검색
    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        results: [],
        recommendations: [],
        message: '검색어를 2글자 이상 입력해주세요.',
        type: 'search'
      });
    }

    // 검색 로그 저장 (비동기로 실행)
    dreamDb.saveSearchLog(query, request.headers.get('user-agent') || undefined)
      .catch(error => console.error('Search log error:', error));

    // 기본 검색 수행
    const basicResults = await dreamDb.searchDreamSymbols(query, limit * 2); // 더 많이 가져와서 필터링

    // 고급 검색 점수 계산 및 정렬
    const scoredResults = basicResults
      .map(dream => ({
        ...dream,
        searchScore: calculateSearchScore(dream, query, query)
      }))
      .sort((a, b) => b.searchScore - a.searchScore)
      .slice(0, limit);

    // 추천 결과 생성
    const recommendations = getRecommendations(basicResults, query, 3);

    return NextResponse.json({
      success: true,
      results: scoredResults,
      recommendations,
      total: scoredResults.length,
      query,
      type: 'search',
      searchScore: scoredResults.length > 0 ? scoredResults[0].searchScore : 0
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '검색 중 오류가 발생했습니다.',
        results: [],
        recommendations: [],
        type: 'search'
      },
      { status: 500 }
    );
  }
}
