# 배포 가이드

이 문서는 CMS Calculator의 배포 방법을 설명합니다.

## 📋 사전 요구사항

### 필수 도구
- Node.js 20.x 이상
- npm 또는 yarn
- Git
- Cloudflare 계정

### Cloudflare 설정
1. [Cloudflare Dashboard](https://dash.cloudflare.com)에서 계정 생성
2. Wrangler CLI 설치 및 인증:
   ```bash
   npm install -g wrangler
   wrangler auth login
   ```

## 🚀 배포 방법

### 1. 로컬 환경 설정

#### 환경 변수 설정
`.env.local` 파일을 생성하고 다음 값들을 설정하세요:

```env
# Next.js 설정
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-api.your-domain.com

# Cloudflare 설정
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id

# 데이터베이스
DATABASE_ID=your-database-id

# 외부 서비스 (선택사항)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
META_PIXEL_ID=your-pixel-id
```

#### Cloudflare Workers 설정
```bash
# Wrangler 설정
wrangler auth login

# 데이터베이스 생성
wrangler d1 create cms-calculator-db

# wrangler.toml 파일에서 DATABASE_ID 업데이트
```

### 2. 로컬 테스트

#### API 서버 실행
```bash
# Cloudflare Workers 로컬 실행
npm run cf:dev
```

#### 프론트엔드 실행
```bash
# Next.js 개발 서버
npm run dev
```

#### 테스트 실행
```bash
# 유닛 테스트
npm test

# E2E 테스트
npm run test:e2e

# Lighthouse 성능 테스트
npm run lighthouse
```

### 3. 프로덕션 배포

#### 데이터베이스 마이그레이션
```bash
# 데이터베이스 스키마 생성
npm run cf:db:migrate

# 샘플 데이터 삽입
npm run cf:db:seed
```

#### API 배포
```bash
# Cloudflare Workers에 API 배포
npm run cf:deploy
```

#### 프론트엔드 배포
```bash
# Cloudflare Pages에 프론트엔드 배포
npm run build
npx wrangler pages deploy .next --compatibility-date=2024-01-01
```

### 4. 도메인 설정

#### Cloudflare Pages 도메인 설정
1. Cloudflare Dashboard → Pages
2. 프로젝트 선택 → Custom domains
3. 도메인 추가 (예: cms-calculator.com)

#### API 도메인 설정
```bash
# wrangler.toml에서 도메인 설정
routes = [
  { pattern = "api.cms-calculator.com/*", zone_name = "cms-calculator.com" }
]
```

## 🔧 고급 설정

### 환경별 설정

#### 개발 환경
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8787
NODE_ENV=development
```

#### 스테이징 환경
```bash
# .env.staging
NEXT_PUBLIC_API_URL=https://api-staging.cms-calculator.com
NODE_ENV=production
```

#### 프로덕션 환경
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.cms-calculator.com
NODE_ENV=production
```

### 모니터링 설정

#### Cloudflare Analytics
```bash
# wrangler.toml
[analytics_engine_datasets]
dataset_1 = { binding = "ANALYTICS", dataset = "cms-analytics" }
```

#### 외부 모니터링
```env
# Sentry 설정
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# LogRocket 설정
LOGROCKET_APP_ID=your-app-id
```

## 🔍 문제 해결

### 일반적인 문제

#### 1. 빌드 실패
```bash
# 캐시 정리
npm run clean
npm install
npm run build
```

#### 2. API 연결 실패
```bash
# API 상태 확인
curl https://api.cms-calculator.com/health

# 로컬 API 테스트
npm run cf:dev
curl http://localhost:8787/health
```

#### 3. 데이터베이스 연결 실패
```bash
# 데이터베이스 상태 확인
wrangler d1 list

# 마이그레이션 재실행
npm run cf:db:migrate
```

### 로그 확인

#### Cloudflare Workers 로그
```bash
# 실시간 로그
npm run cf:tail

# 특정 기간 로그
wrangler tail --since 2024-01-01T00:00:00Z
```

#### 애플리케이션 로그
```bash
# Next.js 로그 (Vercel 등에서)
vercel logs

# 로컬 로그
npm run dev 2>&1 | tee app.log
```

## 📊 성능 모니터링

### Lighthouse 점수 목표
- **Performance**: 90+ 점
- **Accessibility**: 95+ 점
- **Best Practices**: 95+ 점
- **SEO**: 95+ 점

### 모니터링 지표
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **API 응답 시간**: < 500ms
- **에러율**: < 1%

## 🔄 롤백 절차

### 긴급 롤백
```bash
# 이전 버전으로 롤백
wrangler deployments list
wrangler deployments rollback <deployment-id>

# Pages 롤백
npx wrangler pages deployment list
npx wrangler pages deployment rollback <deployment-id>
```

### 데이터베이스 롤백
```bash
# 백업에서 복원
wrangler d1 backup list cms-calculator-db
wrangler d1 backup restore cms-calculator-db <backup-id>
```

## 📞 지원

문제가 발생하면 다음 정보를 포함해서 이슈를 생성해주세요:

- Node.js 버전
- npm 버전
- Cloudflare 계정 상태
- 에러 메시지 및 로그
- 재현 단계
