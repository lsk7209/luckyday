/**
 * 분석 API 핸들러
 * 방문자 분석 및 통계 데이터
 */

import { Env } from '../index';
import { createResponse, createErrorResponse } from './handler';

export async function handleAnalyticsAPI(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const method = request.method;
  const url = new URL(request.url);
  const path = url.pathname;

  // 이벤트 수집
  if (method === 'POST' && path === '/api/analytics/event') {
    return handleTrackEvent(request, env);
  }

  // 페이지뷰 수집
  if (method === 'POST' && path === '/api/analytics/pageview') {
    return handleTrackPageview(request, env);
  }

  // 분석 데이터 조회
  if (method === 'GET' && path.startsWith('/api/analytics/')) {
    return handleGetAnalytics(request, env);
  }

  return createErrorResponse('Not found', 404);
}

// 이벤트 추적
async function handleTrackEvent(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json();
    const {
      sessionId,
      eventType,
      page,
      element,
      value,
      metadata = {},
      referrer,
      utmParams = {},
    } = body;

    if (!sessionId || !eventType) {
      return createErrorResponse('Missing required fields: sessionId, eventType', 400);
    }

    // 이벤트 저장
    await env.DB.prepare(`
      INSERT INTO analytics_events (
        session_id, event_type, page, element, value, metadata,
        referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      sessionId,
      eventType,
      page,
      element,
      value,
      JSON.stringify(metadata),
      referrer,
      utmParams.source,
      utmParams.medium,
      utmParams.campaign,
      utmParams.term,
      utmParams.content
    ).run();

    // 실시간 캐시 업데이트
    await updateRealtimeMetrics(env);

    return createResponse({ success: true }, 201);
  } catch (error) {
    console.error('Track event error:', error);
    return createErrorResponse('Failed to track event', 500);
  }
}

// 페이지뷰 추적
async function handleTrackPageview(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json();
    const {
      sessionId,
      page,
      referrer,
      userAgent,
      utmParams = {},
    } = body;

    if (!sessionId || !page) {
      return createErrorResponse('Missing required fields: sessionId, page', 400);
    }

    // 페이지뷰 이벤트 저장
    await env.DB.prepare(`
      INSERT INTO analytics_events (
        session_id, event_type, page, referrer, user_agent,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content
      ) VALUES (?, 'page_view', ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      sessionId,
      page,
      referrer,
      userAgent,
      utmParams.source,
      utmParams.medium,
      utmParams.campaign,
      utmParams.term,
      utmParams.content
    ).run();

    // 일일 페이지 통계 업데이트
    await updatePageStats(page, env);

    // 실시간 캐시 업데이트
    await updateRealtimeMetrics(env);

    return createResponse({ success: true }, 201);
  } catch (error) {
    console.error('Track pageview error:', error);
    return createErrorResponse('Failed to track pageview', 500);
  }
}

// 분석 데이터 조회
async function handleGetAnalytics(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');

  try {
    // 개요 통계
    if (path === '/api/analytics/overview') {
      const overview = await getOverviewStats(startDate, endDate, env);
      return createResponse(overview);
    }

    // 페이지별 통계
    if (path === '/api/analytics/pages') {
      const pages = await getPageStats(startDate, endDate, env);
      return createResponse(pages);
    }

    // 채널별 통계
    if (path === '/api/analytics/channels') {
      const channels = await getChannelStats(startDate, endDate, env);
      return createResponse(channels);
    }

    // 실시간 메트릭
    if (path === '/api/analytics/realtime') {
      const realtime = await getRealtimeMetrics(env);
      return createResponse(realtime);
    }

    return createErrorResponse('Analytics endpoint not found', 404);
  } catch (error) {
    console.error('Get analytics error:', error);
    return createErrorResponse('Failed to fetch analytics', 500);
  }
}

// 개요 통계 조회
async function getOverviewStats(startDate: string | null, endDate: string | null, env: Env) {
  const dateFilter = buildDateFilter(startDate, endDate);

  const result = await env.DB.prepare(`
    SELECT
      COUNT(DISTINCT session_id) as total_sessions,
      COUNT(*) as total_events,
      COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as page_views,
      AVG(CASE WHEN event_type = 'page_view' THEN strftime('%s', 'now') - strftime('%s', timestamp) END) as avg_session_duration
    FROM analytics_events
    WHERE ${dateFilter}
  `).first();

  return {
    totalSessions: result.total_sessions || 0,
    totalEvents: result.total_events || 0,
    pageViews: result.page_views || 0,
    avgSessionDuration: Math.round(result.avg_session_duration || 0),
  };
}

// 페이지별 통계 조회
async function getPageStats(startDate: string | null, endDate: string | null, env: Env) {
  const dateFilter = buildDateFilter(startDate, endDate);

  const result = await env.DB.prepare(`
    SELECT
      page,
      COUNT(*) as views,
      COUNT(DISTINCT session_id) as unique_views
    FROM analytics_events
    WHERE event_type = 'page_view' AND ${dateFilter}
    GROUP BY page
    ORDER BY views DESC
    LIMIT 50
  `).all();

  return result.results;
}

// 채널별 통계 조회
async function getChannelStats(startDate: string | null, endDate: string | null, env: Env) {
  const dateFilter = buildDateFilter(startDate, endDate);

  const result = await env.DB.prepare(`
    SELECT
      CASE
        WHEN utm_source = 'google' THEN 'organic'
        WHEN utm_medium = 'social' THEN 'social'
        WHEN utm_medium = 'email' THEN 'email'
        WHEN utm_source IS NOT NULL THEN 'paid'
        WHEN referrer LIKE '%google%' THEN 'organic'
        WHEN referrer LIKE '%facebook%' OR referrer LIKE '%twitter%' THEN 'social'
        ELSE 'direct'
      END as channel,
      COUNT(DISTINCT session_id) as sessions
    FROM analytics_events
    WHERE ${dateFilter}
    GROUP BY channel
    ORDER BY sessions DESC
  `).all();

  return result.results;
}

// 실시간 메트릭 조회
async function getRealtimeMetrics(env: Env) {
  // KV에서 실시간 데이터 조회
  const cacheKey = 'realtime_metrics';
  const cached = await env.CACHE.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  // 기본값 반환
  return {
    activeUsers: 0,
    currentPageViews: 0,
    topPages: [],
    topSources: [],
    eventsPerMinute: 0,
    timestamp: new Date().toISOString(),
  };
}

// 헬퍼 함수들
function buildDateFilter(startDate: string | null, endDate: string | null): string {
  if (!startDate && !endDate) {
    // 최근 30일
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return `timestamp >= '${thirtyDaysAgo.toISOString()}'`;
  }

  let filter = '1=1';
  if (startDate) {
    filter += ` AND timestamp >= '${startDate}'`;
  }
  if (endDate) {
    filter += ` AND timestamp <= '${endDate}'`;
  }
  return filter;
}

async function updatePageStats(page: string, env: Env) {
  const today = new Date().toISOString().split('T')[0];

  const existing = await env.DB.prepare(`
    SELECT id FROM page_daily_stats WHERE page = ? AND date = ?
  `).bind(page, today).first();

  if (existing) {
    await env.DB.prepare(`
      UPDATE page_daily_stats SET views = views + 1 WHERE id = ?
    `).bind(existing.id).run();
  } else {
    await env.DB.prepare(`
      INSERT INTO page_daily_stats (page, date, views, unique_views)
      VALUES (?, ?, 1, 1)
    `).bind(page, today).run();
  }
}

async function updateRealtimeMetrics(env: Env) {
  // 실시간 메트릭 계산 및 캐시 (실제 구현에서는 더 복잡한 로직 필요)
  const metrics = {
    activeUsers: Math.floor(Math.random() * 100), // 임시 값
    currentPageViews: Math.floor(Math.random() * 1000),
    topPages: [
      { page: '/utility/calculator', views: 45 },
      { page: '/blog/tips', views: 32 },
    ],
    topSources: [
      { source: 'google', sessions: 120 },
      { source: 'direct', sessions: 85 },
    ],
    eventsPerMinute: Math.floor(Math.random() * 50),
    timestamp: new Date().toISOString(),
  };

  await env.CACHE.put('realtime_metrics', JSON.stringify(metrics), {
    expirationTtl: 300, // 5분 캐시
  });
}
