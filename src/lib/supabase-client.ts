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

// Supabase 의존성이 완전히 제거되어 더미 구현으로 대체
export const supabase = null as any;

// 더미 dreamDb 구현 (사용되지 않지만 타입 에러 방지)
export const dreamDb = {
  async getDreamSymbol(_slug: string) {
    throw new Error('Supabase is deprecated. Use workersDreamDb from @/lib/api-client-dream');
  },
  async getDreamSymbols(_params: any) {
    throw new Error('Supabase is deprecated. Use workersDreamDb from @/lib/api-client-dream');
  },
  async searchDreamSymbols(_query: string, _limit?: number) {
    throw new Error('Supabase is deprecated. Use workersDreamDb from @/lib/api-client-dream');
  },
  async getRelatedDreams(_slug: string, _limit?: number) {
    throw new Error('Supabase is deprecated. Use workersDreamDb from @/lib/api-client-dream');
  },
  async saveSearchLog(_query: string, _userAgent?: string) {
    throw new Error('Supabase is deprecated. Use workersDreamDb from @/lib/api-client-dream');
  },
  async saveAiSession(_prompt: any, _result?: any) {
    throw new Error('Supabase is deprecated. Use workersDreamDb from @/lib/api-client-dream');
  },
};