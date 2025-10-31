// Jest 설정 파일
// 테스트 환경 설정 및 글로벌 설정

// 환경 변수 설정
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.OPENAI_API_KEY = 'test-openai-key';

// 테스트 타임아웃 설정
jest.setTimeout(10000);

// 콘솔 에러 숨기기 (선택사항)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// 글로벌 테스트 유틸리티
global.testUtils = {
  // 테스트용 데이터 생성 유틸리티
  createMockDream: (overrides = {}) => ({
    id: '1',
    slug: 'test-dream',
    name: '테스트 꿈',
    category: 'animal',
    summary: '테스트 꿈 요약',
    quick_answer: '테스트 꿈 답변',
    body_mdx: '# 테스트 꿈\n\n테스트 내용',
    tags: ['테스트'],
    popularity: 100,
    polarities: { positive: [], caution: [] },
    modifiers: {},
    last_updated: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  // API 응답 모킹 유틸리티
  mockApiResponse: (data, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  }),

  // 로컬 스토리지 모킹
  mockLocalStorage: () => {
    const store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => { store[key] = value; }),
      removeItem: jest.fn(key => { delete store[key]; }),
      clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); }),
    };
  },
};

// fetch API 모킹 (Node.js 환경에서)
global.fetch = jest.fn();

// IntersectionObserver 모킹 (테스트 환경용)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};

// ResizeObserver 모킹
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  disconnect() { return null; }
  unobserve() { return null; }
};

// matchMedia 모킹
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// 서비스 워커 모킹
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn(() => Promise.resolve({ scope: '/' })),
    ready: Promise.resolve({
      active: { state: 'activated' },
      controller: null,
    }),
  },
  writable: true,
});

// 클립보드 API 모킹
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('')),
  },
  writable: true,
});

// Notification API 모킹
global.Notification = {
  requestPermission: jest.fn(() => Promise.resolve('granted')),
  permission: 'granted',
};

// Workbox 관련 모킹 (PWA)
jest.mock('workbox-core', () => ({
  clientsClaim: jest.fn(),
}));

jest.mock('workbox-expiration', () => ({
  ExpirationPlugin: jest.fn(),
}));

jest.mock('workbox-precaching', () => ({
  precacheAndRoute: jest.fn(),
}));

jest.mock('workbox-routing', () => ({
  registerRoute: jest.fn(),
}));

jest.mock('workbox-strategies', () => ({
  CacheFirst: jest.fn(),
  NetworkFirst: jest.fn(),
  StaleWhileRevalidate: jest.fn(),
}));

// Supabase 클라이언트 모킹
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
        ilike: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        order: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: jest.fn(() => Promise.resolve({ error: null })),
    })),
  })),
}));

// OpenAI 클라이언트 모킹
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(() => Promise.resolve({
          choices: [{
            message: {
              content: JSON.stringify({
                summary: '테스트 꿈 해석',
                hypotheses: [],
                positive_signs: [],
                caution_points: [],
                related_slugs: [],
                disclaimer: '테스트 면책 조항',
              }),
            },
          }],
        })),
      },
    },
  })),
}));