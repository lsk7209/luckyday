/**
 * 검색 API 서비스
 * 통합 검색 기능
 */

// import { apiClient } from './api-client';
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

// 통합 검색
export async function searchContent(params: SearchParams): Promise<SearchResponse> {
  const queryParams: Record<string, string> = {
    q: params.q,
  };

  if (params.type) queryParams.type = params.type;
  if (params.limit) queryParams.limit = params.limit.toString();
  if (params.offset) queryParams.offset = params.offset.toString();
  if (params.tags && params.tags.length > 0) {
    queryParams.tags = params.tags.join(',');
  }

  return apiClient.get<SearchResponse>('/search', queryParams);
}

// 인기 검색어 조회
export async function getPopularSearches(limit: number = 10): Promise<string[]> {
  return apiClient.get<string[]>(`/search/popular?limit=${limit}`);
}

// 검색 제안
export async function getSearchSuggestions(query: string): Promise<string[]> {
  return apiClient.get<string[]>(`/search/suggestions?q=${encodeURIComponent(query)}`);
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
  startDate?: string,
  endDate?: string
): Promise<SearchStats> {
  const params: Record<string, string> = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return apiClient.get<SearchStats>('/search/stats', params);
}
