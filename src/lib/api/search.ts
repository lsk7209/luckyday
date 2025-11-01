/**
 * 검색 API 서비스 (DEPRECATED)
 * 통합 검색 기능
 *
 * ⚠️ Cloudflare Pages 정적 호스팅에서는 사용되지 않습니다.
 */

// import { apiClient } from '../api-client';
import { Content } from '@/types/content';

// 타입 정의
export interface SearchParams {
  q: string;
  type?: 'blog' | 'guide' | 'utility';
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  query: string;
  results: Content[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  suggestions?: string[];
}

// 통합 검색 (더미 구현)
export async function searchContent(_params: SearchParams): Promise<SearchResponse> {
  return Promise.resolve({
    query: _params.q,
    results: [],
    total: 0,
    limit: _params.limit || 20,
    offset: _params.offset || 0,
    hasMore: false,
  });
}

// 인기 검색어 조회 (더미 구현)
export async function getPopularSearches(_limit: number = 10): Promise<string[]> {
  return Promise.resolve([]);
}

// 검색 제안 (더미 구현)
export async function getSearchSuggestions(_query: string): Promise<string[]> {
  return Promise.resolve([]);
}

// 검색 통계
export interface SearchStats {
  totalSearches: number;
  uniqueQueries: number;
  averageResults: number;
  topQueries: Array<{
    query: string;
    count: number;
    avgResults: number;
  }>;
}

export async function getSearchStats(
  _startDate?: string,
  _endDate?: string
): Promise<SearchStats> {
  return Promise.resolve({
    totalSearches: 0,
    uniqueQueries: 0,
    averageResults: 0,
    topQueries: [],
  });
}
