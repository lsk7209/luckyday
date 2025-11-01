/**
 * 다국어 지원 시스템
 * 영어, 한국어 지원
 */

export type Language = 'ko' | 'en';

export interface Translations {
  // 공통
  common: {
    search: string;
    loading: string;
    error: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    share: string;
    bookmark: string;
    close: string;
  };

  // 네비게이션
  nav: {
    home: string;
    dreamDictionary: string;
    aiInterpretation: string;
    bookmarks: string;
  };

  // 메인 페이지
  home: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    popularDreams: string;
    aiFeatures: string;
    cta: string;
  };

  // 꿈 관련
  dream: {
    interpretation: string;
    summary: string;
    quickAnswer: string;
    relatedDreams: string;
    tags: string;
    category: string;
    popularity: string;
  };

  // 검색
  search: {
    advanced: string;
    naturalLanguage: string;
    recommendations: string;
    noResults: string;
    tips: string;
  };

  // 알림
  notifications: {
    title: string;
    markAllRead: string;
    empty: string;
  };

  // 테마
  theme: {
    light: string;
    dark: string;
    system: string;
  };
}

const translations: Record<Language, Translations> = {
  ko: {
    common: {
      search: '검색',
      loading: '로딩중',
      error: '오류',
      save: '저장',
      cancel: '취소',
      delete: '삭제',
      edit: '수정',
      view: '보기',
      share: '공유',
      bookmark: '북마크',
      close: '닫기',
    },
    nav: {
      home: '홈',
      dreamDictionary: '꿈 사전',
      aiInterpretation: 'AI 해몽',
      bookmarks: '북마크',
    },
    home: {
      title: 'DreamScope',
      subtitle: 'AI 기반 꿈 해석 서비스',
      searchPlaceholder: '꿈에 나온 것을 검색하세요...',
      popularDreams: '인기 꿈',
      aiFeatures: 'AI 해몽의 장점',
      cta: 'AI로 꿈 해몽하기',
    },
    dream: {
      interpretation: '해몽',
      summary: '요약',
      quickAnswer: '빠른 답변',
      relatedDreams: '관련 꿈',
      tags: '태그',
      category: '카테고리',
      popularity: '인기도',
    },
    search: {
      advanced: '고급 검색',
      naturalLanguage: '자연어 검색',
      recommendations: '추천',
      noResults: '검색 결과가 없습니다',
      tips: '검색 팁',
    },
    notifications: {
      title: '알림',
      markAllRead: '모두 읽음',
      empty: '새로운 알림이 없습니다',
    },
    theme: {
      light: '라이트',
      dark: '다크',
      system: '시스템',
    },
  },

  en: {
    common: {
      search: 'Search',
      loading: 'Loading',
      error: 'Error',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      share: 'Share',
      bookmark: 'Bookmark',
      close: 'Close',
    },
    nav: {
      home: 'Home',
      dreamDictionary: 'Dream Dictionary',
      aiInterpretation: 'AI Interpretation',
      bookmarks: 'Bookmarks',
    },
    home: {
      title: 'DreamScope',
      subtitle: 'AI-powered dream interpretation service',
      searchPlaceholder: 'Search what you dreamed about...',
      popularDreams: 'Popular Dreams',
      aiFeatures: 'Benefits of AI Dream Interpretation',
      cta: 'Interpret Your Dream with AI',
    },
    dream: {
      interpretation: 'Interpretation',
      summary: 'Summary',
      quickAnswer: 'Quick Answer',
      relatedDreams: 'Related Dreams',
      tags: 'Tags',
      category: 'Category',
      popularity: 'Popularity',
    },
    search: {
      advanced: 'Advanced Search',
      naturalLanguage: 'Natural Language',
      recommendations: 'Recommendations',
      noResults: 'No search results found',
      tips: 'Search Tips',
    },
    notifications: {
      title: 'Notifications',
      markAllRead: 'Mark all as read',
      empty: 'No new notifications',
    },
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
  },
};

// 언어 감지 및 설정
export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'ko';

  // URL 파라미터 확인
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  if (langParam === 'en' || langParam === 'ko') {
    return langParam;
  }

  // 로컬 스토리지 확인
  const stored = localStorage.getItem('dreamscope-language');
  if (stored === 'en' || stored === 'ko') {
    return stored as Language;
  }

  // 브라우저 언어 확인
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('en')) {
    return 'en';
  }

  return 'ko'; // 기본 한국어
}

// 번역 함수
export function t(key: string, language: Language = 'ko'): string {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}

// 언어 변경 함수
export function setLanguage(language: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dreamscope-language', language);

    // URL 업데이트 (옵션)
    const url = new URL(window.location.href);
    if (language === 'en') {
      url.searchParams.set('lang', 'en');
    } else {
      url.searchParams.delete('lang');
    }

    window.history.replaceState({}, '', url.toString());
  }
}

// 언어 컨텍스트 훅
export function useTranslation() {
  const [language, setLanguageState] = useState<Language>('ko');

  useEffect(() => {
    setLanguageState(getInitialLanguage());
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    setLanguage(newLanguage);
  };

  const translate = (key: string) => t(key, language);

  return {
    language,
    changeLanguage,
    t: translate,
  };
}
