# Cloudflare 환경 전환 완료 요약

## 📋 전환 개요

**이전 환경**: Supabase (PostgreSQL) + Next.js API Routes
**현재 환경**: Cloudflare D1 (SQLite) + Cloudflare Workers API + Cloudflare Pages

## ✅ 완료된 작업

### 1. Frontend 컴포넌트 전환
- ✅ `src/app/page.tsx` - Workers API 클라이언트로 전환
- ✅ `src/app/dream/page.tsx` - Workers API 클라이언트로 전환
- ✅ `src/app/dream/[slug]/page.tsx` - Workers API 클라이언트로 전환
- ✅ `src/components/shared/search-box.tsx` - Workers API 클라이언트로 전환

### 2. API Routes 프록시 전환
- ✅ `src/app/api/search/route.ts` - Workers API 프록시로 변경
- ✅ `src/app/api/interpret/route.ts` - Workers API 프록시로 변경 (AI 세션 저장)

### 3. 새로운 클라이언트 라이브러리
- ✅ `src/lib/api-client-dream.ts` - Cloudflare Workers API 클라이언트 생성
  - `getDreamSymbol()` - 개별 꿈 조회
  - `getDreamSymbols()` - 꿈 목록 조회
  - `searchDreamSymbols()` - 검색
  - `getRelatedDreams()` - 관련 꿈 조회
  - `getPopularDreams()` - 인기 꿈 조회

### 4. 의존성 정리
- ✅ `package.json`에서 `@supabase/supabase-js` 제거
- ✅ `npm uninstall` 실행 완료
- ✅ `env.example` 업데이트 (Supabase → Workers API 환경 변수)

### 5. Deprecated 파일 표시
- ⚠️ `src/lib/supabase-client.ts` - DEPRECATED 표시 추가
- ⚠️ `src/lib/dream-db-factory.ts` - DEPRECATED 표시 및 Workers API 재export

## 🔧 환경 변수 변경

### 제거된 변수
```bash
# 더 이상 필요 없음
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### 새로운 변수
```bash
# Cloudflare Workers API URL
NEXT_PUBLIC_WORKERS_API_URL=https://luckyday-api.workers.dev

# 또는 Pages URL이 있으면 자동 변환됨
NEXT_PUBLIC_SITE_URL=https://luckyday.pages.dev
```

## 📡 API 엔드포인트 구조

### Cloudflare Workers API 엔드포인트
- `GET /api/dream/:slug` - 개별 꿈 조회
- `GET /api/dream?category=&limit=&offset=&orderBy=` - 꿈 목록 조회
- `GET /api/dream/search?q=&limit=` - 검색
- `GET /api/dream/related?slug=&limit=` - 관련 꿈 조회
- `GET /api/dream/popular?limit=` - 인기 꿈 조회
- `POST /api/ai/session` - AI 세션 저장 (TODO: Workers에 구현 필요)

### Next.js API Routes (프록시)
- `GET /api/search` → Workers API `/api/dream/search` 프록시
- `POST /api/interpret` → OpenAI 직접 호출 + Workers API 세션 저장

## 🗄️ 데이터베이스 구조

### Cloudflare D1 (SQLite)
- `dream_symbol` - 꿈 심볼 데이터
- `dream_relation` - 꿈 관계 그래프
- `search_log` - 검색 로그
- `ai_session` - AI 해몽 세션
- `bookmarks` - 북마크

**스키마 파일**: `src/workers/dream-schema.sql`
**시드 파일**: `src/workers/dream-seed-full.sql`

## ⏰ Cron 작업 (자동화)

`wrangler.toml`에 정의된 Cron 트리거:

1. **사이트맵 생성** - 매일 오전 3시 10분
2. **IndexNow 전송** - 매일 오전 3시 20분
3. **인기도 업데이트** - 매일 오전 3시 30분
4. **관계 그래프 재계산** - 매일 오전 4시
5. **검색 로그 정리** - 매주 일요일 오전 5시

## 🔄 마이그레이션 체크리스트

- [x] Frontend 컴포넌트에서 `supabase-client` → `api-client-dream` 전환
- [x] API Routes를 Workers API 프록시로 변경
- [x] Supabase 의존성 제거
- [x] 환경 변수 정리
- [x] Deprecated 파일 표시
- [ ] Workers API에 AI 세션 저장 엔드포인트 추가 (TODO)
- [ ] 로컬 개발 환경에서 Workers API 모킹 설정 (선택사항)

## 🚀 배포 준비

### Cloudflare Workers 배포
```bash
npm run cf:deploy
```

### Cloudflare Pages 배포
```bash
npm run pages:deploy
```

### D1 데이터베이스 마이그레이션
```bash
# 로컬
npm run cf:db:migrate

# 원격
npx wrangler d1 execute luckyday-db --remote --file=src/workers/dream-schema.sql
npx wrangler d1 execute luckyday-db --remote --file=src/workers/dream-seed-full.sql
```

## 📝 참고 사항

1. **로컬 개발**: Workers API URL이 필요합니다. 환경 변수에 `NEXT_PUBLIC_WORKERS_API_URL`을 설정하거나 로컬 Workers를 실행하세요.

2. **Fallback 처리**: Workers API 호출 실패 시 적절한 에러 처리 및 Fallback 로직이 구현되어 있습니다.

3. **타입 안정성**: `src/lib/api-client-dream.ts`에 모든 타입이 정의되어 있어 TypeScript 타입 체크가 가능합니다.

4. **레거시 호환성**: 기존 `supabase-client.ts` 파일은 Deprecated로 표시되었지만, 완전히 제거하지 않아 레거시 코드와의 호환성을 유지합니다.

## 🔗 관련 문서

- [Cloudflare D1 설정 가이드](./CLOUDFLARE_D1_SETUP.md)
- [Cloudflare D1 Dashboard 설정](./D1_DASHBOARD_SETUP.md)
- [배포 가이드](./DEPLOYMENT.md)

