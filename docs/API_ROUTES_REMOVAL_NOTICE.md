# API Routes 제거 안내

## ⚠️ 중요: Next.js API Routes는 `output: 'export'` 모드에서 작동하지 않습니다

### 문제점

`next.config.js`에서 `output: 'export'`를 사용하면:
- Next.js가 **정적 사이트만 생성**합니다
- API Routes (`/api/*`)는 **빌드되지 않고 실행되지 않습니다**
- Cloudflare Pages는 정적 호스팅만 지원하므로 서버리스 함수가 필요합니다

### 해결책

Frontend에서 **직접 Cloudflare Workers API를 호출**하도록 변경했습니다.

### 변경된 파일

#### ✅ 수정 완료
- `src/app/ai/page.tsx` - OpenAI API 직접 호출 (Workers 엔드포인트 구현 전까지)
- `src/components/advanced-search.tsx` - Workers API 직접 호출

#### ⚠️ 주의: API Routes 파일은 유지하되 사용하지 않음
- `src/app/api/search/route.ts` - 더 이상 사용되지 않음 (빌드되지 않음)
- `src/app/api/interpret/route.ts` - 더 이상 사용되지 않음 (빌드되지 않음)

### 새로운 구조

```
Frontend Component
    ↓
Workers API (https://luckyday-api.workers.dev)
    ↓
Cloudflare D1 Database
```

### TODO

1. ✅ Frontend에서 Workers API 직접 호출 구현
2. ⚠️ Workers API에 `/api/ai/interpret` 엔드포인트 추가 필요
   - 현재는 클라이언트에서 OpenAI API 직접 호출 (보안상 권장하지 않음)
   - Workers에서 OpenAI API 키를 관리하고 호출하도록 변경 필요

3. ⚠️ CORS 설정 확인
   - Workers에서 Frontend 도메인에 대한 CORS 허용 필요

### 환경 변수

```bash
# Cloudflare Pages 환경 변수에 설정 필요
NEXT_PUBLIC_WORKERS_API_URL=https://luckyday-api.workers.dev
# 또는
NEXT_PUBLIC_SITE_URL=https://luckyday.pages.dev
```

