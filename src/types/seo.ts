// SEO 관련 타입 정의

// 메타 태그 인터페이스
export interface MetaTags {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: object;
}

// SEO 분석 결과
export interface SEOAnalysis {
  score: number; // 0-100
  issues: SEOIssue[];
  suggestions: string[];
}

// SEO 이슈
export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  field?: string;
  suggestion?: string;
}

// 내부 링크 분석
export interface InternalLink {
  sourceSlug: string;
  targetSlug: string;
  anchorText: string;
  context: string;
  strength: number; // 1-10
}

// 링크 건강 상태
export interface LinkHealth {
  url: string;
  status: 'healthy' | 'broken' | 'redirect' | 'timeout';
  statusCode?: number;
  redirectUrl?: string;
  lastChecked: Date;
  errorMessage?: string;
}

// 사이트맵 엔트리
export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number; // 0.0 - 1.0
}

// 색인 제출 상태
export interface IndexSubmission {
  url: string;
  provider: 'google' | 'bing' | 'naver' | 'indexnow';
  status: 'pending' | 'submitted' | 'indexed' | 'failed';
  submittedAt: Date;
  indexedAt?: Date;
  errorMessage?: string;
  retryCount: number;
}

// GSC (Google Search Console) 데이터
export interface GSCData {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  date: Date;
}

// 색인 커버리지
export interface IndexCoverage {
  url: string;
  status: 'indexed' | 'excluded' | 'error';
  lastCrawled?: Date;
  firstDetected?: Date;
  reason?: string;
  pattern?: string;
}
