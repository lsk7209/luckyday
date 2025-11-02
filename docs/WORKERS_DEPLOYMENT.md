# Cloudflare Workers 배포 가이드

## 🚀 Workers 배포 단계

### 1. Cloudflare 로그인

```bash
npx wrangler login
```

브라우저가 열리면 Cloudflare 계정으로 로그인하세요.

### 2. KV Namespace 생성 (캐싱용)

```bash
# CACHE 네임스페이스 생성
npx wrangler kv:namespace create CACHE
npx wrangler kv:namespace create CACHE --preview
```

생성된 ID를 `wrangler.toml`의 `[[kv_namespaces]]` 섹션에 업데이트하세요.

### 3. Workers 배포

```bash
npm run cf:deploy
```

또는 직접 실행:

```bash
npx wrangler deploy
```

### 4. 환경 변수 설정

Cloudflare Dashboard에서 환경 변수를 설정하세요:

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 접속
2. Workers & Pages → luckyday-api 선택
3. Settings → Variables and Secrets
4. 다음 변수들을 추가:

   - `OPENAI_API_KEY`: OpenAI API 키
   - `JWT_SECRET`: JWT 시크릿 (랜덤 문자열)
   - `INDEXNOW_KEY`: IndexNow API 키 (선택사항)

### 5. 배포 확인

배포가 완료되면 다음 URL로 접근할 수 있습니다:

```
https://luckyday-api.workers.dev
```

테스트:

```bash
curl https://luckyday-api.workers.dev/api/dream?limit=5
```

## 🔧 문제 해결

### 로그인 오류

만약 API 토큰을 사용해야 한다면:

1. Cloudflare Dashboard → My Profile → API Tokens
2. "Edit Cloudflare Workers" 권한으로 토큰 생성
3. 환경 변수에 설정:

```bash
export CLOUDFLARE_API_TOKEN=your-token-here
```

### KV Namespace 오류

KV Namespace가 없다는 오류가 나면:

```bash
# 네임스페이스 생성
npx wrangler kv:namespace create CACHE
npx wrangler kv:namespace create CACHE --preview
```

생성된 ID를 `wrangler.toml`에 추가하세요.

### D1 데이터베이스 연결 오류

D1 데이터베이스가 이미 생성되어 있는지 확인:

```bash
npx wrangler d1 list
```

`luckyday-db`가 목록에 있어야 합니다.

없다면:

```bash
npx wrangler d1 create luckyday-db
```

## 📝 배포 후 확인사항

1. ✅ Workers가 정상적으로 배포되었는지 확인
2. ✅ API 엔드포인트가 정상 작동하는지 테스트
3. ✅ CORS 설정이 올바른지 확인
4. ✅ 환경 변수가 올바르게 설정되었는지 확인

## 🔗 관련 링크

- [Cloudflare Workers 문서](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 문서](https://developers.cloudflare.com/workers/wrangler/)

