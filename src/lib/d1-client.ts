/**
 * Cloudflare D1 데이터베이스 클라이언트
 * 럭키데이 꿈 해몽 데이터베이스 함수들
 */

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1ExecResult>;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Result<T = unknown> {
  success: boolean;
  meta: {
    duration: number;
    rows_read: number;
    rows_written: number;
    last_row_id: number;
    changes: number;
  };
  results?: T[];
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

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

export interface DreamRelation {
  from_slug: string;
  to_slug: string;
  weight: number;
  created_at: string;
}

/**
 * D1 데이터베이스 클라이언트 (럭키데이)
 */
export function createDreamDb(db: D1Database) {
  return {
    /**
     * 꿈 심볼 조회 (slug로)
     */
    async getDreamSymbol(slug: string): Promise<DreamSymbol | null> {
      const result = await db
        .prepare('SELECT * FROM dream_symbol WHERE slug = ?')
        .bind(slug)
        .first<DreamSymbol>();

      return result || null;
    },

    /**
     * 꿈 심볼 목록 조회 (페이징, 필터링)
     */
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
    }): Promise<DreamSymbol[]> {
      let query = 'SELECT * FROM dream_symbol';
      const params: unknown[] = [];

      if (category) {
        query += ' WHERE category = ?';
        params.push(category);
      }

      // 정렬
      const orderByClause = orderBy === 'name' 
        ? 'ORDER BY name ASC' 
        : orderBy === 'last_updated'
        ? 'ORDER BY last_updated DESC'
        : 'ORDER BY popularity DESC';

      query += ` ${orderByClause} LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const statement = db.prepare(query);
      for (let i = 0; i < params.length; i++) {
        statement.bind(params[i]);
      }

      const result = await statement.all<DreamSymbol>();
      return result.results || [];
    },

    /**
     * 검색어로 꿈 심볼 검색
     */
    async searchDreamSymbols(query: string, limit = 10): Promise<DreamSymbol[]> {
      const searchTerm = `%${query}%`;
      const result = await db
        .prepare(`
          SELECT * FROM dream_symbol 
          WHERE name LIKE ? 
             OR summary LIKE ? 
             OR tags LIKE ?
          ORDER BY popularity DESC
          LIMIT ?
        `)
        .bind(searchTerm, searchTerm, searchTerm, limit)
        .all<DreamSymbol>();

      return result.results || [];
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
      const result = await db
        .prepare(`
          SELECT 
            dr.to_slug as slug,
            ds.name as title,
            ds.summary,
            dr.weight as similarity
          FROM dream_relation dr
          JOIN dream_symbol ds ON dr.to_slug = ds.slug
          WHERE dr.from_slug = ?
          ORDER BY dr.weight DESC
          LIMIT ?
        `)
        .bind(slug, limit)
        .all<{
          slug: string;
          title: string;
          summary: string;
          similarity: number;
        }>();

      return (result.results || []).map(item => ({
        ...item,
        type: 'dream' as const
      }));
    },

    /**
     * 검색 로그 저장
     */
    async saveSearchLog(query: string, userAgent?: string, ip?: string, userId?: string): Promise<void> {
      try {
        await db
          .prepare('INSERT INTO search_log (q, ua, ip, user_id) VALUES (?, ?, ?, ?)')
          .bind(query, userAgent || null, ip || null, userId || null)
          .run();
      } catch (error) {
        console.warn('[D1] 검색 로그 저장 실패:', error);
      }
    },

    /**
     * AI 세션 저장
     */
    async saveAiSession(prompt: unknown, result?: unknown, userId?: string): Promise<{
      id: number;
      prompt: string;
      result: string | null;
      created_at: string;
    }> {
      try {
        const promptJson = JSON.stringify(prompt);
        const resultJson = result ? JSON.stringify(result) : null;

        const insertResult = await db
          .prepare('INSERT INTO ai_session (user_id, prompt, result) VALUES (?, ?, ?) RETURNING *')
          .bind(userId || null, promptJson, resultJson)
          .first<{
            id: number;
            user_id: string | null;
            prompt: string;
            result: string | null;
            created_at: string;
          }>();

        if (!insertResult) {
          throw new Error('AI 세션 저장 실패');
        }

        return {
          id: insertResult.id,
          prompt: insertResult.prompt,
          result: insertResult.result,
          created_at: insertResult.created_at
        };
      } catch (error) {
        console.warn('[D1] AI 세션 저장 실패:', error);
        // 폴백: 더미 데이터 반환
        return {
          id: Date.now(),
          prompt: JSON.stringify(prompt),
          result: result ? JSON.stringify(result) : null,
          created_at: new Date().toISOString()
        };
      }
    },

    /**
     * 인기 꿈 조회 (인기도 상위)
     */
    async getPopularDreams(limit = 10): Promise<DreamSymbol[]> {
      const result = await db
        .prepare('SELECT * FROM dream_symbol ORDER BY popularity DESC LIMIT ?')
        .bind(limit)
        .all<DreamSymbol>();

      return result.results || [];
    },

    /**
     * 카테고리별 꿈 개수 조회
     */
    async getCategoryCounts(): Promise<Record<string, number>> {
      const result = await db
        .prepare('SELECT category, COUNT(*) as count FROM dream_symbol GROUP BY category')
        .all<{ category: string; count: number }>();

      const counts: Record<string, number> = {};
      (result.results || []).forEach(row => {
        counts[row.category] = row.count;
      });

      return counts;
    }
  };
}

