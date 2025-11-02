/**
 * RSS Feed 생성
 * Next.js Route Handler를 사용한 RSS 피드 생성
 */

import { NextResponse } from 'next/server';
import { getWorkersApiUrl } from '@/lib/workers-api-url';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://luckyday.app';
  const siteName = '럭키데이 - AI 꿈 해몽';
  const siteDescription = 'AI 기반 꿈 해몽 서비스 - 심리학·문화·상징학으로 꿈을解读. 200개 이상의 꿈 사전과 개인 맞춤 AI 분석으로 당신의 꿈을 정확하게 해석합니다.';

  try {
    // 최신 꿈 해몽 목록 가져오기 (최대 50개)
    const apiUrl = getWorkersApiUrl();
    const response = await fetch(`${apiUrl}/api/dream?limit=50&orderBy=popularity`, {
      next: { revalidate: 3600 }, // 1시간마다 재검증
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let dreamItems = '';
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.dreams)) {
        dreamItems = data.dreams.map((dream: any) => {
          const pubDate = new Date(dream.last_updated || dream.created_at || Date.now()).toUTCString();
          const link = `${baseUrl}/dream/${dream.slug}`;
          const title = `${dream.name} 꿈해몽`;
          const description = dream.summary || dream.quick_answer || '';
          
          return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${dream.category || '꿈해몽'}]]></category>
      ${Array.isArray(dream.tags) && dream.tags.length > 0 
        ? dream.tags.map((tag: string) => `<category><![CDATA[${tag}]]></category>`).join('\n      ') 
        : ''}
    </item>`;
        }).join('\n');
      }
    }

    // RSS XML 생성
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${siteName}]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${siteDescription}]]></description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/og-image.png</url>
      <title><![CDATA[${siteName}]]></title>
      <link>${baseUrl}</link>
    </image>
${dreamItems}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('RSS Feed generation error:', error);
    
    // 에러 발생 시 빈 RSS 피드 반환
    const emptyRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${siteName}]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${siteDescription}]]></description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;

    return new NextResponse(emptyRssXml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    });
  }
}

