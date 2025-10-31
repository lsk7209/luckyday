// 애플리케이션 상수 정의

// 콘텐츠 관련 상수
export const CONTENT_TYPES = {
  BLOG: 'blog',
  GUIDE: 'guide',
  UTILITY: 'utility',
} as const;

export const CONTENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

// SEO 관련 상수
export const SEO_LIMITS = {
  TITLE_MIN: 30,
  TITLE_MAX: 60,
  DESCRIPTION_MIN: 120,
  DESCRIPTION_MAX: 160,
  KEYWORDS_MAX: 10,
} as const;

export const ROBOTS_DIRECTIVES = {
  INDEX_FOLLOW: 'index,follow',
  NOINDEX_FOLLOW: 'noindex,follow',
  INDEX_NOFOLLOW: 'index,nofollow',
  NOINDEX_NOFOLLOW: 'noindex,nofollow',
} as const;

// 분석 관련 상수
export const EVENT_TYPES = {
  PAGE_VIEW: 'page_view',
  RESULT_VIEW: 'result_view',
  FORM_SUBMIT: 'form_submit',
  FAQ_TOGGLE: 'faq_toggle',
  RELATED_CLICK: 'related_click',
  SCROLL_DEPTH: 'scroll_depth',
  SEARCH_QUERY: 'search_query',
  SOCIAL_SHARE: 'social_share',
  CTA_CLICK: 'cta_click',
  DOWNLOAD: 'download',
  EXTERNAL_LINK: 'external_link',
} as const;

export const CHANNEL_TYPES = {
  ORGANIC: 'organic',
  PAID: 'paid',
  SOCIAL: 'social',
  REFERRAL: 'referral',
  DIRECT: 'direct',
  EMAIL: 'email',
  DISPLAY: 'display',
  UNKNOWN: 'unknown',
} as const;

export const DEVICE_TYPES = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  TABLET: 'tablet',
} as const;

// 퍼널 단계 상수
export const FUNNEL_STEPS = {
  PAGE_VIEW: 'page_view',
  RESULT_VIEW: 'result_view',
  FORM_SUBMIT: 'form_submit',
  FAQ_TOGGLE: 'faq_toggle',
  RELATED_CLICK: 'related_click',
  CONVERSION: 'conversion',
} as const;

// 자동화 작업 상수
export const JOB_TYPES = {
  SITEMAP_REBUILD: 'sitemap_rebuild',
  INDEX_SUBMIT: 'index_submit',
  REFRESH_CONTENT: 'refresh_content',
  GSC_FETCH: 'gsc_fetch',
  BROKEN_LINKS_SCAN: 'broken_links_scan',
  ANALYTICS_ROLLUP: 'analytics_rollup',
  ALERT_MONITOR: 'alert_monitor',
} as const;

export const JOB_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

// 색인 제공자 상수
export const INDEX_PROVIDERS = {
  GOOGLE: 'google',
  BING: 'bing',
  NAVER: 'naver',
  INDEXNOW: 'indexnow',
} as const;

export const INDEX_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  INDEXED: 'indexed',
  FAILED: 'failed',
} as const;

// 트래킹 스크립트 상수
export const TRACKING_SCRIPTS = {
  GA4: 'ga4',
  META_PIXEL: 'meta_pixel',
  NAVER_ADS: 'naver_ads',
  KAKAO: 'kakao',
} as const;

export const SCRIPT_POSITIONS = {
  HEAD: 'head',
  BODY: 'body',
  FOOTER: 'footer',
} as const;

// 디자인 토큰 (테마 상수)
export const DESIGN_TOKENS = {
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
  BORDER_RADIUS: {
    NONE: 0,
    SM: 4,
    MD: 8,
    LG: 12,
    XL: 16,
    FULL: 9999,
  },
  FONT_SIZE: {
    XS: 12,
    SM: 14,
    MD: 16,
    LG: 18,
    XL: 20,
    XXL: 24,
    XXXL: 32,
  },
  LINE_HEIGHT: {
    TIGHT: 1.25,
    NORMAL: 1.5,
    RELAXED: 1.7,
    LOOSE: 2,
  },
  MAX_WIDTH: {
    CONTENT: 768,
    WIDE: 1200,
  },
} as const;

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  SEARCH: '/api/search',
  RELATED: '/api/related',
  CONTENT: '/api/admin/content',
  PUBLISH: '/api/admin/publish',
  VALIDATE: '/api/admin/validate',
  GSC_SUBMIT: '/api/admin/gsc/submit',
  PSEUDO_SCAFFOLD: '/api/admin/pseo/scaffold',
  ANALYTICS_EXPORT: '/api/admin/analytics/export',
  WEBHOOK: '/api/webhook',
} as const;

// 파일 업로드 상수
export const UPLOAD_LIMITS = {
  IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  DOCUMENT_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  DOCUMENT_TYPES: ['application/pdf', 'text/plain'],
} as const;
