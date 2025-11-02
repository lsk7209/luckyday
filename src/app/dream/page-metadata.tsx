/**
 * 꿈 사전 페이지 메타데이터
 * 클라이언트 컴포넌트이므로 동적 메타데이터를 위해 별도 파일로 분리
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '꿈해몽 사전 | 꿈 해석 의미 찾기',
  description: '꿈해몽 사전에서 다양한 꿈의 의미를 찾아보세요. 뱀 꿈, 이빨 꿈, 물 꿈 등 200개 이상의 꿈 해몽을 제공합니다.',
  keywords: '꿈해몽, 꿈해석, 꿈사전, 꿈의의미, 꿈풀이, 해몽, 꿈분석',
  alternates: {
    canonical: '/dream',
  },
  openGraph: {
    title: '꿈해몽 사전 | 꿈 해석 의미 찾기',
    description: '200개 이상의 꿈해몽을 제공하는 종합 꿈 사전입니다.',
    type: 'website',
    url: '/dream',
  },
  twitter: {
    card: 'summary_large_image',
    title: '꿈해몽 사전',
    description: '200개 이상의 꿈해몽을 제공하는 종합 꿈 사전입니다.',
  },
};

