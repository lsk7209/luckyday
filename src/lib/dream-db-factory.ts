/**
 * 꿈 데이터베이스 팩토리
 * Cloudflare D1 또는 Supabase를 사용할 수 있도록 통합 인터페이스 제공
 */

import { dreamDb } from './supabase-client';

// 현재는 Supabase를 사용하지만, 환경에 따라 D1로 전환 가능
export const dreamDbClient = dreamDb;

// D1을 사용하는 경우 (Cloudflare Workers 환경)
// import { createDreamDb } from './d1-client';
// export const dreamDbClient = createDreamDb(env.DB);

