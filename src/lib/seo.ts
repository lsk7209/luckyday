// SEO 관련 유틸리티 함수들

import { Metadata } from 'next';
import { BlogContent, GuideContent, UtilityContent, Content } from '@/types/content';

/**
 * 블로그 포스트용 구조화 데이터 생성
 */
export function generateBlogPostSchema(blog: BlogContent): object {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.seoDescription,
    datePublished: blog.date.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'CMS Calculator',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'CMS Calculator',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${blog.slug}`,
    },
    articleSection: blog.tags[0] || 'General',
    keywords: blog.tags.join(', '),
    ...(blog.faq.length > 0 && {
      mainEntity: generateFAQSchema(blog.faq),
    }),
  };
}

/**
 * 가이드용 구조화 데이터 생성
 */
export function generateGuideSchema(guide: GuideContent): object {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: guide.seoDescription,
    totalTime: `PT${guide.durationMinutes}M`,
    step: guide.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
      ...(step.durationMinutes && {
        duration: `PT${step.durationMinutes}M`,
      }),
    })),
    supply: [],
    tool: [],
    ...(guide.faq.length > 0 && {
      mainEntity: generateFAQSchema(guide.faq),
    }),
  };
}

/**
 * 계산기용 구조화 데이터 생성
 */
export function generateUtilitySchema(utility: UtilityContent): object {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: utility.title,
    description: utility.seoDescription,
    applicationCategory: 'Utility',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    author: {
      '@type': 'Organization',
      name: 'CMS Calculator',
    },
    datePublished: utility.createdAt.toISOString(),
    dateModified: utility.updatedAt.toISOString(),
    softwareVersion: utility.version,
    ...(utility.faq.length > 0 && {
      mainEntity: generateFAQSchema(utility.faq),
    }),
  };
}

/**
 * FAQ용 구조화 데이터 생성
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): object {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * 콘텐츠 타입에 따른 구조화 데이터 생성
 */
export function generateStructuredData(content: Content): object {
  switch (content.type) {
    case 'blog':
      return generateBlogPostSchema(content);
    case 'guide':
      return generateGuideSchema(content);
    case 'utility':
      return generateUtilitySchema(content);
    default:
      return {};
  }
}

/**
 * SEO 메타데이터 생성
 */
export function generateSEOMetadata(
  content: Content,
  overrides: Partial<Metadata> = {}
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  const url = `${baseUrl}/${content.type}/${content.slug}`;

  const baseMetadata: Metadata = {
    title: content.seoTitle,
    description: content.seoDescription,
    keywords: content.tags?.join(', '),
    authors: [{ name: 'CMS Calculator' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: content.seoTitle,
      description: content.seoDescription,
      url,
      siteName: 'CMS Calculator',
      type: content.type === 'blog' ? 'article' : 'website',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.seoTitle,
      description: content.seoDescription,
    },
    robots: {
      index: content.status === 'published',
      follow: content.status === 'published',
      googleBot: {
        index: content.status === 'published',
        follow: content.status === 'published',
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  // 블로그 특화 메타데이터
  if (content.type === 'blog') {
    baseMetadata.openGraph = {
      ...baseMetadata.openGraph,
      publishedTime: content.createdAt.toISOString(),
      modifiedTime: content.updatedAt.toISOString(),
      authors: ['CMS Calculator'],
      tags: content.tags,
    } as any;
  }

  return { ...baseMetadata, ...overrides };
}

/**
 * 사이트맵 URL 생성
 */
export function generateSitemapUrl(content: Content): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  return `${baseUrl}/${content.type}/${content.slug}`;
}

/**
 * 사이트맵 우선순위 계산
 */
export function calculatePriority(content: Content): number {
  switch (content.type) {
    case 'blog':
      return 0.8;
    case 'guide':
      return 0.9;
    case 'utility':
      return 1.0;
    default:
      return 0.5;
  }
}

/**
 * 변경 빈도 계산
 */
export function calculateChangeFrequency(content: Content): string {
  switch (content.type) {
    case 'blog':
      return 'monthly';
    case 'guide':
      return 'yearly';
    case 'utility':
      return 'weekly';
    default:
      return 'monthly';
  }
}
