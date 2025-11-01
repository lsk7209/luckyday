/**
 * 꿈 데이터베이스 팩토리 (DEPRECATED)
 * 
 * ⚠️ 이 파일은 더 이상 사용되지 않습니다.
 * Cloudflare Workers API를 통한 데이터 접근으로 전환되었습니다.
 * 
 * 새로운 코드에서는 `@/lib/api-client-dream`의 `workersDreamDb`를 사용하세요.
 * 
 * @deprecated Use `workersDreamDb` from `@/lib/api-client-dream` instead
 */

// 레거시 호환성을 위한 export (사용 중단 권장)
export { workersDreamDb as dreamDbClient } from './api-client-dream';
