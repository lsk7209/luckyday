/**
 * 꿈 상세 페이지
 * @description 개별 꿈 심볼의 상세 해석과 관련 정보 표시
 */
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Brain, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AdSlot from '@/components/shared/ad-slot';
import MDXRenderer from '@/components/dream/mdx-renderer';
import { workersDreamDb } from '@/lib/api-client-dream';
import { DreamSymbol, DreamPageProps } from '@/types/dream';
import { getWorkersApiUrl } from '@/lib/workers-api-url';

// 서버 컴포넌트에서 직접 API 호출하는 헬퍼 함수
async function fetchDreamFromApi(slug: string): Promise<DreamSymbol | null> {
  try {
    const apiUrl = getWorkersApiUrl();
    const response = await fetch(`${apiUrl}/api/dream/${slug}`, {
      next: { revalidate: 3600 }, // 1시간마다 재검증 (ISR)
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      console.error(`Failed to fetch dream: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    if (!data.success || !data.dream) {
      return null;
    }

    // JSON 문자열을 객체로 파싱
    const dream = data.dream;
    return {
      ...dream,
      id: String(dream.id || dream.slug),
      tags: Array.isArray(dream.tags) ? dream.tags : (typeof dream.tags === 'string' ? JSON.parse(dream.tags || '[]') : []),
      polarities: typeof dream.polarities === 'string' ? JSON.parse(dream.polarities || '{}') : (dream.polarities || {}),
      modifiers: typeof dream.modifiers === 'string' ? JSON.parse(dream.modifiers || '{}') : (dream.modifiers || {}),
    };
  } catch (error) {
    console.error('[Server] 꿈 데이터 조회 실패:', error);
    return null;
  }
}

// 관련 꿈 조회 헬퍼 함수
async function fetchRelatedDreams(slug: string): Promise<Array<{
  slug: string;
  title: string;
  type: 'dream';
  similarity: number;
}>> {
  try {
    const apiUrl = getWorkersApiUrl();
    const response = await fetch(`${apiUrl}/api/dream/related?slug=${encodeURIComponent(slug)}&limit=5`, {
      next: { revalidate: 3600 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (!data.success || !Array.isArray(data.related)) {
      return [];
    }

    return data.related.map((item: any) => ({
      slug: item.slug,
      title: item.title || item.name || item.slug,
      type: 'dream' as const,
      similarity: item.similarity || item.weight || 0.5,
    }));
  } catch (error) {
    console.error('[Server] 관련 꿈 조회 실패:', error);
    return [];
  }
}

// 모든 꿈 slug 목록 조회 (정적 생성용)
async function getAllDreamSlugs(): Promise<string[]> {
  try {
    const apiUrl = getWorkersApiUrl();
    const response = await fetch(`${apiUrl}/api/dream?limit=1000&orderBy=popularity`, {
      next: { revalidate: 86400 }, // 24시간마다 재검증
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (!data.success || !Array.isArray(data.dreams)) {
      return [];
    }

    return data.dreams.map((dream: any) => dream.slug).filter(Boolean);
  } catch (error) {
    console.error('[Server] 꿈 목록 조회 실패:', error);
    return [];
  }
}

// 임시 폴백 데이터 (API 실패 시 사용)
const mockDreamData: Record<string, DreamSymbol> = {
  'baem-snake-dream': {
    id: '1',
    slug: 'baem-snake-dream',
    name: '뱀 꿈 해몽',
    category: 'animal',
    summary: '뱀 꿈은 변화와 갱신의 신호입니다. 꿈의 맥락에 따라 긍정적 또는 부정적 의미를 가질 수 있습니다.',
    quick_answer: '뱀 꿈은 대개 변화, 갱신, 회복의 의미로 해석됩니다. 검은 뱀이나 공격적인 상황에서는 관계 긴장을, 흰 뱀이나 평온한 상황에서는 긍정적 변화를 상징합니다.',
    body_mdx: `# 뱀 꿈 해몽 - 변화와 갱신의 상징

뱀 꿈은 인류 역사상 가장 오래된 꿈 상징 중 하나입니다. 변화, 갱신, 치유, 그리고 때로는 위험을 상징합니다.

## 꿈의 맥락에 따른 의미

### 긍정적 의미
- **허물 벗기**: 새로운 시작, 변혁, 성장
- **치유**: 회복, 재생, 건강 회복
- **지혜**: 통찰력, 직관, 숨겨진 지식

### 부정적 의미
- **위험**: 위협, 배신, 적대적 상황
- **두려움**: 불안, 스트레스, 회피 경향
- **변화 저항**: 변화에 대한 두려움

## 뱀의 색상별 의미

| 색상 | 의미 | 긍정/부정 |
|------|------|----------|
| 흰 뱀 | 순수, 영적 깨달음 | 매우 긍정 |
| 검은 뱀 | 무의식, 숨겨진 두려움 | 부정적 |
| 녹색 뱀 | 성장, 치유, 질투 | 상황에 따라 |
| 노란 뱀 | 지혜, 직관, 배신 | 중립적 |

## 상황별 해석

### 쫓기는 꿈
공격적인 뱀이 쫓아오는 꿈은 현실에서의 압박감이나 스트레스를 반영합니다.

### 물리는 꿈
뱀이 물거나 물리는 꿈은 관계에서의 갈등이나 건강 문제를 암시할 수 있습니다.

### 죽이는 꿈
뱀을 죽이는 꿈은 문제 해결이나 어려움 극복의 긍정적 신호입니다.

## 심리학적 해석

### 프로이트의 관점
뱀은 성적 욕망이나 억압된 본능을 상징합니다.

### 융의 관점
뱀은 변형과 재생의 원형적 상징입니다.

### 현대 심리학
스트레스, 변화에 대한 불안, 또는 개인적 성장을 나타냅니다.

## 문화권별 의미

### 서양 문화
선악의 상징, 유혹, 지혜 (성경의 뱀)

### 동양 문화
용의 변형, 불로불사의 상징, 부와 재물

### 한국 전통
대개 부정적 - 적대, 배신, 질병

## 꿈 해몽 팁

1. **감정 상태 확인**: 꿈속 감정이 중요합니다
2. **색상 주의**: 뱀의 색상이 의미를 좌우합니다
3. **상황 맥락**: 어떤 상황에서 나타났는지 기억하세요
4. **반복 꿈**: 반복되는 꿈은 특별한 의미가 있을 수 있습니다

## 관련 꿈

[용 꿈](dream:dragon-dream) - 뱀과 비슷한 변형 상징
[거미 꿈](dream:spider-dream) - 비슷한 공포 반응
[물 꿈](dream:water-dream) - 감정 상태 반영`,
    tags: ['뱀꿈', '해몽', '변화', '갱신', '심리', '상징'],
    popularity: 1250,
    polarities: {
      positive: ['변화', '갱신', '치유', '성장'],
      caution: ['위험', '배신', '두려움', '갈등']
    },
    modifiers: {
      color_black: { weight: 0.7, polarity: 'caution' },
      color_white: { weight: 0.9, polarity: 'positive' },
      emotion_fear: { weight: 0.6, polarity: 'caution' }
    },
    last_updated: '2024-01-15T10:00:00Z'
  },
  'tooth-loss-dream': {
    id: '2',
    slug: 'tooth-loss-dream',
    name: '이빨 꿈 해몽',
    category: 'body',
    summary: '이빨 꿈은 변화, 불안, 자기표현의 신호입니다. 잃어버리는 치아의 위치가 중요합니다.',
    quick_answer: '이빨 꿈은 대개 불안이나 변화의 신호로, 잃어버리는 치아의 위치에 따라 가족, 일, 대인관계 문제를 반영합니다.',
    body_mdx: `# 이빨 꿈 해몽 - 변화와 불안의 상징

이빨 꿈은 가장 흔한 꿈 중 하나로, 변화, 불안, 자기표현과 관련이 있습니다.

## 빠지는 치아별 의미

### 앞니 (송곳니)
자신감, 외모, 첫인상에 대한 불안

### 어금니
가족, 재정적 안정, 건강 문제

### 위쪽/아래쪽
생각(위쪽) vs 감정(아래쪽)의 균형 문제

## 심리학적 의미

### 프로이트의 해석
이빨 빠지는 꿈은 성적 불안이나 억압을 상징

### 현대 심리학
- 스트레스 반응
- 변화에 대한 두려움
- 자기 가치감 저하

## 상황별 해석

### 피와 함께 빠짐
변화 과정의 고통스러움, 건강 주의

### 깨끗하게 빠짐
자연스러운 변화, 성장 과정

### 다른 사람이 빠짐
주변인의 변화나 건강 문제`,
    tags: ['이빨꿈', '해몽', '불안', '변화', '심리'],
    popularity: 980,
    polarities: {
      positive: ['성장', '변화'],
      caution: ['불안', '스트레스', '건강주의']
    },
    modifiers: {},
    last_updated: '2024-01-15T11:00:00Z'
  }
};

// 꿈별 맞춤 FAQ 생성 함수
function generateDreamFAQs(dream: DreamSymbol): Array<{ question: string; answer: string }> {
  const baseFAQs: Array<{ question: string; answer: string }> = [
    {
      question: `${dream.name}의 일반적인 의미는 무엇인가요?`,
      answer: dream.quick_answer
    },
    {
      question: `${dream.name}에서 긍정적 의미는 무엇인가요?`,
      answer: dream.polarities?.positive 
        ? `${dream.name}은(는) ${dream.polarities.positive.join(', ')} 등의 긍정적 의미를 가질 수 있습니다.`
        : `${dream.name}은(는) 상황에 따라 긍정적인 의미를 가질 수 있습니다.`
    },
    {
      question: `${dream.name}에서 주의해야 할 점은 무엇인가요?`,
      answer: dream.polarities?.caution
        ? `${dream.name}에서는 ${dream.polarities.caution.join(', ')} 등을 주의해야 할 수 있습니다.`
        : `${dream.name}의 구체적인 상황과 맥락을 고려하여 해석하는 것이 중요합니다.`
    },
    {
      question: `${dream.name}의 심리학적 의미는 무엇인가요?`,
      answer: `심리학적으로 ${dream.name}은(는) 무의식의 메시지나 내면의 감정 상태를 반영할 수 있습니다. 구체적인 해석은 꿈의 맥락에 따라 달라질 수 있습니다.`
    }
  ];

  // 카테고리별 추가 FAQ
  if (dream.category === 'animal') {
    baseFAQs.push({
      question: `${dream.name}에서 동물의 행동이 의미하는 것은?`,
      answer: '동물의 행동, 색상, 크기 등이 꿈의 의미를 좌우합니다. 구체적인 상황을 기억하는 것이 중요합니다.'
    });
  } else if (dream.category === 'emotion') {
    baseFAQs.push({
      question: `${dream.name}과 관련된 감정이 중요한가요?`,
      answer: '네, 꿈에서 느낀 감정이 해몽의 핵심입니다. 같은 꿈이라도 감정에 따라 의미가 달라질 수 있습니다.'
    });
  }

  return baseFAQs;
}

// 동적 정적 생성: 데이터베이스에서 모든 꿈 slug를 가져와 정적 페이지 생성
export async function generateStaticParams() {
  try {
    const slugs = await getAllDreamSlugs();
    
    // API에서 데이터를 가져오지 못한 경우 기본 slug만 반환
    if (slugs.length === 0) {
      console.warn('[generateStaticParams] API에서 slug를 가져오지 못했습니다. 기본 slug를 사용합니다.');
      return Object.keys(mockDreamData).map((slug) => ({ slug }));
    }
    
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error('[generateStaticParams] 오류:', error);
    // 오류 발생 시 기본 slug 반환
    return Object.keys(mockDreamData).map((slug) => ({ slug }));
  }
}

// SEO 메타데이터 생성
export async function generateMetadata({ params }: DreamPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // API에서 데이터 가져오기 시도
  const dream = await fetchDreamFromApi(slug) || mockDreamData[slug];

  if (!dream) {
    return {
      title: '꿈을 찾을 수 없습니다',
      description: '요청하신 꿈 정보가 존재하지 않거나 삭제되었을 수 있습니다.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://luckyday.app';
  const canonicalUrl = `${baseUrl}/dream/${slug}`;
  
  // 핵심 키워드를 앞쪽에 배치: "꿈해몽 [꿈이름]"
  const seoTitle = `꿈해몽 ${dream.name} | ${dream.name} 꿈 의미 해석`;
  const seoDescription = `${dream.name} 꿈해몽은 ${dream.summary} ${dream.quick_answer?.substring(0, 60) || ''}...`;
  
  return {
    title: seoTitle,
    description: seoDescription,
    keywords: Array.isArray(dream.tags) ? dream.tags.join(', ') : '',
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

export default async function DreamPage({ params }: DreamPageProps) {
  const { slug } = await params;
  
  // 데이터베이스에서 꿈 데이터 가져오기
  const dream = await fetchDreamFromApi(slug);

  // API에서 가져오지 못한 경우 폴백 데이터 사용
  const finalDream = dream || mockDreamData[slug];

  if (!finalDream) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">꿈을 찾을 수 없습니다</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          요청하신 꿈 정보가 존재하지 않거나 삭제되었을 수 있습니다.
        </p>
        <Button asChild>
          <Link href="/dream">
            꿈 사전으로 돌아가기
          </Link>
        </Button>
      </div>
    );
  }

  // 상세 FAQ 데이터 (꿈별 맞춤)
  const faqs = generateDreamFAQs(finalDream);

  // 관련 꿈 데이터 가져오기
  const relatedDreams = await fetchRelatedDreams(slug);

  // Table of Contents 항목 추출
  const tocItems = (finalDream.body_mdx || '').match(/^#{2,3} .+$/gm) || [];
  const tocLinks = tocItems.map((heading) => {
    const text = heading.replace(/^#+\s/, '');
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').substring(0, 50);
    return { text, id };
  });

  // 관련 꿈 이미지 매핑
  const relatedDreamImages: Record<string, string> = {
    'falling': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfXG-GhxORmv34F8GuTWDPac3V7Lx7EaIIbFmef2x8dsLJXlk4b9c0PFnO5FRr5VifXNVbxMKyhkriNJpajn4nnQ6Gs-z848Xl5KxRLwW8lwYwoWrk9o8C3pAHsyFo5YbBqhe2hxTQux0kfizh0j-znIVP0R7TVs_i1mFM0mAaZLh4JHa5HMbGg0myipz-klYvfuQgZ2CODqn1Zveo1n5YAmOr6hFWOUWfvs-9GVHKuYhKZoONQslDrgHI99Tc9WTLwG2GQeq9fEw',
    'water': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqd75T24vVvAeCIK6ej9snJvsZ03oFd7LWPfM1zKJvCu9pI1he21xj03LoYNslMSoeX4bM8VwliJE2YPinjkFPKMsTc49qSzP9Bft8Xb0cVgdGQJySq_YLS_k6FKH5nBQ3vwYFP-Vd1TO795ckBD8gDWJx1-93MDdUTpPiJw5k6AE7NVdpkr1qaaVNFyKdbdDWMBsUZPVlXaJINnaiUX0n_w_s8nm3BO3D2eBeu-zPIw0_19PApNkS7-psnK0UzUOIyF99pASlz5c',
    'being-chased': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ8wese2S9VMQyu0cQtcPeLzFUu285-XAPfbsPvJpW5eASAI1tONehoUzFjPeTzKxO1N082fNPCYHluDKyWVMZHtfy-tsCYf6FddV3lqXOnkmYz0_lStx_RR3G0ittqmx4kdNqqR5c6qGl2GNecIPQRFSjeL-XSwFquekfRC-zignpzoIwTaqOSQvfv6zIuWpLiIRBpVmtrbqJMs51L8-TnRyTIzSGaWzjrlVJpEK07zytSeFAuVHvrZkpHT6L5TqhWK7sKQItNJM',
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* 메인 콘텐츠 - 8열 */}
          <div className="lg:col-span-8">
            <article>
              {/* Breadcrumbs */}
              <nav className="mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary">
                    Home
                  </Link>
                  <span className="text-slate-600 dark:text-slate-400">/</span>
                  <Link href="/dream" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary">
                    Dream Dictionary
                  </Link>
                  <span className="text-slate-600 dark:text-slate-400">/</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {finalDream.name}
                  </span>
                </div>
              </nav>

              {/* 헤더 */}
              <header className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tighter text-slate-900 dark:text-slate-50 mb-4">
                  {finalDream.name}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {finalDream.summary || 'A short, engaging paragraph summarizing the dream\'s meaning, exploring themes of freedom, control, and new perspectives on your life\'s challenges and opportunities.'}
                </p>
              </header>

              {/* Direct Answer */}
              <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <h2 className="text-lg font-bold leading-tight tracking-tighter mb-2 text-slate-900 dark:text-slate-50">
                  Direct Answer
                </h2>
                <p className="text-base font-normal leading-normal text-slate-600 dark:text-slate-400">
                  {finalDream.quick_answer}
                </p>
              </div>

              {/* Table of Contents */}
              <details className="group mb-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden" open>
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">Table of Contents</h3>
                  <span className="transition-transform group-open:rotate-180">
                    <ChevronDown className="h-5 w-5" />
                  </span>
                </summary>
                <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                  <nav>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      {tocLinks.map((link) => (
                        <li key={link.id}>
                          <a
                            href={`#${link.id}`}
                            className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary"
                          >
                            {link.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </details>

              {/* 콘텐츠 */}
              <div className="prose prose-lg max-w-none text-slate-900 dark:text-slate-50">
                <MDXRenderer content={finalDream.body_mdx || ''} />
              </div>

              {/* 광고 슬롯 */}
              <div className="my-10 w-full min-h-[250px] bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-800">
                <AdSlot slot="dream-content-middle" />
              </div>

              {/* AI Interpretation 버튼 */}
              <div className="my-12 py-8 border-t border-b border-slate-200 dark:border-slate-800">
                <Button
                  asChild
                  className="w-full flex min-w-[84px] max-w-[480px] mx-auto h-12 px-6 bg-primary text-white text-base font-bold leading-normal"
                >
                  <Link href={`/ai?dream=${finalDream.slug}`}>
                    Continue with AI Interpretation
                  </Link>
                </Button>
              </div>

              {/* FAQ */}
              <section className="mb-12 scroll-mt-24" id="faq">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <details
                      key={index}
                      className="group p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800"
                    >
                      <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                        <span className="text-slate-900 dark:text-slate-50">{faq.question}</span>
                        <span className="transition-transform group-open:rotate-180">
                          <ChevronDown className="h-5 w-5" />
                        </span>
                      </summary>
                      <p className="text-slate-600 dark:text-slate-400 mt-3">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>

              {/* Related Dreams */}
              <section id="related-dreams">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">
                  Related Dreams
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedDreams.slice(0, 3).map((related) => {
                    const imageUrl = relatedDreamImages[related.slug] || relatedDreamImages['falling'];
                    return (
                      <Link
                        key={related.slug}
                        href={`/dream/${related.slug}`}
                        className="group block bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"
                      >
                        <div className="relative w-full aspect-video bg-center bg-no-repeat bg-cover">
                          <Image
                            src={imageUrl}
                            alt={related.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-base font-bold leading-tight group-hover:text-primary transition-colors text-slate-900 dark:text-slate-50">
                            {related.title}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            </article>
          </div>

          {/* 사이드바 - 4열 */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24">
              <div className="w-full min-h-[600px] bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-800">
                <AdSlot slot="dream-sidebar-vertical" />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
