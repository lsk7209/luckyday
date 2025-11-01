# 럭키데이 배포 가이드

## 📋 사전 준비사항

### 1. GitHub Secrets 설정

GitHub 저장소의 Settings > Secrets and variables > Actions에서 다음 secrets를 설정해야 합니다:

#### 필수 Secrets

```bash
# Cloudflare 설정
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id

# Next.js 환경 변수
NEXT_PUBLIC_SITE_URL=https://luckyday.pages.dev

# Supabase (선택사항)
SUPABASE_DB_URL=your-supabase-db-url
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI (선택사항)
OPENAI_API_KEY=your-openai-api-key

# IndexNow (선택사항)
INDEXNOW_KEY=your-indexnow-key
```

#### Cloudflare API Token 생성 방법

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 접속
2. My Profile > API Tokens 이동
3. "Create Token" 클릭
4. "Edit Cloudflare Workers" 템플릿 선택
5. 권한 설정:
   - Account: Cloudflare Pages: Edit
   - Account: Cloudflare Workers Scripts: Edit
   - Zone: Zone Settings: Read (선택사항)
6. Token 생성 및 복사

#### Cloudflare Account ID 확인 방법

1. Cloudflare Dashboard 접속
2. 우측 사이드바 하단에서 Account ID 확인

### 2. Cloudflare Pages 프로젝트 생성

```bash
# Wrangler CLI 설치
npm install -g wrangler

# Cloudflare 인증
wrangler login

# Pages 프로젝트 생성 (선택사항 - 자동 생성됨)
# wrangler pages project create luckyday
```

## 🚀 자동 배포 프로세스

### 배포 트리거

다음 상황에서 자동으로 배포가 시작됩니다:

1. **main 브랜치에 push**
   - 테스트 통과 시 → 빌드 → 프로덕션 배포

2. **Pull Request 생성**
   - 테스트 통과 시 → 프리뷰 배포 (PR 코멘트에 URL 자동 추가)

3. **수동 실행 (workflow_dispatch)**
   - GitHub Actions 탭에서 "Run workflow" 버튼 클릭

### 배포 파이프라인

```
1. 테스트 실행 (test job)
   ├─ Linting
   ├─ Unit Tests
   └─ E2E Tests

2. 빌드 (build job)
   └─ Next.js 프로덕션 빌드

3. 성능 검사 (lighthouse job)
   └─ Lighthouse 성능 점수 확인

4. 배포 (deploy-production job)
   ├─ Cloudflare Pages 배포
   ├─ Supabase 마이그레이션 (선택)
   ├─ 헬스 체크
   ├─ IndexNow 제출
   └─ 배포 완료 알림
```

## 📝 배포 상태 확인

### GitHub Actions에서 확인

1. 저장소의 **Actions** 탭 이동
2. 최신 워크플로우 실행 확인
3. 각 단계의 로그 확인

### Cloudflare Dashboard에서 확인

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 접속
2. Workers & Pages > Pages 이동
3. "luckyday" 프로젝트 선택
4. 배포 히스토리 및 상태 확인

## 🔧 수동 배포 (필요 시)

### 로컬에서 직접 배포

```bash
# 환경 변수 설정
export CLOUDFLARE_API_TOKEN=your-token
export CLOUDFLARE_ACCOUNT_ID=your-account-id

# 빌드 및 배포
npm run build
npx wrangler pages deploy out --project-name=luckyday
```

### 특정 브랜치로 배포

```bash
# 스테이징 배포
npm run pages:deploy:staging

# 프로덕션 배포
npm run pages:deploy:prod
```

## 🐛 배포 문제 해결

### 빌드 실패

1. 로컬에서 빌드 테스트:
   ```bash
   npm run build
   ```

2. 환경 변수 확인:
   - `.env.local` 파일 확인
   - GitHub Secrets 확인

3. 의존성 문제:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### 배포 실패

1. Cloudflare API Token 확인:
   - 권한이 올바른지 확인
   - Token이 만료되지 않았는지 확인

2. Account ID 확인:
   - 올바른 Account ID인지 확인

3. 프로젝트 이름 확인:
   - Cloudflare Pages에 "luckyday" 프로젝트가 생성되어 있는지 확인

### 헬스 체크 실패

- 배포가 완료되더라도 헬스 체크가 실패할 수 있습니다 (CDN 전파 시간)
- 5-10분 후 다시 확인
- Cloudflare Dashboard에서 배포 상태 확인

## 📊 배포 후 확인사항

### 1. 사이트 접속 확인

```bash
# 메인 페이지
https://luckyday.pages.dev

# 꿈 사전
https://luckyday.pages.dev/dream

# AI 해몽
https://luckyday.pages.dev/ai
```

### 2. 성능 확인

```bash
# Lighthouse 성능 테스트
npm run lighthouse:local
```

### 3. 에러 로그 확인

- Cloudflare Dashboard > Workers & Pages > luckyday > Logs
- 또는 GitHub Actions 로그 확인

## 🔄 롤백

### 이전 배포로 되돌리기

1. Cloudflare Dashboard 접속
2. Workers & Pages > Pages > luckyday 이동
3. 배포 히스토리에서 이전 배포 선택
4. "Rollback to this deployment" 클릭

## 📈 모니터링

### 배포 알림 설정 (선택사항)

Slack, Discord, Email 등으로 배포 완료 알림을 받으려면:

1. GitHub Actions 워크플로우 수정
2. 알림 웹훅 추가
3. 배포 완료 시 알림 전송

### 로그 모니터링

```bash
# Cloudflare Workers 로그 확인
npm run cf:tail:prod
```

## ✅ 체크리스트

배포 전 확인:

- [ ] GitHub Secrets 설정 완료
- [ ] 로컬 빌드 성공 확인
- [ ] 테스트 통과 확인
- [ ] 환경 변수 올바르게 설정됨
- [ ] Cloudflare Pages 프로젝트 생성됨

배포 후 확인:

- [ ] 사이트 접속 정상
- [ ] 헬스 체크 통과
- [ ] Lighthouse 성능 점수 확인
- [ ] 에러 로그 확인
- [ ] 검색 엔진 제출 확인

---

**자동 배포가 설정되었습니다!** main 브랜치에 push하면 자동으로 배포가 시작됩니다. 🚀

