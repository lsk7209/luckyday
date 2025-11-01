# Cloudflare 호스팅 오류 분석 및 해결 방안

## 🚨 발견된 주요 문제

### 1. **Next.js `output: 'export'`와 API Routes 충돌** ⚠️ **중요**

**문제**: 
- `next.config.js`에서 `output: 'export'`를 사용하면 **정적 사이트만 생성**됩니다
- API Routes (`/api/*`)는 **빌드되지 않고 작동하지 않습니다**
- Cloudflare Pages는 정적 호스팅만 지원하므로 API Routes를 실행할 수 없습니다

**영향 파일**:
- `src/app/api/search/route.ts` ❌ 작동하지 않음
- `src/app/api/interpret/route.ts` ❌ 작동하지 않음

**해결 방안**:
1. **옵션 A (권장)**: API Routes를 완전히 제거하고 Frontend에서 직접 Workers API 호출
2. **옵션 B**: `output: 'export'` 제거하고 Cloudflare Pages Functions 사용 (제한적)
3. **옵션 C**: Workers API에 모든 기능 이전

### 2. **환경 변수 Fallback 문제**

**문제**: 
- `NEXT_PUBLIC_SITE_URL`에서 Workers URL 변환 로직이 불안정
- 빌드 타임에 환경 변수가 없으면 하드코딩된 URL 사용

**해결**: ✅ 이미 수정함 - 더 안정적인 fallback 로직 추가

### 3. **Workers API 연결 문제**

**문제**: 
- Frontend에서 Workers API 직접 호출 시 CORS 문제 가능
- 네트워크 오류 시 적절한 에러 처리 필요

### 4. **OpenAI API 키 노출 위험**

**문제**: 
- `src/app/api/interpret/route.ts`에서 OpenAI API를 직접 호출
- `output: 'export'` 모드에서는 작동하지 않음
- API 키가 클라이언트에 노출되지 않도록 Workers에서 처리 필요

## ✅ 권장 해결책

### 단계 1: API Routes 완전 제거
Frontend에서 직접 Workers API를 호출하도록 변경:
- `/api/search` → `workersDreamDb.searchDreamSymbols()` 직접 호출
- `/api/interpret` → Workers API `/api/ai/interpret` 엔드포인트 생성

### 단계 2: Workers API에 AI 해몽 기능 추가
- OpenAI API 호출을 Workers에서 처리
- API 키 보안 유지

### 단계 3: 에러 처리 강화
- Workers API 호출 실패 시 적절한 Fallback
- 사용자 친화적인 에러 메시지

