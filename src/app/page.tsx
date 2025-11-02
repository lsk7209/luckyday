/**
 * 럭키데이 홈페이지
 * @description 꿈 해몽 사이트 메인 페이지 - 검색, 인기 키워드, AI 해몽 CTA
 */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Moon, Sparkles, Search, TrendingUp, Star, Loader2, Brain, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';

// 클라이언트 사이드에서만 로드되는 컴포넌트들
const PersonalizedRecommendations = dynamic(
  () => import('@/components/personalized-recommendations').then(mod => ({ default: mod.PersonalizedRecommendations })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 text-center">맞춤 추천 로딩 중...</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
);
import { workersDreamDb } from '@/lib/api-client-dream';
import { DreamSymbol } from '@/types/dream';

// 인기 키워드들 (컴포넌트 외부로 이동)
const popularKeywords = [
  { name: '뱀 꿈', slug: 'baem-snake-dream', icon: '🐍', category: 'animal' as const },
  { name: '이빨 꿈', slug: 'tooth-loss-dream', icon: '🦷', category: 'body' as const },
  { name: '피 꿈', slug: 'blood-dream', icon: '🩸', category: 'body' as const },
  { name: '물 꿈', slug: 'water-dream', icon: '💧', category: 'element' as const },
  { name: '돈 꿈', slug: 'money-dream', icon: '💰', category: 'object' as const },
  { name: '집 꿈', slug: 'house-dream', icon: '🏠', category: 'place' as const },
];

// 폴백 꿈 데이터 생성 함수
const createFallbackDreams = (): DreamSymbol[] => {
  return popularKeywords.map(keyword => ({
    id: keyword.slug,
    slug: keyword.slug,
    name: keyword.name,
    category: keyword.category,
    summary: `${keyword.name}에 대한 상세한 해몽을 확인해보세요.`,
    quick_answer: `${keyword.name}의 의미를 궁금하시나요? 상세 페이지에서 확인하세요.`,
    body_mdx: '',
    tags: [keyword.name.replace(' 꿈', ''), '해몽', '꿈해석'],
    popularity: 100,
    polarities: {},
    modifiers: {},
    last_updated: new Date().toISOString(),
  }));
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  // 인기 꿈 심볼 조회
  const { data: popularDreams, isLoading: dreamsLoading, error: dreamsError } = useQuery({
    queryKey: ['popular-dreams'],
    queryFn: async () => {
      try {
        const dreams = await workersDreamDb.getDreamSymbols({
          limit: 6,
          orderBy: 'popularity'
        });
        
        // API에서 데이터가 없을 경우 인기 키워드 기반으로 폴백 데이터 생성
        if (!dreams || dreams.length === 0) {
          console.warn('[Home] API에서 꿈 데이터를 가져오지 못했습니다. 폴백 데이터를 사용합니다.');
          return createFallbackDreams();
        }
        
        console.log('[Home] 꿈 데이터 로드 성공:', dreams.length, '개');
        return dreams;
      } catch (error) {
        console.error('[Home] 꿈 데이터 조회 실패:', error);
        // 에러 발생 시에도 폴백 데이터 반환하여 UI가 깨지지 않도록 함
        return createFallbackDreams();
      }
    },
    staleTime: 10 * 60 * 1000, // 10분
    retry: 2,
    retryDelay: 1000,
  });

  // 검색 처리
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 검색 페이지로 이동
      window.location.href = `/dream?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className="w-full space-y-12 md:space-y-16 lg:space-y-20 py-8 md:py-12 lg:py-16">
      {/* Hero Section */}
      <section className="w-full section-container text-center space-y-6 md:space-y-8 py-12 md:py-16 lg:py-20">
        <div className="flex items-center justify-center space-x-2 text-primary mb-2 md:mb-4">
          <Moon className="h-6 w-6 md:h-8 md:w-8" />
          <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight">
          꿈의 의미를
          <br className="md:hidden" />
          <span className="hidden md:inline"> </span>
          <span className="text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">AI와 함께</span> 풀어보세요
        </h1>

        <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
          심리학, 문화, 상징학을 바탕으로 한 정확한 꿈 해몽.
          <br className="hidden sm:inline" />
          5,000개 이상의 꿈 사전과 AI 분석으로 당신의 꿈을解读합니다.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative w-full">
          <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="꿈에 나온 것을 검색하세요..."
            className="pl-14 h-14 md:h-16 text-lg md:text-xl rounded-full border-2 shadow-lg focus:shadow-xl transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
          <Button size="lg" className="w-full sm:w-auto text-base md:text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
            <Link href="/ai">
              <Brain className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              AI 해몽하기
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto text-base md:text-lg px-8 py-6 rounded-full border-2 hover:border-primary/50 transition-all" asChild>
            <Link href="/dream">
              <BookOpen className="mr-2 h-5 w-5 md:h-6 md:w-6" />
              꿈 사전 보기
            </Link>
          </Button>
        </div>
      </section>

      {/* Popular Keywords */}
      <section className="w-full section-container space-y-8 md:space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">인기 꿈 키워드</h2>
          <p className="text-base md:text-lg text-muted-foreground">많이 검색되는 꿈들의 의미를 확인하세요</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6 max-w-7xl mx-auto">
          {popularKeywords.map((keyword) => (
            <Link key={keyword.slug} href={`/dream/${keyword.slug}`}>
              <Card className="hover:shadow-xl hover:shadow-primary/10 transition-all hover:scale-105 cursor-pointer h-full border-2 hover:border-primary/20 group">
                <CardContent className="p-4 md:p-6 text-center flex flex-col items-center justify-center min-h-[100px] md:min-h-[120px]">
                  <div className="text-3xl md:text-4xl mb-2 md:mb-3 group-hover:scale-110 transition-transform">{keyword.icon}</div>
                  <h3 className="font-semibold text-sm md:text-base leading-tight group-hover:text-primary transition-colors">{keyword.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Dreams */}
      <section className="w-full section-container space-y-8 md:space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">인기 꿈 해몽</h2>
          <Button variant="ghost" size="lg" className="self-start sm:self-auto text-base" asChild>
            <Link href="/dream">전체 보기 →</Link>
          </Button>
        </div>

        {dreamsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {popularDreams && popularDreams.length > 0 ? popularDreams.map((dream: DreamSymbol) => (
              <Card key={dream.slug} className="hover:shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-1 border hover:border-primary/10 group h-full flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="text-xs font-medium">
                      {dream.category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-semibold">{dream.popularity}</span>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">{dream.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    {dream.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow justify-end">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dream.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button size="default" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                    <Link href={`/dream/${dream.slug}`}>해몽 보기 →</Link>
                  </Button>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-12 col-span-full">
                <Moon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">꿈 데이터를 불러올 수 없습니다</h3>
                <p className="mt-2 text-muted-foreground">
                  데이터베이스 연결을 확인해주세요.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Personalized Recommendations */}
      <section className="w-full section-container py-12 md:py-16">
        <PersonalizedRecommendations limit={4} />
      </section>

      {/* AI Features */}
      <section className="w-full section-container">
        <div className="bg-gradient-to-br from-muted/50 via-muted/30 to-background rounded-2xl lg:rounded-3xl p-8 md:p-12 lg:p-16 text-center space-y-8 md:space-y-12 border border-border/50 shadow-xl">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Brain className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">AI 해몽의 장점</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-left max-w-6xl mx-auto">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">다각적 분석</h3>
            <p className="text-sm text-muted-foreground">
              심리학, 문화, 상징학 관점에서 종합적으로 분석합니다.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">개인 맞춤</h3>
            <p className="text-sm text-muted-foreground">
              감정, 색상, 관계 등을 고려한 맞춤형 해석을 제공합니다.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">풍부한 사전</h3>
            <p className="text-sm text-muted-foreground">
              5,000개 이상의 꿈 사전과 실례를 바탕으로 정확한 해석.
            </p>
          </div>
        </div>

        <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
          <Link href="/ai">
            <Brain className="mr-2 h-6 w-6" />
            지금 AI 해몽 시작하기
          </Link>
        </Button>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="w-full section-container text-center text-sm md:text-base text-muted-foreground space-y-3 py-8">
        <div className="max-w-3xl mx-auto bg-muted/30 rounded-xl p-6 space-y-2">
          <p className="font-medium">
            💡 이 사이트는 꿈 해석 정보를 제공하며, 의학적·법률적 조언이 아닙니다.
          </p>
          <p>
            꿈 해몽은 참고용으로만 사용하시고, 중요한 결정은 전문가와 상담하세요.
          </p>
        </div>
      </section>
    </div>
  );
}
