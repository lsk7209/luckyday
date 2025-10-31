// 콘텐츠 타입 정의
export type ContentType = 'blog' | 'guide' | 'utility';

// 공통 콘텐츠 필드
export interface BaseContent {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  summary: string;
  seoTitle: string;
  seoDescription: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  faq: FAQ[];
  related: RelatedContent[];
}

// 블로그 콘텐츠
export interface BlogContent extends BaseContent {
  type: 'blog';
  date: Date;
  readingMinutes: number;
  body: string;
  jsonLd: BlogPostingSchema;
}

// 가이드 콘텐츠
export interface GuideContent extends BaseContent {
  type: 'guide';
  steps: GuideStep[];
  level: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  body: string;
  jsonLd: HowToSchema;
}

// 계산기 콘텐츠
export interface UtilityContent extends BaseContent {
  type: 'utility';
  category: string;
  version: string;
  inputs: UtilityInput[];
  outputs: UtilityOutput[];
  formulaKey: string;
  sources: Source[];
  jsonLd: SoftwareApplicationSchema;
}

// FAQ 인터페이스
export interface FAQ {
  question: string;
  answer: string;
}

// 관련 콘텐츠
export interface RelatedContent {
  slug: string;
  title: string;
  type: ContentType;
  similarity: number; // 유사도 점수 (0-1)
}

// 가이드 단계
export interface GuideStep {
  title: string;
  description: string;
  image?: string;
  durationMinutes?: number;
}

// 계산기 입력 필드
export interface UtilityInput {
  key: string;
  label: string;
  type: 'number' | 'select' | 'text' | 'date';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  unit?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// 계산기 출력 필드
export interface UtilityOutput {
  key: string;
  label: string;
  type: 'number' | 'text' | 'percentage';
  unit?: string;
  description?: string;
  interpretation?: string;
}

// 출처 정보
export interface Source {
  name: string;
  url: string;
  description?: string;
}

// JSON-LD 스키마 인터페이스
export interface BlogPostingSchema {
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': 'Organization';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export interface HowToSchema {
  '@type': 'HowTo';
  name: string;
  description: string;
  totalTime: string;
  step: Array<{
    '@type': 'HowToStep';
    name: string;
    text: string;
    position: number;
  }>;
}

export interface SoftwareApplicationSchema {
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': 'Offer';
    price: '0';
    priceCurrency: 'KRW';
  };
}

// FAQ Page 스키마
export interface FAQPageSchema {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

// 통합 콘텐츠 타입
export type Content = BlogContent | GuideContent | UtilityContent;
