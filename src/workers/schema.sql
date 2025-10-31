-- CMS Calculator Database Schema
-- Cloudflare D1 SQLite Database

-- 콘텐츠 테이블 (블로그, 가이드, 계산기 공통)
CREATE TABLE IF NOT EXISTS content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK (type IN ('blog', 'guide', 'utility')),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  seo_title TEXT,
  seo_description TEXT,
  body TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME,
  reading_minutes INTEGER,
  duration_minutes INTEGER,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT, -- JSON array로 저장
  jsonld TEXT, -- JSON-LD 구조화 데이터
  faq TEXT, -- JSON array로 저장
  related TEXT -- JSON array로 저장
);

-- 계산기 전용 정보 테이블
CREATE TABLE IF NOT EXISTS utilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_id INTEGER NOT NULL,
  category TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  formula_key TEXT NOT NULL,
  inputs_json TEXT NOT NULL, -- JSON schema
  outputs_json TEXT NOT NULL, -- JSON schema
  sources TEXT, -- JSON array
  FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
);

-- 사용자 테이블 (관리자용)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('viewer', 'editor', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  is_active BOOLEAN DEFAULT 1
);

-- 분석 이벤트 테이블
CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  page TEXT,
  element TEXT,
  value TEXT,
  metadata TEXT, -- JSON
  user_id TEXT, -- 가명화된 사용자 ID
  ip_hash TEXT, -- 해시된 IP
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 일일 페이지 통계
CREATE TABLE IF NOT EXISTS page_daily_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page TEXT NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  bounce_rate REAL DEFAULT 0,
  avg_session_duration REAL DEFAULT 0,
  exit_rate REAL DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  UNIQUE(page, date)
);

-- 일일 채널 통계
CREATE TABLE IF NOT EXISTS channel_daily_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel TEXT NOT NULL,
  date DATE NOT NULL,
  sessions INTEGER DEFAULT 0,
  users INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  bounce_rate REAL DEFAULT 0,
  avg_session_duration REAL DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  UNIQUE(channel, date)
);

-- 검색어 통계
CREATE TABLE IF NOT EXISTS search_daily_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,
  date DATE NOT NULL,
  searches INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr REAL DEFAULT 0,
  avg_position REAL DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  UNIQUE(query, date)
);

-- 트래킹 스크립트 테이블
CREATE TABLE IF NOT EXISTS tracking_scripts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('ga4', 'meta_pixel', 'naver_ads', 'kakao')),
  code TEXT NOT NULL,
  position TEXT NOT NULL DEFAULT 'head' CHECK (position IN ('head', 'body', 'footer')),
  is_active BOOLEAN DEFAULT 0,
  consent_required BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 색인 제출 기록
CREATE TABLE IF NOT EXISTS index_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'bing', 'naver', 'indexnow')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'indexed', 'failed')),
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  indexed_at DATETIME,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0
);

-- 작업 큐 (자동화 작업용)
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  payload TEXT, -- JSON
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  priority INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  scheduled_at DATETIME,
  started_at DATETIME,
  completed_at DATETIME,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 감사 로그
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values TEXT, -- JSON
  new_values TEXT, -- JSON
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 색인 설정
CREATE TABLE IF NOT EXISTS seo_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_slug ON content(slug);
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_published_at ON content(published_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_kind ON jobs(kind);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
