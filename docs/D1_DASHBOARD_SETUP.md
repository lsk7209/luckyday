# 🗄️ Cloudflare D1 원격 데이터베이스 설정 가이드

이 가이드는 **Cloudflare Dashboard**에서 직접 SQL을 실행하여 원격 데이터베이스를 설정하는 방법입니다.

## 📍 접속 경로

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 접속
2. **Workers & Pages** → **D1** 메뉴 클릭
3. **luckyday-db** 데이터베이스 선택 (또는 데이터베이스 ID: `8cb24e3c-6cfe-4874-a2a9-ea4f03d627f2`)
4. **Console** 탭 클릭
5. 아래 SQL을 **순서대로** 복사해서 실행

---

## ✅ 1단계: 스키마 생성

아래 SQL 전체를 복사해서 실행하세요:

```sql
-- 럭키데이 꿈 해몽 데이터베이스 스키마
CREATE TABLE IF NOT EXISTS dream_symbol (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  quick_answer TEXT NOT NULL,
  body_mdx TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  popularity INTEGER NOT NULL DEFAULT 0,
  polarities TEXT DEFAULT '{}',
  modifiers TEXT DEFAULT '{}',
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dream_relation (
  from_slug TEXT NOT NULL,
  to_slug TEXT NOT NULL,
  weight REAL NOT NULL DEFAULT 0.5,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (from_slug, to_slug)
);

CREATE TABLE IF NOT EXISTS search_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  q TEXT NOT NULL,
  ua TEXT,
  ip TEXT,
  user_id TEXT,
  ts DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_session (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  prompt TEXT NOT NULL,
  result TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  dream_slug TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, dream_slug)
);

CREATE INDEX IF NOT EXISTS idx_dream_symbol_slug ON dream_symbol(slug);
CREATE INDEX IF NOT EXISTS idx_dream_symbol_category ON dream_symbol(category);
CREATE INDEX IF NOT EXISTS idx_dream_symbol_popularity ON dream_symbol(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_dream_relation_from ON dream_relation(from_slug);
CREATE INDEX IF NOT EXISTS idx_dream_relation_weight ON dream_relation(weight DESC);
CREATE INDEX IF NOT EXISTS idx_search_log_ts ON search_log(ts DESC);
CREATE INDEX IF NOT EXISTS idx_search_log_q_ts ON search_log(q, ts DESC);
CREATE INDEX IF NOT EXISTS idx_ai_session_user ON ai_session(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
```

**✅ 실행 후 확인:**
```sql
SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table';
```
결과: `table_count`가 **5**여야 합니다.

---

## ✅ 2단계: 기본 데이터 삽입 (10개)

아래 SQL 전체를 복사해서 실행하세요:

```sql
INSERT INTO dream_symbol (slug, name, category, summary, quick_answer, body_mdx, tags, popularity) VALUES
('baem-snake-dream', '뱀 꿈', 'animal', '뱀 꿈은 변화와 갱신의 신호입니다. 꿈의 맥락에 따라 긍정적 또는 부정적 의미를 가질 수 있습니다.',
 '뱀 꿈은 대개 변화, 갱신, 회복의 의미로 해석됩니다. 검은 뱀이나 공격적인 상황에서는 관계 긴장을, 흰 뱀이나 평온한 상황에서는 긍정적 변화를 상징합니다.',
 '# 뱀 꿈 해몽\n\n뱀 꿈은 인류 역사상 가장 오래된 꿈 상징 중 하나입니다.\n\n## 긍정적 의미\n- 허물 벗기: 새로운 시작\n- 치유: 회복과 재생\n\n## 부정적 의미\n- 위험: 위협과 배신\n- 두려움: 불안과 스트레스',
 '["뱀꿈", "해몽", "변화", "갱신", "심리"]', 1250),

('tooth-loss-dream', '이빨 꿈', 'body', '이빨 꿈은 변화, 불안, 자기표현의 신호입니다.',
 '이빨 꿈은 대개 불안이나 변화의 신호로, 잃어버리는 치아의 위치에 따라 가족, 일, 대인관계 문제를 반영합니다.',
 '# 이빨 꿈 해몽\n\n이빨 꿈은 가장 흔한 꿈 중 하나입니다.\n\n## 빠지는 치아별 의미\n- 앞니: 자신감 문제\n- 어금니: 가족 스트레스\n\n## 심리학적 의미\n- 스트레스 반응\n- 변화에 대한 두려움',
 '["이빨꿈", "해몽", "불안", "변화"]', 980),

('water-dream', '물 꿈', 'element', '물 꿈은 감정 상태와 무의식을 반영합니다.',
 '물 꿈은 감정의 흐름을 상징하며, 맑은 물은 평온함, 탁한 물은 혼란스러운 감정을 나타냅니다.',
 '# 물 꿈 해몽\n\n물은 꿈에서 감정과 무의식을 상징합니다.\n\n## 물 상태별 의미\n- 맑은 물: 평온한 감정\n- 탁한 물: 혼란스러운 상황\n- 범람: 감정적 압도',
 '["물꿈", "해몽", "감정", "무의식"]', 750),

('flying-dream', '나는 꿈', 'action', '나는 꿈은 자유와 해방감을 상징합니다.',
 '나는 꿈은 자유로움과 해방감을 나타내며, 높이 날수록 긍정적인 의미가 강합니다.',
 '# 나는 꿈 해몽\n\n나는 꿈은 자유와 해방의 상징입니다.\n\n## 높이별 의미\n- 높이 날기: 긍정적 자유\n- 추락: 불안과 두려움\n- 자유롭게 날기: 해방감',
 '["나는꿈", "해몽", "자유", "해방"]', 680),

('chased-dream', '쫓기는 꿈', 'scenario', '쫓기는 꿈은 현실의 압박감을 반영합니다.',
 '쫓기는 꿈은 스트레스, 회피 경향, 압박감을 나타냅니다. 쫓는 사람이 누구인지가 중요합니다.',
 '# 쫓기는 꿈 해몽\n\n쫓기는 꿈은 가장 흔한 악몽 중 하나입니다.\n\n## 쫓는 자별 의미\n- 모르는 사람: 불특정 스트레스\n- 아는 사람: 관계 문제\n- 동물: 본능적 두려움',
 '["쫓기는꿈", "해몽", "스트레스", "압박"]', 920),

('falling-dream', '추락 꿈', 'scenario', '추락 꿈은 불안과 통제 상실감을 나타냅니다.',
 '추락 꿈은 불안정한 상황, 통제 상실감, 자신감 저하를 반영합니다.',
 '# 추락 꿈 해몽\n\n추락 꿈은 불안정한 심리 상태를 보여줍니다.\n\n## 추락 상황별 의미\n- 높은 곳에서: 자신감 저하\n- 끝없이 떨어지기: 통제 상실\n- 안전하게 착지: 긍정적 변화',
 '["추락꿈", "해몽", "불안", "통제상실"]', 780),

('money-dream', '돈 꿈', 'object', '돈 꿈은 가치, 풍요, 불안의 상징입니다.',
 '돈 꿈은 재정 상황, 가치관, 풍요로움을 반영합니다. 잃어버리는 꿈은 불안, 얻는 꿈은 긍정적입니다.',
 '# 돈 꿈 해몽\n\n돈 꿈은 경제적 상황과 가치관을 반영합니다.\n\n## 돈 관련 상황별 의미\n- 돈을 잃음: 불안과 걱정\n- 돈을 얻음: 긍정적 변화\n- 돈을 세는 꿈: 현실적 계산',
 '["돈꿈", "해몽", "재정", "가치"]', 650),

('house-dream', '집 꿈', 'place', '집 꿈은 심리적 안정감과 가족을 상징합니다.',
 '집 꿈은 심리적 안정감, 가족 관계, 자아상을 반영합니다. 집의 상태가 중요합니다.',
 '# 집 꿈 해몽\n\n집은 꿈에서 심리적 안정을 상징합니다.\n\n## 집 상태별 의미\n- 깨끗한 집: 안정감\n- 부서진 집: 불안정\n- 새로운 집: 변화',
 '["집꿈", "해몽", "안정", "가족"]', 720),

('death-dream', '죽음 꿈', 'scenario', '죽음 꿈은 변화와 재생의 신호입니다.',
 '죽음 꿈은 종종 변화와 재생의 긍정적 신호입니다. 두려워하지 마세요.',
 '# 죽음 꿈 해몽\n\n죽음 꿈은 변화와 재생을 상징합니다.\n\n## 죽음 상황별 의미\n- 자신이 죽음: 큰 변화\n- 타인이 죽음: 관계 변화\n- 부활: 재생과 회복',
 '["죽음꿈", "해몽", "변화", "재생"]', 890),

('wedding-dream', '결혼 꿈', 'scenario', '결혼 꿈은 새로운 시작과 파트너십을 상징합니다.',
 '결혼 꿈은 새로운 시작, 파트너십, 통합을 나타냅니다.',
 '# 결혼 꿈 해몽\n\n결혼 꿈은 새로운 시작을 상징합니다.\n\n## 결혼 상황별 의미\n- 자신이 결혼: 새로운 시작\n- 다른 사람이 결혼: 축하와 기쁨\n- 결혼식 참석: 사회적 관계',
 '["결혼꿈", "해몽", "새로운시작", "파트너십"]', 580);
```

**✅ 실행 후 확인:**
```sql
SELECT COUNT(*) as dream_count FROM dream_symbol;
```
결과: `dream_count`가 **10**이어야 합니다.

---

## ✅ 3단계: 확인

데이터가 잘 들어갔는지 확인:

```sql
-- 꿈 심볼 개수 및 샘플 확인
SELECT COUNT(*) as total_count FROM dream_symbol;
SELECT slug, name, category, popularity FROM dream_symbol ORDER BY popularity DESC LIMIT 5;
```

---

## 📝 추가 컨텐츠 (선택사항)

더 많은 꿈 컨텐츠를 추가하려면 `docs/D1_ADDITIONAL_CONTENT.sql` 파일의 내용을 Cloudflare Dashboard Console에서 실행하세요.

이 파일에는:
- 동물 꿈 8개 추가 (개, 고양이, 말, 곰, 사자, 물고기, 용, 코끼리)
- 감정 꿈 3개 추가 (사랑, 공포, 기쁨)
- 색상 꿈 3개 추가 (빨간색, 파란색, 하얀색)
- 신체 꿈 2개 추가 (피, 머리 빠지는)
- 꿈 관계 데이터 추가

총 **약 25개 이상의 꿈 심볼**이 됩니다.

---

## ✅ 완료!

이제 원격 데이터베이스가 준비되었습니다. Workers가 배포되면 이 데이터베이스를 사용할 수 있습니다.

