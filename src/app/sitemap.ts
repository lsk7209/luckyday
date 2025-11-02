/**
 * Sitemap 생성
 * Next.js의 동적 sitemap 생성 기능 사용
 */

import { MetadataRoute } from 'next';
import { getWorkersApiUrl } from '@/lib/workers-api-url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://luckyday.app';
  
  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dream`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/feed.xml`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
  ];

  // 동적 페이지: 꿈 해몽 페이지들
  try {
    const apiUrl = getWorkersApiUrl();
    const response = await fetch(`${apiUrl}/api/dream?limit=1000&orderBy=popularity`, {
      next: { revalidate: 86400 }, // 24시간마다 재검증
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const dreamPages: MetadataRoute.Sitemap = [];
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && Array.isArray(data.dreams)) {
        dreamPages.push(
          ...data.dreams.map((dream: any) => ({
            url: `${baseUrl}/dream/${dream.slug}`,
            lastModified: dream.last_updated ? new Date(dream.last_updated) : new Date(dream.created_at || Date.now()),
            changeFrequency: 'weekly' as const,
            priority: dream.popularity > 1000 ? 0.9 : dream.popularity > 500 ? 0.8 : 0.7,
          }))
        );
      }
    }

    return [...staticPages, ...dreamPages];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    // 에러 발생 시 정적 페이지만 반환
    return staticPages;
  }
}

