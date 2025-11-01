/**
 * DreamScope 홈페이지
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
import { PersonalizedRecommendations } from '@/components/personalized-recommendations';
import { dreamDb } from '@/lib/supabase-client';
import { DreamSymbol } from '@/types/dream';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  // 인기 꿈 심볼 조회
  const { data: popularDreams, isLoading: dreamsLoading } = useQuery({
    queryKey: ['popular-dreams'],
    queryFn: () => dreamDb.getDreamSymbols({
      limit: 6,
      orderBy: 'popularity'
    }),
    staleTime: 10 * 60 * 1000, // 10분
  });

  // 검색 처리
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 검색 페이지로 이동
      window.location.href = `/dream?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // 인기 키워드들
  const popularKeywords = [
    { name: '뱀 꿈', slug: 'baem-snake-dream', icon: '🐍' },
    { name: '이빨 꿈', slug: 'tooth-loss-dream', icon: '🦷' },
    { name: '피 꿈', slug: 'blood-dream', icon: '🩸' },
    { name: '물 꿈', slug: 'water-dream', icon: '💧' },
    { name: '돈 꿈', slug: 'money-dream', icon: '💰' },
    { name: '집 꿈', slug: 'house-dream', icon: '🏠' },
  ];

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="flex items-center justify-center space-x-2 text-primary mb-4">
          <Moon className="h-8 w-8" />
          <Sparkles className="h-6 w-6" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          꿈의 의미를
          <br />
          <span className="text-primary">AI와 함께</span> 풀어보세요
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          심리학, 문화, 상징학을 바탕으로 한 정확한 꿈 해몽.
          5,000개 이상의 꿈 사전과 AI 분석으로 당신의 꿈을解读합니다.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="꿈에 나온 것을 검색하세요..."
            className="pl-10 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/ai">
              <Brain className="mr-2 h-5 w-5" />
              AI 해몽하기
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/dream">
              <BookOpen className="mr-2 h-5 w-5" />
              꿈 사전 보기
            </Link>
          </Button>
        </div>
      </section>

      {/* Popular Keywords */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">인기 꿈 키워드</h2>
          <p className="text-muted-foreground">많이 검색되는 꿈들의 의미를 확인하세요</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularKeywords.map((keyword) => (
            <Link key={keyword.slug} href={`/dream/${keyword.slug}`}>
              <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{keyword.icon}</div>
                  <h3 className="font-medium text-sm">{keyword.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Dreams */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">인기 꿈 해몽</h2>
          <Button variant="ghost" asChild>
            <Link href="/dream">전체 보기</Link>
          </Button>
        </div>

        {dreamsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDreams && popularDreams.length > 0 ? popularDreams.map((dream: DreamSymbol) => (
              <Card key={dream.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {dream.category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>{dream.popularity}</span>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{dream.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {dream.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {dream.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" className="w-full" asChild>
                    <Link href={`/dream/${dream.slug}`}>해몽 보기</Link>
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
      <section className="py-12">
        <PersonalizedRecommendations limit={4} />
      </section>

      {/* AI Features */}
      <section className="bg-muted rounded-lg p-8 text-center space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">AI 해몽의 장점</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
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

        <Button size="lg" asChild>
          <Link href="/ai">
            <Brain className="mr-2 h-5 w-5" />
            지금 AI 해몽 시작하기
          </Link>
        </Button>
      </section>

      {/* Disclaimer */}
      <section className="text-center text-sm text-muted-foreground space-y-2">
        <p>
          💡 이 사이트는 꿈 해석 정보를 제공하며, 의학적·법률적 조언이 아닙니다.
        </p>
        <p>
          꿈 해몽은 참고용으로만 사용하시고, 중요한 결정은 전문가와 상담하세요.
        </p>
      </section>
    </div>
  );
}
