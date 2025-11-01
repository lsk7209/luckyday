-- 럭키데이 꿈 해몽 데이터베이스 스키마
-- Cloudflare D1 (SQLite) 데이터베이스용

-- =================================================================
-- 꿈 심볼 테이블
-- =================================================================

CREATE TABLE IF NOT EXISTS dream_symbol (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,          -- animal, emotion, place, object, action, color, number, body, scenario, season, time
  summary TEXT NOT NULL,
  quick_answer TEXT NOT NULL,
  body_mdx TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]', -- JSON array
  popularity INTEGER NOT NULL DEFAULT 0,
  polarities TEXT DEFAULT '{}',     -- JSON object: 긍정/주의 신호
  modifiers TEXT DEFAULT '{}',      -- JSON object: 색상/감정별 가중치
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 꿈 관계 테이블 (연관 꿈들)
CREATE TABLE IF NOT EXISTS dream_relation (
  from_slug TEXT NOT NULL,
  to_slug TEXT NOT NULL,
  weight REAL NOT NULL DEFAULT 0.5,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (from_slug, to_slug)
);

-- 검색 로그 테이블
CREATE TABLE IF NOT EXISTS search_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  q TEXT NOT NULL,
  ua TEXT,
  ip TEXT,
  user_id TEXT,
  ts DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI 세션 테이블
CREATE TABLE IF NOT EXISTS ai_session (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  prompt TEXT NOT NULL,           -- JSON
  result TEXT,                     -- JSON
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 북마크 테이블 (사용자가 저장한 꿈 해몽)
CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  dream_slug TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, dream_slug)
);

-- =================================================================
-- 인덱스 생성
-- =================================================================

CREATE INDEX IF NOT EXISTS idx_dream_symbol_slug ON dream_symbol(slug);
CREATE INDEX IF NOT EXISTS idx_dream_symbol_category ON dream_symbol(category);
CREATE INDEX IF NOT EXISTS idx_dream_symbol_popularity ON dream_symbol(popularity DESC);
CREATE INDEX IF NOT EXISTS idx_dream_relation_from ON dream_relation(from_slug);
CREATE INDEX IF NOT EXISTS idx_dream_relation_weight ON dream_relation(weight DESC);
CREATE INDEX IF NOT EXISTS idx_search_log_ts ON search_log(ts DESC);
CREATE INDEX IF NOT EXISTS idx_search_log_q_ts ON search_log(q, ts DESC);
CREATE INDEX IF NOT EXISTS idx_ai_session_user ON ai_session(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);

-- =================================================================
-- 트리거 (SQLite 제한으로 애플리케이션 레벨에서 처리)
-- =================================================================

-- SQLite는 트리거를 지원하지만, last_updated는 애플리케이션에서 관리

