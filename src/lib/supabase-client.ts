/**
 * Supabase 클라이언트 설정 (DEPRECATED)
 * 
 * ⚠️ 이 파일은 더 이상 사용되지 않습니다.
 * Cloudflare D1 + Workers API 환경으로 전환되었습니다.
 * 
 * 새로운 코드에서는 `@/lib/api-client-dream`의 `workersDreamDb`를 사용하세요.
 * 
 * @deprecated Use `workersDreamDb` from `@/lib/api-client-dream` instead
 */
// import { createClient } from '@supabase/supabase-js'; // REMOVED: Supabase 의존성 제거됨

// 환경 변수가 설정되지 않은 경우 로컬 개발용 더미 값 사용
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // 로컬 개발에서는 세션 유지하지 않음
  }
});

// DreamScope 관련 데이터베이스 함수들
export const dreamDb = {
  // 꿈 심볼 조회
  async getDreamSymbol(slug: string) {
    const { data, error } = await supabase
      .from('dream_symbol')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  // 꿈 심볼 목록 조회 (페이징)
  async getDreamSymbols({
    category,
    limit = 20,
    offset = 0,
    orderBy = 'popularity'
  }: {
    category?: string;
    limit?: number;
    offset?: number;
    orderBy?: 'popularity' | 'name' | 'last_updated';
  }) {
    try {
      let query = supabase
        .from('dream_symbol')
        .select('*')
        .range(offset, offset + limit - 1);

      if (category) {
        query = query.eq('category', category);
      }

      query = query.order(orderBy, { ascending: orderBy === 'name' });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('[Supabase] 꿈 심볼 목록 조회 실패, 로컬 개발용 더미 데이터 사용:', error);

      // 로컬 개발용 더미 데이터
      const dummyDreams = [
        {
          id: 1,
          slug: 'snake-dream',
          name: '뱀 꿈',
          category: 'animal',
          summary: '뱀 꿈은 변화, 재생, 또는 잠재적 위협을 상징합니다.',
          description: '뱀 꿈은 긍정적 또는 부정적으로 해석될 수 있습니다.',
          tags: ['변화', '재생', '위협', '지혜'],
          popularity: 95,
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          slug: 'water-dream',
          name: '물 꿈',
          category: 'natural',
          summary: '물 꿈은 감정, 무의식, 또는 삶의 흐름을 상징합니다.',
          description: '물의 상태에 따라 꿈의 의미가 달라집니다.',
          tags: ['감정', '무의식', '정화', '생명'],
          popularity: 88,
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          slug: 'flying-dream',
          name: '나는 꿈',
          category: 'action',
          summary: '나는 꿈은 자유, 해방, 또는 야망을 상징합니다.',
          description: '하늘을 나는 꿈은 긍정적인 의미를 가집니다.',
          tags: ['자유', '해방', '야망', '성취'],
          popularity: 82,
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ];

      // 카테고리 필터링
      let filtered = dummyDreams;
      if (category) {
        filtered = dummyDreams.filter(dream => dream.category === category);
      }

      // 정렬
      filtered.sort((a, b) => {
        if (orderBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return b.popularity - a.popularity; // popularity desc
      });

      // 페이징
      return filtered.slice(offset, offset + limit);
    }
  },

  // 검색어로 꿈 심볼 검색
  async searchDreamSymbols(query: string, limit = 10) {
    const { data, error } = await supabase
      .from('dream_symbol')
      .select('slug, name, category, summary, popularity')
      .or(`name.ilike.%${query}%,tags.cs.{${query}}`)
      .order('popularity', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // 관련 꿈 조회
  async getRelatedDreams(slug: string, limit = 5) {
    const { data, error } = await supabase
      .from('dream_relation')
      .select(`
        weight,
        dream_symbol:dream_symbol!dream_relation_to_slug_fkey (
          slug,
          name,
          summary,
          category
        )
      `)
      .eq('from_slug', slug)
      .order('weight', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.map(item => ({
      slug: item.dream_symbol.slug,
      title: item.dream_symbol.name,
      summary: item.dream_symbol.summary,
      type: 'dream' as const,
      similarity: item.weight
    }));
  },

  // 검색 로그 저장
  async saveSearchLog(query: string, userAgent?: string) {
    const { error } = await supabase
      .from('search_log')
      .insert({
        q: query,
        ua: userAgent
      });

    if (error) throw error;
  },

  // AI 세션 저장
  async saveAiSession(prompt: any, result?: any) {
    const { data, error } = await supabase
      .from('ai_session')
      .insert({
        prompt,
        result
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
