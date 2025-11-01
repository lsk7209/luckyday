# Cloudflare 호스팅 오류 수정 사항

## 🔧 적용된 수정 사항

### 1. ✅ 공통 Workers API URL 유틸리티 생성

**파일**: `src/lib/workers-api-url.ts`

- 안전한 URL 결정 로직
- 여러 Pages URL 패턴 지원 (`.pages.dev`, `.pages.cloudflare.dev`)
- 타임아웃 처리 포함된 fetch 래퍼

### 2. ✅ Frontend에서 API Routes 제거 및 직접 호출

**문제**: `output: 'export'` 모드에서는 Next.js API Routes가 작동하지 않음

**수정 파일**:
- `src/app/ai/page.tsx` - OpenAI API 직접 호출 (임시)
- `src/components/advanced-search.tsx` - Workers API 직접 호출
- `src/lib/api-client-dream.ts` - 공통 유틸리티 사용

### 3. ✅ 환경 변수 처리 개선

- 더 안정적인 fallback 로직
- 여러 URL 패턴 지원
- 에러 처리 강화

### 4. ⚠️ 보안 경고

**OpenAI API 키 노출 위험**:
- 현재 `src/app/ai/page.tsx`에서 클라이언트 사이드에서 OpenAI API를 직접 호출
- API 키가 브라우저에 노출될 수 있음
- **해결책**: Workers API에 `/api/ai/interpret` 엔드포인트 추가 필요

## 📋 남은 작업

### 우선순위 높음
1. **Workers API에 AI 해몽 엔드포인트 추가**
   - 파일: `src/workers/api/ai.ts` 생성 필요
   - `POST /api/ai/interpret` 엔드포인트 구현
   - OpenAI API 호출을 Workers에서 처리
   - `src/app/ai/page.tsx`에서 Workers API 호출로 변경

2. **CORS 설정 확인**
   - Workers에서 Frontend 도메인에 대한 CORS 허용
   - 파일: `src/workers/lib/cors.ts` 확인

### 우선순위 중간
3. **API Routes 파일 정리**
   - `src/app/api/search/route.ts` - 사용하지 않지만 참고용으로 유지
   - `src/app/api/interpret/route.ts` - 사용하지 않지만 참고용으로 유지
   - 주석 추가: "output: 'export' 모드에서는 작동하지 않음"

4. **에러 처리 개선**
   - Workers API 호출 실패 시 Fallback UI
   - 네트워크 오류 처리

### 우선순위 낮음
5. **환경 변수 문서화**
   - Cloudflare Pages 환경 변수 설정 가이드
   - Workers 환경 변수 설정 가이드

## 🚀 다음 단계

1. Workers API에 `/api/ai/interpret` 엔드포인트 구현
2. `src/app/ai/page.tsx`에서 Workers API 호출로 변경
3. 빌드 및 배포 테스트
4. 실제 환경에서 동작 확인

