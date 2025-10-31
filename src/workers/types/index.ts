// Cloudflare Workers 타입 정의

export interface DatabaseUser {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: 'viewer' | 'editor' | 'admin';
  created_at: string;
  last_login: string | null;
  is_active: number;
}

export interface DatabaseContent {
  id: number;
  type: 'blog' | 'guide' | 'utility';
  slug: string;
  title: string;
  summary: string | null;
  seo_title: string | null;
  seo_description: string | null;
  body: string | null;
  status: 'draft' | 'published' | 'archived';
  author_id: number | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  reading_minutes: number | null;
  duration_minutes: number | null;
  level: 'beginner' | 'intermediate' | 'advanced' | null;
  tags: string | null; // JSON string
  jsonld: string | null; // JSON string
  faq: string | null; // JSON string
  related: string | null; // JSON string
}

export interface DatabaseUtility {
  id: number;
  content_id: number;
  category: string;
  version: string;
  formula_key: string;
  inputs_json: string; // JSON string
  outputs_json: string; // JSON string
  sources: string | null; // JSON string
}

export interface DatabaseAnalyticsEvent {
  id: number;
  session_id: string;
  event_type: string;
  page: string | null;
  element: string | null;
  value: string | null;
  metadata: string | null; // JSON string
  user_id: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  timestamp: string;
}

export interface DatabaseJob {
  id: number;
  kind: string;
  payload: string | null; // JSON string
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: number;
  attempts: number;
  max_attempts: number;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseIndexSubmission {
  id: number;
  url: string;
  provider: 'google' | 'bing' | 'naver' | 'indexnow';
  status: 'pending' | 'submitted' | 'indexed' | 'failed';
  submitted_at: string;
  indexed_at: string | null;
  error_message: string | null;
  retry_count: number;
}

export interface DatabaseTrackingScript {
  id: number;
  name: string;
  type: 'ga4' | 'meta_pixel' | 'naver_ads' | 'kakao';
  code: string;
  position: 'head' | 'body' | 'footer';
  is_active: number;
  consent_required: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseAuditLog {
  id: number;
  user_id: number | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  old_values: string | null; // JSON string
  new_values: string | null; // JSON string
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// API 요청/응답 타입
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    timestamp: string;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ContentSearchResponse extends PaginatedResponse<DatabaseContent> {
  query: string;
}

export interface AnalyticsOverview {
  totalSessions: number;
  totalEvents: number;
  pageViews: number;
  avgSessionDuration: number;
}

export interface ValidationResult {
  valid: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
}

// 웹훅 페이로드 타입
export interface WebhookContentPublished {
  contentId: number;
  title: string;
  type: string;
  slug: string;
}

export interface WebhookSEOIndexed {
  urls: string[];
  provider: string;
  status: 'indexed' | 'failed';
}

export interface WebhookAnalyticsAlert {
  alertType: string;
  message: string;
  metrics: Record<string, any>;
  threshold: number;
}

export interface WebhookErrorOccurred {
  error: string;
  context: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
}
