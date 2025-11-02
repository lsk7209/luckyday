# 꿈 해몽 데이터 시드 파일 적용 가이드

이 가이드는 생성된 꿈 해몽 데이터를 Cloudflare D1 데이터베이스에 적용하는 방법을 설명합니다.

## 📋 생성된 시드 파일 목록

1. **dream-schema.sql** - 데이터베이스 스키마 (테이블 생성)
2. **dream-seed.sql** - 기본 꿈 심볼 10개
3. **dream-seed-full.sql** - 확장 꿈 심볼 25개
4. **dream-seed-extended-complete.sql** - 완전 확장 꿈 심볼 115개 이상
5. **dream-seed-viral-enriched.sql** - 바이럴 확장 콘텐츠 (기존 데이터 강화)
6. **dream-seed-viral-ultra.sql** - 바이럴 울트라 콘텐츠 (새로운 바이럴 주제)

**총 약 155개 이상의 꿈 해몽 데이터 (풍부하고 바이럴 가능한 콘텐츠 포함)**

## 🚀 적용 방법

### 방법 1: npm 스크립트 사용 (권장)

#### 전체 데이터 적용 (원격 데이터베이스)
```bash
npm run cf:dream:seed:all
```

#### 로컬 개발 환경용 (로컬 데이터베이스)
```bash
npm run cf:dream:seed:all:local
```

#### 개별 파일 적용
```bash
# 스키마만 생성
npm run cf:dream:schema

# 기본 데이터만 (10개)
npm run cf:dream:seed

# 확장 데이터 (25개)
npm run cf:dream:seed:full

# 완전 확장 데이터 (115개)
npm run cf:dream:seed:extended

# 바이럴 확장 데이터 (기존 데이터 강화)
npm run cf:dream:seed:viral

# 바이럴 울트라 데이터 (새로운 바이럴 주제)
npm run cf:dream:seed:ultra
```

#### 자동 스크립트 사용 (Windows PowerShell)
```powershell
# 원격 데이터베이스
.\scripts\apply-all-dream-seeds.ps1

# 로컬 데이터베이스
.\scripts\apply-all-dream-seeds.ps1 --local
```

#### 자동 스크립트 사용 (Linux/Mac)
```bash
# 실행 권한 부여
chmod +x scripts/apply-all-dream-seeds.sh

# 원격 데이터베이스
./scripts/apply-all-dream-seeds.sh

# 로컬 데이터베이스
./scripts/apply-all-dream-seeds.sh --local
```

### 방법 2: Wrangler CLI 직접 사용

#### 원격 데이터베이스에 적용
```bash
# 1. 스키마 생성
npx wrangler d1 execute luckyday-db --file=cloudflare-workers/dream-schema.sql

# 2. 기본 데이터 삽입
npx wrangler d1 execute luckyday-db --file=cloudflare-workers/dream-seed.sql

# 3. 확장 데이터 삽입
npx wrangler d1 execute luckyday-db --file=cloudflare-workers/dream-seed-full.sql

# 4. 완전 확장 데이터 삽입
npx wrangler d1 execute luckyday-db --file=cloudflare-workers/dream-seed-extended-complete.sql
```

#### 로컬 개발 환경에 적용
```bash
# 로컬 D1 데이터베이스에 적용 (--local 플래그 추가)
npx wrangler d1 execute luckyday-db --local --file=cloudflare-workers/dream-schema.sql
npx wrangler d1 execute luckyday-db --local --file=cloudflare-workers/dream-seed.sql
npx wrangler d1 execute luckyday-db --local --file=cloudflare-workers/dream-seed-full.sql
npx wrangler d1 execute luckyday-db --local --file=cloudflare-workers/dream-seed-extended-complete.sql
```

### 방법 3: Cloudflare Dashboard에서 직접 실행

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 접속
2. **Workers & Pages** → **D1** 메뉴 클릭
3. **luckyday-db** 데이터베이스 선택
4. **Console** 탭 클릭
5. 각 SQL 파일의 내용을 복사하여 순서대로 실행:
   - `cloudflare-workers/dream-schema.sql`
   - `cloudflare-workers/dream-seed.sql`
   - `cloudflare-workers/dream-seed-full.sql`
   - `cloudflare-workers/dream-seed-extended-complete.sql`

## ✅ 데이터 확인

### 데이터 개수 확인
```bash
npx wrangler d1 execute luckyday-db --command="SELECT COUNT(*) as total FROM dream_symbol"
```

### 특정 꿈 조회
```bash
npx wrangler d1 execute luckyday-db --command="SELECT name, category, popularity FROM dream_symbol WHERE slug='baem-snake-dream'"
```

### 카테고리별 개수 확인
```bash
npx wrangler d1 execute luckyday-db --command="SELECT category, COUNT(*) as count FROM dream_symbol GROUP BY category ORDER BY count DESC"
```

### 인기 꿈 Top 10 조회
```bash
npx wrangler d1 execute luckyday-db --command="SELECT name, category, popularity FROM dream_symbol ORDER BY popularity DESC LIMIT 10"
```

## 📊 카테고리별 데이터 분포

생성된 데이터는 다음과 같이 분포되어 있습니다:

- **동물** (animal): 40개 이상
- **장소** (place): 30개 이상  
- **물건** (object): 30개 이상
- **감정/행동** (emotion/action): 25개 이상
- **시나리오** (scenario): 15개 이상
- **색상** (color): 10개 이상
- **숫자** (number): 5개 이상
- **신체** (body): 5개 이상
- **원소** (element): 5개 이상

## 🔄 데이터 업데이트

기존 데이터를 업데이트하려면:

```bash
# 기존 데이터 삭제 (주의!)
npx wrangler d1 execute luckyday-db --command="DELETE FROM dream_symbol"

# 새 데이터 삽입
npm run cf:dream:seed:all
```

## 📝 주의사항

1. **중복 실행**: 같은 데이터를 여러 번 삽입하면 `UNIQUE` 제약 조건으로 인해 에러가 발생할 수 있습니다. 중복 실행을 피하세요.

2. **순서 중요**: 반드시 다음 순서로 실행하세요:
   1. 스키마 생성
   2. 기본 데이터
   3. 확장 데이터
   4. 완전 확장 데이터
   5. 바이럴 확장 데이터
   6. 바이럴 울트라 데이터

3. **로컬 vs 원격**: 
   - `--local` 플래그는 로컬 개발용입니다
   - 플래그 없이는 원격(프로덕션) 데이터베이스에 적용됩니다

4. **백업**: 프로덕션 데이터베이스에 적용하기 전에 백업을 권장합니다:
   ```bash
   npx wrangler d1 export luckyday-db --output=backup.sql
   ```

## 🐛 문제 해결

### 에러: "UNIQUE constraint failed"
- 해결: 기존 데이터를 삭제하고 다시 삽입하거나, `INSERT OR IGNORE` 문을 사용하여 수정

### 에러: "no such table"
- 해결: 먼저 스키마를 생성해야 합니다 (`npm run cf:dream:schema`)

### 에러: "database not found"
- 해결: `wrangler.toml`에서 `database_name`과 `database_id`를 확인하세요

## 🎉 완료

데이터 적용이 완료되면 웹사이트에서 다음과 같이 확인할 수 있습니다:

- 홈페이지 (`/`) - 인기 꿈 키워드 섹션
- 꿈 사전 (`/dream`) - 전체 꿈 목록
- 꿈 상세 (`/dream/[slug]`) - 개별 꿈 해몽 페이지

## 📱 바이럴 콘텐츠 특징

생성된 바이럴 콘텐츠는 다음 특징을 포함합니다:

- ✅ **통계 데이터**: "인구의 X%가 이 꿈을 꾼다" 형식
- ✅ **실제 사례**: 실제 사용자 경험담 포함
- ✅ **실전 가이드**: 체크리스트, 질문, 행동 제안
- ✅ **FAQ**: 자주 묻는 질문
- ✅ **공유 인사이트**: 소셜미디어 공유용 인용구
- ✅ **SEO 최적화**: 다양한 검색 키워드 포함
- ✅ **감정적 공감**: 공유하고 싶게 만드는 콘텐츠

특히 다음 주제들이 높은 바이럴 잠재력을 가지고 있습니다:
- 전남친 꿈 (이별 후 감정 정리)
- 죽은 사람 꿈 (상실과 치유)
- 키스 꿈 (로맨틱 주제)
- 임신 테스트 꿈 (새로운 시작)
- 로또 당첨 꿈 (행운과 기회)

