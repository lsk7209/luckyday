/**
 * 꿈 상세 페이지
 * @description 개별 꿈 심볼의 상세 해석과 관련 정보 표시
 */
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Brain, TrendingUp, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TableOfContents from '@/components/shared/table-of-contents';
import FAQAccordion from '@/components/shared/faq-accordion';
import RelatedList from '@/components/shared/related-list';
import AdSlot from '@/components/shared/ad-slot';
import { BookmarkButton } from '@/components/bookmark';
import { DreamShare } from '@/components/social-share';
import MDXRenderer from '@/components/dream/mdx-renderer';
import { dreamDb } from '@/lib/supabase-client';
import { DreamSymbol, DreamPageProps } from '@/types/dream';

// 임시 데이터 - 실제로는 API에서 가져올 예정
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

// SEO 메타데이터 생성
export async function generateMetadata({ params }: DreamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dream = mockDreamData[slug];

  if (!dream) {
    return {
      title: '꿈을 찾을 수 없습니다',
    };
  }

  return {
    title: `${dream.name} 해몽 | 의미·상황별 해석`,
    description: dream.summary,
    keywords: dream.tags.join(', '),
    openGraph: {
      title: `${dream.name} 꿈 해몽 - 심리학적 분석`,
      description: dream.summary,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dream.name} 꿈 해몽`,
      description: dream.summary,
    },
  };
}

export default async function DreamPage({ params }: DreamPageProps) {
  const { slug } = await params;
  const dream = mockDreamData[slug];

  if (!dream) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">꿈을 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-6">
          요청하신 꿈 정보가 존재하지 않거나 삭제되었을 수 있습니다.
        </p>
        <Button asChild>
          <Link href="/dream">
            <ArrowLeft className="mr-2 h-4 w-4" />
            꿈 사전으로 돌아가기
          </Link>
        </Button>
      </div>
    );
  }

  // 상세 FAQ 데이터 (꿈별 맞춤)
  const faqs = generateDreamFAQs(dream);

  // 임시 관련 꿈 데이터
  const relatedDreams = [
    {
      slug: 'baem-snake-dream',
      title: '뱀 꿈 해몽',
      type: 'dream' as const,
      similarity: 0.8
    },
    {
      slug: 'tooth-loss-dream',
      title: '이빨 꿈 해몽',
      type: 'dream' as const,
      similarity: 0.7
    }
  ];

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/dream" className="hover:text-foreground">꿈 사전</Link>
          <span>/</span>
          <span>{dream.name}</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">{dream.name} 해몽</h1>
              <p className="text-xl text-muted-foreground">{dream.summary}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>{dream.popularity}회 조회</span>
              </div>
              <Badge variant="secondary">{dream.category}</Badge>
            </div>
          </div>

          {/* 빠른 답변 */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-primary font-medium leading-relaxed">
                  {dream.quick_answer}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            {dream.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>

          {/* 북마크 및 공유 버튼 */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              이 꿈 해석이 도움이 되셨나요?
            </div>
            <div className="flex items-center gap-3">
              <DreamShare
                dreamName={dream.name}
                dreamSummary={dream.summary}
                dreamSlug={dream.slug}
              />
              <BookmarkButton
                dreamSlug={dream.slug}
                dreamName={dream.name}
                showText={true}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <time dateTime={dream.last_updated}>
              마지막 업데이트: {new Date(dream.last_updated).toLocaleDateString('ko-KR')}
            </time>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 목차 - 데스크톱 사이드바 */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24 space-y-6">
            <TableOfContents content={dream.body_mdx} />
          </div>
        </div>

        {/* 본문 */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <Card>
            <CardContent className="p-6 md:p-8 lg:p-10">
              <article className="max-w-none">
                {/* 고도화된 MDX 렌더러 사용 */}
                <MDXRenderer content={dream.body_mdx} />
              </article>
            </CardContent>
          </Card>

          {/* 광고 슬롯 */}
          <AdSlot slot="dream-content-middle" className="mt-8" />

          {/* FAQ 섹션 */}
          <div className="mt-8">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>

        {/* 사이드바 */}
        <div className="lg:col-span-1 order-3">
          <div className="sticky top-24 space-y-6">
            {/* AI 해몽 CTA */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>AI 해몽으로 더 자세히</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  심리학, 문화, 상징학 관점에서 개인 맞춤 분석을 받아보세요.
                </p>
                <Button asChild className="w-full">
                  <Link href={`/ai?dream=${dream.slug}`}>
                    AI 해몽 시작하기
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* 관련 꿈 */}
            <RelatedList items={relatedDreams} title="관련 꿈 해몽" />

            {/* 광고 슬롯 */}
            <AdSlot slot="dream-sidebar" />
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <div className="flex justify-between items-center pt-8 border-t">
        <Button variant="outline" asChild>
          <Link href="/dream">
            <ArrowLeft className="mr-2 h-4 w-4" />
            꿈 사전으로 돌아가기
          </Link>
        </Button>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            공유하기
          </Button>
          <Button variant="outline" size="sm">
            북마크
          </Button>
        </div>
      </div>
    </div>
  );
}
