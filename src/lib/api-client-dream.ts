/**
 * Cloudflare Workers API 클라이언트
 * 럭키데이 꿈 해몽 데이터 API 호출
 * 
 * Frontend에서 Cloudflare Workers API를 호출하여 D1 데이터베이스에 접근
 */

import { DreamSymbol as DreamSymbolType } from '@/types/dream';

import { getWorkersApiUrl } from './workers-api-url';

const WORKERS_API_URL = getWorkersApiUrl();

// 공통 타입 재export
export type DreamSymbol = DreamSymbolType;

export interface DreamSymbolListParams {
  category?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'popularity' | 'name' | 'last_updated';
}

export interface SearchResult {
  success: boolean;
  results: DreamSymbol[];
  recommendations?: DreamSymbol[];
  total: number;
  query: string;
}

// Workers API 응답 타입 변환 헬퍼
// D1에서 받은 데이터(id: number)를 DreamSymbol(id: string)로 변환
function convertDreamSymbol(data: any): DreamSymbol {
  return {
    ...data,
    id: String(data.id || data.slug), // number를 string으로 변환
    tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' ? JSON.parse(data.tags) : []),
    polarities: typeof data.polarities === 'string' ? JSON.parse(data.polarities || '{}') : (data.polarities || {}),
    modifiers: typeof data.modifiers === 'string' ? JSON.parse(data.modifiers || '{}') : (data.modifiers || {}),
  };
}

/**
 * Cloudflare Workers API를 통한 꿈 데이터베이스 클라이언트
 */
export const workersDreamDb = {
  /**
   * 꿈 심볼 조회 (slug로)
   */
  async getDreamSymbol(slug: string): Promise<DreamSymbol | null> {
    try {
      const response = await fetch(`${WORKERS_API_URL}/api/dream/${slug}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch dream: ${response.statusText}`);
      }
      const data = await response.json();
      return data.success ? convertDreamSymbol(data.dream) : null;
    } catch (error) {
      console.error('[Workers API] 꿈 심볼 조회 실패:', error);
      return null;
    }
  },

  /**
   * 꿈 심볼 목록 조회
   */
  async getDreamSymbols(params: DreamSymbolListParams = {}): Promise<DreamSymbol[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());
      if (params.orderBy) queryParams.append('orderBy', params.orderBy);

      const apiUrl = `${WORKERS_API_URL}/api/dream?${queryParams}`;
      console.log('[Workers API] 꿈 목록 요청:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Workers API] 응답 오류:', response.status, errorText);
        throw new Error(`API 오류 (${response.status}): ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('[Workers API] 응답 데이터:', { 
        success: data.success, 
        count: data.dreams?.length || 0,
        category: params.category,
        orderBy: params.orderBy
      });
      
      if (!data.success) {
        console.warn('[Workers API] API가 실패를 반환했습니다:', data.error || '알 수 없는 오류');
        return [];
      }
      
      const dreams = data.dreams || [];
      
      // 데이터가 없을 때 상세 로그
      if (dreams.length === 0) {
        if (params.limit && params.limit > 0) {
          console.warn('[Workers API] 빈 데이터 배열을 받았습니다.', {
            category: params.category || '모든 카테고리',
            limit: params.limit,
            offset: params.offset,
            orderBy: params.orderBy,
            apiUrl
          });
        } else {
          console.log('[Workers API] 데이터 없음 (limit이 0이거나 미지정)');
        }
      } else {
        console.log('[Workers API] 받은 꿈 목록:', dreams.slice(0, 5).map((d: any) => ({ 
          slug: d.slug, 
          name: d.name, 
          category: d.category 
        })));
      }
      
      return dreams.map(convertDreamSymbol);
    } catch (error) {
      console.error('[Workers API] 꿈 심볼 목록 조회 실패:', error);
      throw error; // 상위에서 처리할 수 있도록 에러를 다시 throw
    }
  },

  /**
   * 꿈 심볼 검색
   */
  async searchDreamSymbols(query: string, limit = 20): Promise<SearchResult> {
    try {
      const response = await fetch(`${WORKERS_API_URL}/api/dream/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Failed to search dreams: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        success: data.success || false,
        results: (data.results || []).map(convertDreamSymbol),
        recommendations: (data.recommendations || []).map(convertDreamSymbol),
        total: data.total || 0,
        query: data.query || query
      };
    } catch (error) {
      console.error('[Workers API] 꿈 심볼 검색 실패:', error);
      return {
        success: false,
        results: [],
        recommendations: [],
        total: 0,
        query
      };
    }
  },

  /**
   * 관련 꿈 조회
   */
  async getRelatedDreams(slug: string, limit = 5): Promise<Array<{
    slug: string;
    title: string;
    summary: string;
    type: 'dream';
    similarity: number;
  }>> {
    try {
      const response = await fetch(`${WORKERS_API_URL}/api/dream/related?slug=${slug}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch related dreams: ${response.statusText}`);
      }
      const data = await response.json();
      return data.success ? (data.related || []) : [];
    } catch (error) {
      console.error('[Workers API] 관련 꿈 조회 실패:', error);
      return [];
    }
  },

  /**
   * 인기 꿈 조회
   */
  async getPopularDreams(limit = 10): Promise<DreamSymbol[]> {
    try {
      const response = await fetch(`${WORKERS_API_URL}/api/dream/popular?limit=${limit}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch popular dreams: ${response.statusText}`);
      }
      const data = await response.json();
      const dreams = data.success ? (data.dreams || []) : [];
      return dreams.map(convertDreamSymbol);
    } catch (error) {
      console.error('[Workers API] 인기 꿈 조회 실패:', error);
      return [];
    }
  },

  /**
   * 검색 로그 저장
   */
  async saveSearchLog(query: string, userAgent?: string, ip?: string, userId?: string): Promise<void> {
    try {
      // Workers API를 통한 검색 로그 저장은 자동으로 처리됨 (API에서 처리)
      // 별도 호출 불필요
    } catch (error) {
      console.warn('[Workers API] 검색 로그 저장 실패:', error);
    }
  },

  /**
   * AI 세션 저장
   */
  async saveAiSession(prompt: unknown, result?: unknown, userId?: string): Promise<void> {
    try {
      // Workers API를 통한 AI 세션 저장은 별도 엔드포인트 필요
      // 현재는 /api/interpret에서 처리하므로 별도 호출 불필요
    } catch (error) {
      console.warn('[Workers API] AI 세션 저장 실패:', error);
    }
  }
};

