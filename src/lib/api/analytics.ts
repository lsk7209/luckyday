/**
 * 분석 API 서비스
 * 방문자 분석 및 통계 데이터
 */

import { apiClient } from './api-client';

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

// 이벤트 추적
export async function trackEvent(data: TrackEventRequest): Promise<void> {
  return apiClient.post<void>('/analytics/event', data);
}

// 페이지뷰 추적
export async function trackPageview(data: TrackPageviewRequest): Promise<void> {
  return apiClient.post<void>('/analytics/pageview', data);
}

// 분석 개요 조회
export async function getAnalyticsOverview(
  startDate?: string,
  endDate?: string
): Promise<AnalyticsOverview> {
  const params: Record<string, string> = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return apiClient.get<AnalyticsOverview>('/analytics/overview', params);
}

// 페이지별 통계 조회
export async function getPageStats(
  startDate?: string,
  endDate?: string,
  limit: number = 50
): Promise<PageStats[]> {
  const params: Record<string, string> = { limit: limit.toString() };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return apiClient.get<PageStats[]>('/analytics/pages', params);
}

// 채널별 통계 조회
export async function getChannelStats(
  startDate?: string,
  endDate?: string
): Promise<ChannelStats[]> {
  const params: Record<string, string> = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return apiClient.get<ChannelStats[]>('/analytics/channels', params);
}

// 실시간 메트릭 조회
export async function getRealtimeMetrics(): Promise<RealtimeMetrics> {
  return apiClient.get<RealtimeMetrics>('/analytics/realtime');
}

// 퍼널 분석 조회
export async function getFunnelData(
  funnelName: string,
  startDate?: string,
  endDate?: string
): Promise<FunnelData> {
  const params: Record<string, string> = { name: funnelName };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return apiClient.get<FunnelData>('/analytics/funnel', params);
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
  startDate?: string,
  endDate?: string,
  limit: number = 100
): Promise<KeywordPerformance[]> {
  const params: Record<string, string> = { limit: limit.toString() };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return apiClient.get<KeywordPerformance[]>('/analytics/keywords', params);
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
  sessionId: string
): Promise<SessionDetails> {
  return apiClient.get<SessionDetails>(`/analytics/session/${sessionId}`);
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
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<UserJourney> {
  const params: Record<string, string> = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return apiClient.get<UserJourney>(`/analytics/user/${userId}/journey`, params);
}
