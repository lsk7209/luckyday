/**
 * Cron 작업 핸들러
 * Cloudflare Workers Cron Triggers
 */

import { Env } from './index';

// Cron 작업 타입
export interface CronJob {
  name: string;
  schedule: string; // cron 표현식
  handler: (env: Env) => Promise<void>;
  enabled: boolean;
}

// 등록된 Cron 작업들
export const cronJobs: CronJob[] = [
  {
    name: 'sitemap-refresh',
    schedule: '0 */6 * * *', // 6시간마다
    handler: handleSitemapRefresh,
    enabled: true,
  },
  {
    name: 'index-submission',
    schedule: '0 2 * * *', // 매일 오전 2시
    handler: handleIndexSubmission,
    enabled: true,
  },
  {
    name: 'analytics-aggregation',
    schedule: '0 3 * * *', // 매일 오전 3시
    handler: handleAnalyticsAggregation,
    enabled: true,
  },
  {
    name: 'broken-link-scan',
    schedule: '0 4 * * 1', // 매주 월요일 오전 4시
    handler: handleBrokenLinkScan,
    enabled: true,
  },
  {
    name: 'content-refresh-queue',
    schedule: '*/30 * * * *', // 30분마다
    handler: handleContentRefreshQueue,
    enabled: true,
  },
  {
    name: 'dream-popularity-update',
    schedule: '30 3 * * *', // 매일 오전 3시 30분
    handler: handleDreamPopularityUpdate,
    enabled: true,
  },
  {
    name: 'dream-relation-rebuild',
    schedule: '0 4 * * *', // 매일 오전 4시
    handler: handleDreamRelationRebuild,
    enabled: true,
  },
  {
    name: 'search-log-cleanup',
    schedule: '0 5 * * 0', // 매주 일요일 오전 5시
    handler: handleSearchLogCleanup,
    enabled: true,
  },
];

// 메인 Cron 핸들러
export async function handleCron(event: ScheduledEvent, env: Env) {
  const cronTime = event.cron;

  console.log(`🔄 Cron job triggered: ${cronTime}`);

  try {
    // 실행할 작업 찾기
    const job = cronJobs.find(job =>
      job.enabled && matchesCronPattern(job.schedule, cronTime)
    );

    if (job) {
      console.log(`🚀 Executing cron job: ${job.name}`);
      await job.handler(env);
      console.log(`✅ Cron job completed: ${job.name}`);
    } else {
      console.log(`⚠️  No matching cron job found for: ${cronTime}`);
    }
  } catch (error) {
    console.error(`❌ Cron job failed:`, error);

    // 에러 로깅 (실제로는 외부 로깅 서비스로 전송)
    await logCronError(env, cronTime, error);
  }
}

// Cron 패턴 매칭 (단순화된 버전)
function matchesCronPattern(pattern: string, cronTime: string): boolean {
  // 실제 구현에서는 cron-parser 라이브러리 사용 권장
  // 여기서는 간단한 매칭 로직
  const [minute, hour, day, month, dayOfWeek] = pattern.split(' ');

  // 현재 시간 정보 (cronTime에서 추출)
  // 실제로는 cronTime을 파싱해서 비교해야 함
  // 여기서는 간단한 구현

  return true; // 모든 패턴에 대해 true 반환 (실제 구현 필요)
}

// 사이트맵 갱신 작업 (꿈 해몽 포함)
async function handleSitemapRefresh(env: Env) {
  console.log('🔄 Refreshing sitemaps...');

  try {
    // 모든 콘텐츠 타입에 대한 사이트맵 생성
    const contentTypes = ['blog', 'guide', 'utility'];

    for (const type of contentTypes) {
      await generateSitemap(env, type);
    }

    // 꿈 해몽 사이트맵 생성
    await generateDreamSitemap(env);

    // 메인 사이트맵 갱신
    await generateMainSitemap(env);

    console.log('✅ Sitemaps refreshed successfully');
  } catch (error) {
    console.error('❌ Sitemap refresh failed:', error);
    throw error;
  }
}

// 꿈 해몽 사이트맵 생성
async function generateDreamSitemap(env: Env) {
  const dreams = await env.DB.prepare(`
    SELECT slug, last_updated FROM dream_symbol
    ORDER BY popularity DESC
  `).all<{ slug: string; last_updated: string }>();

  const urls = (dreams.results || []).map(dream => ({
    loc: `https://luckyday.pages.dev/dream/${dream.slug}`,
    lastmod: dream.last_updated,
    changefreq: 'weekly',
    priority: '0.8',
  }));

  // XML 생성 및 R2에 저장
  const sitemapXml = generateSitemapXml(urls);
  await env.STORAGE.put('sitemaps/dreams.xml', sitemapXml, {
    httpMetadata: {
      contentType: 'application/xml',
    },
  });
}

// 색인 제출 작업
async function handleIndexSubmission(env: Env) {
  console.log('🔄 Submitting URLs to search engines...');

  try {
    // 대기 중인 색인 제출 작업 조회
    const pendingUrls = await env.DB.prepare(`
      SELECT url, provider FROM index_submissions
      WHERE status = 'pending' AND retry_count < 3
      ORDER BY submitted_at ASC
      LIMIT 50
    `).all();

    for (const row of pendingUrls.results || []) {
      const { url, provider } = row as any;

      try {
        await submitToSearchEngine(env, url, provider);
        await updateSubmissionStatus(env, url, provider, 'submitted');
      } catch (error) {
        console.error(`Failed to submit ${url} to ${provider}:`, error);
        await incrementRetryCount(env, url, provider);
      }
    }

    console.log(`✅ Submitted ${pendingUrls.results?.length || 0} URLs`);
  } catch (error) {
    console.error('❌ Index submission failed:', error);
    throw error;
  }
}

// 분석 데이터 집계 작업
async function handleAnalyticsAggregation(env: Env) {
  console.log('🔄 Aggregating analytics data...');

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];

  try {
    // 일일 페이지 통계 집계
    await env.DB.exec(`
      INSERT OR REPLACE INTO page_daily_stats (page, date, views, unique_views, bounce_rate, avg_session_duration)
      SELECT
        page,
        DATE(timestamp) as date,
        COUNT(*) as views,
        COUNT(DISTINCT session_id) as unique_views,
        AVG(CASE WHEN event_type = 'bounce' THEN 1 ELSE 0 END) as bounce_rate,
        AVG(session_duration) as avg_session_duration
      FROM analytics_events
      WHERE DATE(timestamp) = ?
      GROUP BY page, DATE(timestamp)
    `, [dateStr]);

    // 일일 채널 통계 집계
    await env.DB.exec(`
      INSERT OR REPLACE INTO channel_daily_stats (channel, date, sessions, users, page_views, bounce_rate)
      SELECT
        COALESCE(utm_source, 'direct') as channel,
        DATE(timestamp) as date,
        COUNT(DISTINCT session_id) as sessions,
        COUNT(DISTINCT user_id) as users,
        COUNT(*) as page_views,
        AVG(CASE WHEN event_type = 'bounce' THEN 1 ELSE 0 END) as bounce_rate
      FROM analytics_events
      WHERE DATE(timestamp) = ?
      GROUP BY COALESCE(utm_source, 'direct'), DATE(timestamp)
    `, [dateStr]);

    console.log('✅ Analytics data aggregated');
  } catch (error) {
    console.error('❌ Analytics aggregation failed:', error);
    throw error;
  }
}

// 깨진 링크 스캔 작업
async function handleBrokenLinkScan(env: Env) {
  console.log('🔄 Scanning for broken links...');

  try {
    // 모든 콘텐츠에서 링크 추출 및 검증
    const content = await env.DB.prepare(`
      SELECT id, body FROM content WHERE status = 'published'
    `).all();

    const brokenLinks: Array<{ contentId: number; url: string; status: number }> = [];

    for (const row of content.results || []) {
      const { id, body } = row as any;
      const links = extractLinksFromContent(body);

      for (const url of links) {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          if (!response.ok) {
            brokenLinks.push({ contentId: id, url, status: response.status });
          }
        } catch (error) {
          brokenLinks.push({ contentId: id, url, status: 0 });
        }
      }
    }

    // 깨진 링크 로깅
    for (const link of brokenLinks) {
      console.warn(`Broken link found in content ${link.contentId}: ${link.url} (${link.status})`);
    }

    console.log(`✅ Found ${brokenLinks.length} broken links`);
  } catch (error) {
    console.error('❌ Broken link scan failed:', error);
    throw error;
  }
}

// 콘텐츠 리프레시 큐 처리
async function handleContentRefreshQueue(env: Env) {
  console.log('🔄 Processing content refresh queue...');

  try {
    // 대기 중인 작업 조회
    const jobs = await env.DB.prepare(`
      SELECT id, payload FROM jobs
      WHERE status = 'pending' AND kind = 'content_refresh'
      ORDER BY priority DESC, created_at ASC
      LIMIT 10
    `).all();

    for (const job of jobs.results || []) {
      const { id, payload } = job as any;
      const { contentId, action } = JSON.parse(payload);

      try {
        await processContentRefresh(env, contentId, action);
        await updateJobStatus(env, id, 'completed');
      } catch (error) {
        console.error(`Content refresh failed for job ${id}:`, error);
        await updateJobStatus(env, id, 'failed', error.message);
      }
    }

    console.log(`✅ Processed ${jobs.results?.length || 0} content refresh jobs`);
  } catch (error) {
    console.error('❌ Content refresh queue processing failed:', error);
    throw error;
  }
}

// 헬퍼 함수들
async function generateSitemap(env: Env, type: string) {
  // 사이트맵 생성 로직
  const content = await env.DB.prepare(`
    SELECT slug, updated_at FROM content
    WHERE type = ? AND status = 'published'
    ORDER BY updated_at DESC
  `).bind(type).all();

  const urls = content.results?.map((row: any) => ({
    loc: `https://your-domain.com/${type}/${row.slug}`,
    lastmod: row.updated_at,
    changefreq: type === 'blog' ? 'weekly' : 'monthly',
    priority: type === 'blog' ? '0.8' : '0.6',
  })) || [];

  // XML 생성 및 R2에 저장
  const sitemapXml = generateSitemapXml(urls);
  await env.STORAGE.put(`sitemaps/${type}.xml`, sitemapXml, {
    httpMetadata: {
      contentType: 'application/xml',
    },
  });
}

async function generateMainSitemap(env: Env) {
  const sitemaps = [
    'https://your-domain.com/sitemap-blog.xml',
    'https://your-domain.com/sitemap-guide.xml',
    'https://your-domain.com/sitemap-utility.xml',
  ];

  const sitemapXml = generateSitemapIndexXml(sitemaps);
  await env.STORAGE.put('sitemap.xml', sitemapXml, {
    httpMetadata: {
      contentType: 'application/xml',
    },
  });
}

async function submitToSearchEngine(env: Env, url: string, provider: string) {
  const endpoints = {
    google: 'https://www.google.com/ping?sitemap=',
    bing: 'https://www.bing.com/ping?sitemap=',
    indexnow: 'https://api.indexnow.org/indexnow',
  };

  if (provider === 'indexnow') {
    // IndexNow API 호출
    const response = await fetch(endpoints.indexnow, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'your-domain.com',
        key: env.INDEXNOW_KEY,
        keyLocation: 'https://your-domain.com/indexnow-key.txt',
        urlList: [url],
      }),
    });
    if (!response.ok) throw new Error(`IndexNow submission failed: ${response.status}`);
  } else {
    // 일반 ping 서비스
    const sitemapUrl = `${endpoints[provider as keyof typeof endpoints]}https://your-domain.com/sitemap.xml`;
    const response = await fetch(sitemapUrl);
    if (!response.ok) throw new Error(`Ping failed: ${response.status}`);
  }
}

function extractLinksFromContent(content: string): string[] {
  const linkRegex = /https?:\/\/[^\s<>"']+/g;
  return content.match(linkRegex) || [];
}

function generateSitemapXml(urls: any[]): string {
  const urlElements = urls.map(url => `
    <url>
      <loc>${url.loc}</loc>
      <lastmod>${url.lastmod}</lastmod>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
    </url>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlElements}
</urlset>`;
}

function generateSitemapIndexXml(sitemaps: string[]): string {
  const sitemapElements = sitemaps.map(url => `
    <sitemap>
      <loc>${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapElements}
</sitemapindex>`;
}

// 꿈 인기도 업데이트 작업
async function handleDreamPopularityUpdate(env: Env) {
  console.log('🔄 Updating dream popularity...');

  try {
    // 최근 검색 로그를 기반으로 인기도 업데이트
    const searchLogs = await env.DB.prepare(`
      SELECT q, COUNT(*) as count
      FROM search_log
      WHERE ts >= datetime('now', '-7 days')
      GROUP BY q
      ORDER BY count DESC
    `).all<{ q: string; count: number }>();

    for (const log of searchLogs.results || []) {
      // 검색어가 포함된 꿈들의 인기도 증가
      await env.DB.prepare(`
        UPDATE dream_symbol
        SET popularity = popularity + ?
        WHERE name LIKE ? OR summary LIKE ? OR tags LIKE ?
      `).bind(
        Math.min(log.count * 5, 100), // 최대 100점 증가
        `%${log.q}%`,
        `%${log.q}%`,
        `%${log.q}%`
      ).run();
    }

    console.log(`✅ Updated popularity for ${searchLogs.results?.length || 0} dreams`);
  } catch (error) {
    console.error('❌ Dream popularity update failed:', error);
    throw error;
  }
}

// 꿈 관계 그래프 재계산 작업
async function handleDreamRelationRebuild(env: Env) {
  console.log('🔄 Rebuilding dream relations...');

  try {
    // 기존 관계 삭제 (선택사항 - 완전 재구축 시)
    // await env.DB.prepare('DELETE FROM dream_relation').run();

    // 꿈 심볼들을 모두 조회
    const dreams = await env.DB.prepare('SELECT slug, category, tags FROM dream_symbol').all<{
      slug: string;
      category: string;
      tags: string;
    }>();

    const relations: Array<{ from: string; to: string; weight: number }> = [];

    for (const dream of dreams.results || []) {
      const tags = JSON.parse(dream.tags || '[]') as string[];

      // 같은 카테고리의 다른 꿈들과 관계 생성
      const relatedDreams = (dreams.results || []).filter(d =>
        d.slug !== dream.slug && (
          d.category === dream.category ||
          (JSON.parse(d.tags || '[]') as string[]).some(tag => tags.includes(tag))
        )
      );

      for (const related of relatedDreams.slice(0, 5)) {
        const relatedTags = JSON.parse(related.tags || '[]') as string[];
        const commonTags = tags.filter(t => relatedTags.includes(t));
        const weight = 0.3 + (commonTags.length * 0.15) + (related.category === dream.category ? 0.2 : 0);

        relations.push({
          from: dream.slug,
          to: related.slug,
          weight: Math.min(weight, 1.0)
        });
      }
    }

    // 관계 저장 (INSERT OR REPLACE)
    for (const rel of relations) {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO dream_relation (from_slug, to_slug, weight)
        VALUES (?, ?, ?)
      `).bind(rel.from, rel.to, rel.weight).run();
    }

    console.log(`✅ Rebuilt ${relations.length} dream relations`);
  } catch (error) {
    console.error('❌ Dream relation rebuild failed:', error);
    throw error;
  }
}

// 검색 로그 정리 작업
async function handleSearchLogCleanup(env: Env) {
  console.log('🔄 Cleaning up search logs...');

  try {
    // 90일 이상 된 검색 로그 삭제
    const result = await env.DB.prepare(`
      DELETE FROM search_log
      WHERE ts < datetime('now', '-90 days')
    `).run();

    console.log(`✅ Cleaned up ${result.meta.changes || 0} old search logs`);
  } catch (error) {
    console.error('❌ Search log cleanup failed:', error);
    throw error;
  }
}

// 기타 헬퍼 함수들은 생략...
