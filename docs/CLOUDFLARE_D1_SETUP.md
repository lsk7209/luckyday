# Cloudflare D1 데이터베이스 설정 가이드

럭키데이는 **Cloudflare D1 (SQLite)** 데이터베이스를 사용합니다.

## 1. D1 데이터베이스 생성

### Cloudflare Dashboard에서 생성

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 접속
2. Workers & Pages → D1 → Create database 클릭
3. 데이터베이스 이름: `luckyday-db` 입력
4. 리전 선택 (권장: 미국 동부 또는 아시아 태평양)
5. Create 클릭

### Wrangler CLI로 생성

```bash
npx wrangler d1 create luckyday-db
```

생성 후 출력되는 `database_id`를 `wrangler.toml`의 `database_id`에 설정하세요.

## 2. 스키마 적용

```bash
# 스키마 실행
npx wrangler d1 execute luckyday-db --file=src/workers/dream-schema.sql

# 시드 데이터 삽입
npx wrangler d1 execute luckyday-db --file=src/workers/dream-seed.sql
npx wrangler d1 execute luckyday-db --file=src/workers/dream-seed-full.sql
```

## 3. 로컬 개발

```bash
# 로컬 D1 데이터베이스 생성
npx wrangler d1 create luckyday-db --local

# 로컬 스키마 실행
npx wrangler d1 execute luckyday-db --local --file=src/workers/dream-schema.sql

# 로컬 시드 데이터 삽입
npx wrangler d1 execute luckyday-db --local --file=src/workers/dream-seed.sql
```

## 4. wrangler.toml 설정

```toml
[[d1_databases]]
binding = "DB"
database_name = "luckyday-db"
database_id = "your-actual-database-id-here"  # 실제 ID로 변경
```

## 5. 데이터 확인

```bash
# 전체 꿈 심볼 조회
npx wrangler d1 execute luckyday-db --command="SELECT COUNT(*) FROM dream_symbol"

# 특정 꿈 조회
npx wrangler d1 execute luckyday-db --command="SELECT * FROM dream_symbol WHERE slug='baem-snake-dream'"
```

## 6. 데이터베이스 백업

```bash
# 전체 데이터베이스 백업
npx wrangler d1 export luckyday-db --output=backup.sql

# 백업 복원
npx wrangler d1 execute luckyday-db --file=backup.sql
```

## 7. Cron 작업 설정

`wrangler.toml`에 이미 Cron 작업이 설정되어 있습니다:

```toml
[triggers.crons]
# 꿈 인기도 업데이트 (매일 오전 3시 30분)
dream_popularity_update = "30 3 * * *"
# 꿈 관계 그래프 재계산 (매일 오전 4시)
dream_relation_rebuild = "0 4 * * *"
# 검색 로그 정리 (매주 일요일 오전 5시)
search_log_cleanup = "0 5 * * 0"
```

## 8. API 엔드포인트

Workers API 엔드포인트:

- `GET /api/dream` - 꿈 목록
- `GET /api/dream/:slug` - 특정 꿈 조회
- `GET /api/dream/search?q=...` - 검색
- `GET /api/dream/related?slug=...` - 관련 꿈
- `GET /api/dream/popular` - 인기 꿈

## 9. 주의사항

- **JSON 저장**: D1은 JSON 타입을 직접 지원하지 않으므로 TEXT로 저장하고 애플리케이션에서 파싱합니다.
- **UUID**: UUID 대신 INTEGER AUTOINCREMENT 사용
- **날짜**: timestamptz 대신 DATETIME 사용
- **배열**: PostgreSQL 배열 타입 대신 JSON TEXT로 저장

## 10. 마이그레이션

새로운 꿈 컨텐츠 추가 시:

```bash
# 새로운 데이터 추가
npx wrangler d1 execute luckyday-db --file=supabase-dreams-final.sql

# 상세 콘텐츠 업데이트
npx wrangler d1 execute luckyday-db --file=supabase-dreams-detailed-content.sql
```

