# Cloudflare 호스팅 오류 수정 가이드

## 🚨 주요 문제점

### 1. Next.js API Routes와 `output: 'export'` 충돌

**문제**: `next.config.js`에서 `output: 'export'`를 사용하면 정적 사이트만 생성되고, API Routes(`/api/*`)는 빌드되지 않습니다.

**영향 파일**:
- `src/app/api/search/route.ts`
- `src/app/api/interpret/route.ts`

**해결책**:
1. **옵션 A**: API Routes 제거하고 Frontend에서 직접 Workers API 호출
2. **옵션 B**: Cloudflare Pages Functions로 변환 (권장하지 않음, Workers가 더 적합)

### 2. 환경 변수 Fallback 문제

**문제**: `NEXT_PUBLIC_WORKERS_API_URL`이 없을 때 잘못된 URL 생성
```typescript
process.env.NEXT_PUBLIC_SITE_URL?.replace('pages.dev', 'workers.dev')
```

**문제점**:
- Pages URL 패턴이 다를 수 있음
- 빌드 타임에 환경 변수가 없으면 하드코딩된 URL 사용

### 3. Workers API 연결 문제

**문제**: Frontend에서 Workers API를 직접 호출할 때 CORS 또는 네트워크 오류 발생 가능

## ✅ 수정 사항

### 수정 1: API Routes 제거 및 직접 호출

API Routes를 제거하고 Frontend에서 직접 Workers API를 호출하도록 변경합니다.

### 수정 2: 환경 변수 처리 개선

더 안전한 fallback 로직 추가

### 수정 3: 에러 처리 강화

Workers API 호출 실패 시 적절한 에러 처리 및 Fallback UI

## 📋 체크리스트

- [ ] API Routes 제거 또는 주석 처리
- [ ] Frontend에서 직접 Workers API 호출 확인
- [ ] 환경 변수 fallback 로직 개선
- [ ] 에러 바운더리 추가
- [ ] CORS 설정 확인 (Workers)
- [ ] 빌드 테스트

