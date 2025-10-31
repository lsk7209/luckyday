/**
 * Supabase 클라이언트 설정
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
