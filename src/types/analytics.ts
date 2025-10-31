// 분석 및 추적 타입 정의

// 세션 데이터
export interface Session {
  id: string;
  userId?: string;
  ipHash: string; // 가명화된 IP
  userAgent: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  entryPage: string;
  exitPage: string;
  pageViews: number;
  sessionDuration: number; // 초 단위
  bounce: boolean;
  channel: ChannelType;
  device: DeviceType;
  browser: string;
  os: string;
  country?: string; // ISO 3166-1 alpha-2
  language: string;
  createdAt: Date;
}

// 이벤트 타입
export type EventType =
  | 'page_view'
  | 'result_view'
  | 'form_submit'
  | 'faq_toggle'
  | 'related_click'
  | 'scroll_depth'
  | 'search_query'
  | 'social_share'
  | 'cta_click'
  | 'download'
  | 'external_link';

// 이벤트 데이터
export interface Event {
  id: string;
  sessionId: string;
  type: EventType;
  page: string;
  element?: string; // 클릭된 요소 식별자
  value?: string | number; // 이벤트 값
  metadata?: Record<string, any>; // 추가 메타데이터
  timestamp: Date;
}

// 채널 타입
export type ChannelType =
  | 'organic'
  | 'paid'
  | 'social'
  | 'referral'
  | 'direct'
  | 'email'
  | 'display'
  | 'unknown';

// 디바이스 타입
export type DeviceType = 'desktop' | 'mobile' | 'tablet';

// 채널 규칙
export interface ChannelRule {
  id: string;
  name: string;
  channel: ChannelType;
  conditions: ChannelCondition[];
  priority: number; // 높은 우선순위부터 적용
  enabled: boolean;
}

// 채널 조건
export interface ChannelCondition {
  field: 'referrer' | 'utm_source' | 'utm_medium' | 'hostname';
  operator: 'equals' | 'contains' | 'regex' | 'starts_with' | 'ends_with';
  value: string;
  caseSensitive?: boolean;
}

// 일일 페이지 통계
export interface PageDailyStats {
  page: string;
  date: Date;
  views: number;
  uniqueViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  exitRate: number;
  conversions: number;
}

// 일일 채널 통계
export interface ChannelDailyStats {
  channel: ChannelType;
  date: Date;
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversions: number;
}

// 일일 검색 통계
export interface SearchDailyStats {
  query: string;
  date: Date;
  searches: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  impressions: number;
}

// 키워드 성과
export interface KeywordPerformance {
  keyword: string;
  channel: ChannelType;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  conversions: number;
  lastUpdated: Date;
}

// 퍼널 단계
export type FunnelStep =
  | 'page_view'
  | 'result_view'
  | 'form_submit'
  | 'faq_toggle'
  | 'related_click'
  | 'conversion';

// 퍼널 데이터
export interface FunnelData {
  name: string;
  steps: FunnelStep[];
  data: Array<{
    step: FunnelStep;
    count: number;
    dropoff: number;
    conversionRate: number;
  }>;
  dateRange: {
    start: Date;
    end: Date;
  };
}

// 실시간 메트릭
export interface RealtimeMetrics {
  activeUsers: number;
  currentPageViews: number;
  topPages: Array<{
    page: string;
    views: number;
  }>;
  topSources: Array<{
    source: string;
    sessions: number;
  }>;
  eventsPerMinute: number;
  timestamp: Date;
}
