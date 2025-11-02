/**
 * 꿈 해몽 페이지 SEO 유틸리티
 * SEO 최적화를 위한 헬퍼 함수들
 */

import { Metadata } from 'next';
import { DreamSymbol } from '@/types/dream';

/**
 * 꿈 해몽 페이지용 SEO 메타데이터 생성
 */
export function generateDreamMetadata(dream: DreamSymbol, slug: string): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://luckyday.app';
  const canonicalUrl = `${baseUrl}/dream/${slug}`;
  
  // 핵심 키워드를 앞쪽에 배치: "꿈해몽 [꿈이름]"
  const seoTitle = `꿈해몽 ${dream.name} | ${dream.name} 꿈 의미 해석`;
  const seoDescription = `${dream.name} 꿈해몽은 ${dream.summary} ${dream.quick_answer?.substring(0, 60) || ''}...`;
  
  const tags = Array.isArray(dream.tags) ? dream.tags : [];
  
  return {
    title: seoTitle,
    description: seoDescription,
    keywords: tags.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
      url: canonicalUrl,
      images: [
        {
          url: `${baseUrl}/og-dream-${slug}.png`,
          width: 1200,
          height: 630,
          alt: `${dream.name} 꿈해몽`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [`${baseUrl}/og-dream-${slug}.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * 꿈 목록 페이지용 SEO 메타데이터
 */
export function generateDreamListMetadata(): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://luckyday.app';
  
  return {
    title: '꿈해몽 사전 | 꿈 해석 의미 찾기',
    description: '꿈해몽 사전에서 다양한 꿈의 의미를 찾아보세요. 뱀 꿈, 이빨 꿈, 물 꿈 등 200개 이상의 꿈 해몽을 제공합니다.',
    keywords: '꿈해몽, 꿈해석, 꿈사전, 꿈의의미, 꿈풀이, 해몽, 꿈분석',
    alternates: {
      canonical: `${baseUrl}/dream`,
    },
    openGraph: {
      title: '꿈해몽 사전 | 꿈 해석 의미 찾기',
      description: '200개 이상의 꿈해몽을 제공하는 종합 꿈 사전입니다.',
      type: 'website',
      url: `${baseUrl}/dream`,
    },
    twitter: {
      card: 'summary_large_image',
      title: '꿈해몽 사전',
      description: '200개 이상의 꿈해몽을 제공하는 종합 꿈 사전입니다.',
    },
  };
}

/**
 * AI 해몽 페이지용 SEO 메타데이터
 */
export function generateAIMetadata(): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://luckyday.app';
  
  return {
    title: 'AI 꿈해몽 | 인공지능 꿈 해석 서비스',
    description: 'AI 기반 꿈해몽 서비스로 당신의 꿈을 정확하게 해석하세요. 심리학, 문화, 상징학을 바탕으로 한 개인 맞춤 꿈 해석을 제공합니다.',
    keywords: 'AI꿈해몽, 인공지능꿈해석, AI해몽, 꿈해석AI, 개인맞춤해몽',
    alternates: {
      canonical: `${baseUrl}/ai`,
    },
    openGraph: {
      title: 'AI 꿈해몽 | 인공지능 꿈 해석 서비스',
      description: 'AI 기반 꿈해몽 서비스로 당신의 꿈을 정확하게 해석하세요.',
      type: 'website',
      url: `${baseUrl}/ai`,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AI 꿈해몽',
      description: 'AI 기반 꿈해몽 서비스로 당신의 꿈을 정확하게 해석하세요.',
    },
  };
}

/**
 * H태그에 키워드 포함 여부 확인
 */
export function checkKeywordInHeading(heading: string, keyword: string): boolean {
  return heading.toLowerCase().includes(keyword.toLowerCase());
}

