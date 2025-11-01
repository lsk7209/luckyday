/**
 * 분석 API 서비스 (DEPRECATED)
 * 방문자 분석 및 통계 데이터
 *
 * ⚠️ Cloudflare Pages 정적 호스팅에서는 사용되지 않습니다.
 * 정적 사이트에서는 분석 API가 필요하지 않습니다.
 */

// import { apiClient } from '../api-client'; // 제거됨

// 타입 정의
export interface TrackEventRequest {
  sessionId: string;
  eventType: string;
  page?: string;
  element?: string;
  value?: string | number;
  metadata?: Record<string, any>;
  referrer?: string;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}

export interface TrackPageviewRequest {
  sessionId: string;
  page: string;
  referrer?: string;
  userAgent?: string;
  utmParams?: TrackEventRequest['utmParams'];
}

export interface AnalyticsOverview {
  totalSessions: number;
  totalEvents: number;
  pageViews: number;
  avgSessionDuration: number;
  bounceRate?: number;
  conversionRate?: number;
  uniqueUsers?: number;
}

export interface PageStats {
  page: string;
  views: number;
  uniqueViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  exitRate: number;
  conversions: number;
  lastUpdated: string;
}

export interface ChannelStats {
  channel: string;
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversions: number;
}

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
  timestamp: string;
}

export interface FunnelData {
  name: string;
  steps: Array<{
    step: string;
    count: number;
    dropoff: number;
    conversionRate: number;
  }>;
  dateRange: {
    start: string;
    end: string;
  };
}

// 이벤트 추적 (더미 구현)
export async function trackEvent(_data: TrackEventRequest): Promise<void> {
  return Promise.resolve();
}

// 페이지뷰 추적 (더미 구현)
export async function trackPageview(_data: TrackPageviewRequest): Promise<void> {
  return Promise.resolve();
}

// 분석 개요 조회 (더미 구현)
export async function getAnalyticsOverview(
  _startDate?: string,
  _endDate?: string
): Promise<AnalyticsOverview> {
  return Promise.resolve({
    totalSessions: 0,
    totalEvents: 0,
    pageViews: 0,
    avgSessionDuration: 0,
  });
}

// 페이지별 통계 조회 (더미 구현)
export async function getPageStats(
  _startDate?: string,
  _endDate?: string,
  _limit: number = 50
): Promise<PageStats[]> {
  return Promise.resolve([]);
}

// 채널별 통계 조회 (더미 구현)
export async function getChannelStats(
  _startDate?: string,
  _endDate?: string
): Promise<ChannelStats[]> {
  return Promise.resolve([]);
}

// 실시간 메트릭 조회 (더미 구현)
export async function getRealtimeMetrics(): Promise<RealtimeMetrics> {
  return Promise.resolve({
    activeUsers: 0,
    currentPageViews: 0,
    topPages: [],
    topSources: [],
    eventsPerMinute: 0,
    timestamp: new Date().toISOString(),
  });
}

// 퍼널 분석 조회 (더미 구현)
export async function getFunnelData(
  _funnelName: string,
  _startDate?: string,
  _endDate?: string
): Promise<FunnelData> {
  return Promise.resolve({
    name: _funnelName,
    steps: [],
    dateRange: {
      start: _startDate || '',
      end: _endDate || '',
    },
  });
}

// 키워드 성과 분석
export interface KeywordPerformance {
  keyword: string;
  channel: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  conversions: number;
  lastUpdated: string;
}

export async function getKeywordPerformance(
  _startDate?: string,
  _endDate?: string,
  _limit: number = 100
): Promise<KeywordPerformance[]> {
  return Promise.resolve([]);
}

// 세션별 상세 데이터
export interface SessionDetails {
  sessionId: string;
  userId?: string;
  startTime: string;
  endTime?: string;
  duration: number;
  pageViews: number;
  events: Array<{
    type: string;
    page: string;
    timestamp: string;
    data?: any;
  }>;
  device: {
    userAgent: string;
    browser: string;
    os: string;
    device: string;
  };
  location: {
    country?: string;
    city?: string;
    ip?: string;
  };
  source: {
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

export async function getSessionDetails(
  _sessionId: string
): Promise<SessionDetails> {
  return Promise.resolve({
    sessionId: _sessionId,
    startTime: '',
    duration: 0,
    pageViews: 0,
    events: [],
    device: {
      userAgent: '',
      browser: '',
      os: '',
      device: '',
    },
    location: {},
    source: {},
  });
}

// 사용자 여정 분석
export interface UserJourney {
  userId: string;
  sessions: SessionDetails[];
  totalSessions: number;
  totalPageViews: number;
  totalEvents: number;
  firstVisit: string;
  lastVisit: string;
  channels: string[];
  topPages: string[];
}

export async function getUserJourney(
  _userId: string,
  _startDate?: string,
  _endDate?: string
): Promise<UserJourney> {
  return Promise.resolve({
    userId: _userId,
    sessions: [],
    totalSessions: 0,
    totalPageViews: 0,
    totalEvents: 0,
    firstVisit: '',
    lastVisit: '',
    channels: [],
    topPages: [],
  });
}
