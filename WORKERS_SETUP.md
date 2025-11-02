# 🚀 Cloudflare Workers 설정 및 배포 가이드

## 1단계: Cloudflare 로그인

터미널에서 다음 명령어를 실행하세요:

```bash
npx wrangler login
```

브라우저가 자동으로 열립니다. Cloudflare 계정으로 로그인하세요.

**주의**: 브라우저가 열리지 않으면 수동으로 다음 링크를 열어주세요:
- [Cloudflare Dashboard](https://dash.cloudflare.com)

## 2단계: KV Namespace 생성 (캐싱용)

```bash
npx wrangler kv:namespace create CACHE
```

출력된 `id` 값을 복사하세요. 예:
```
{ binding = "CACHE", id = "abc123..." }
```

`wrangler.toml` 파일의 `[[kv_namespaces]]` 섹션에 있는 `id`를 업데이트하세요.

Preview namespace도 생성:
```bash
npx wrangler kv:namespace create CACHE --preview
```

출력된 `preview_id`도 `wrangler.toml`에 업데이트하세요.

## 3단계: Workers 배포

```bash
npm run cf:deploy
```

또는:

```bash
npx wrangler deploy
```

## 4단계: 환경 변수 설정

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 접속
2. **Workers & Pages** → **luckyday-api** 선택
3. **Settings** 탭 → **Variables and Secrets** 클릭
4. 다음 환경 변수를 추가:

   | 변수명 | 값 | 필수 |
   |--------|-----|------|
   | `OPENAI_API_KEY` | OpenAI API 키 | ✅ |
   | `JWT_SECRET` | 랜덤 문자열 (보안용) | ✅ |
   | `INDEXNOW_KEY` | IndexNow API 키 | ⚠️ 선택 |

   **JWT_SECRET 생성 방법:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## 5단계: 배포 확인

배포 완료 후 다음 URL로 테스트:

```
https://luckyday-api.workers.dev/api/dream?limit=5
```

브라우저나 curl로 확인:

```bash
curl https://luckyday-api.workers.dev/api/dream?limit=5
```

## ✅ 완료 확인

- [ ] Cloudflare 로그인 완료
- [ ] KV Namespace 생성 완료
- [ ] Workers 배포 완료
- [ ] 환경 변수 설정 완료
- [ ] API 테스트 성공

## 🔧 문제 해결

### "You are not authenticated" 오류

```bash
npx wrangler login
```

다시 실행하세요.

### "Namespace not found" 오류

KV Namespace를 먼저 생성하세요 (2단계 참조).

### "Database not found" 오류

D1 데이터베이스가 이미 생성되어 있다면 문제없습니다.
`database_id = "8cb24e3c-6cfe-4874-a2a9-ea4f03d627f2"`가 `wrangler.toml`에 설정되어 있습니다.

### API가 응답하지 않음

1. Workers Dashboard에서 배포 상태 확인
2. 로그 확인: `npx wrangler tail`
3. 환경 변수가 올바르게 설정되었는지 확인

## 📝 참고

- Workers 이름: `luckyday-api`
- Workers URL: `https://luckyday-api.workers.dev`
- D1 데이터베이스: `luckyday-db` (ID: 8cb24e3c-6cfe-4874-a2a9-ea4f03d627f2)

