'use client';

/**
 * 개인화된 꿈 추천 컴포넌트
 * 사용자의 검색 기록과 북마크를 기반으로 추천
 */
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, Clock, Heart, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBookmarks } from '@/components/bookmark';

interface DreamRecommendation {
  id: string;
  slug: string;
  name: string;
  summary: string;
  category: string;
  popularity: number;
  tags: string[];
  score: number; // 추천 점수 (0-100)
  reason: string; // 추천 이유
}

// 추천 알고리즘 타입
type RecommendationType = 'bookmarked' | 'searched' | 'popular' | 'similar' | 'trending';

// 모의 꿈 데이터베이스 (실제로는 API에서 가져옴)
const MOCK_DREAMS: DreamRecommendation[] = [
  {
    id: '1',
    slug: 'baem-snake-dream',
    name: '뱀 꿈',
    summary: '뱀 꿈은 변화와 갱신의 신호입니다.',
    category: 'animal',
    popularity: 1250,
    tags: ['뱀꿈', '해몽', '변화', '갱신'],
    score: 85,
    reason: '북마크한 꿈과 유사',
  },
  {
    id: '2',
    slug: 'tooth-loss-dream',
    name: '이빨 꿈',
    summary: '이빨 꿈은 변화, 불안, 자기표현의 신호입니다.',
    category: 'body',
    popularity: 980,
    tags: ['이빨꿈', '해몽', '불안', '변화'],
    score: 78,
    reason: '최근 검색 기록 기반',
  },
  {
    id: '3',
    slug: 'water-dream',
    name: '물 꿈',
    summary: '물 꿈은 감정 상태와 무의식을 반영합니다.',
    category: 'element',
    popularity: 750,
    tags: ['물꿈', '해몽', '감정', '무의식'],
    score: 72,
    reason: '인기 상승 꿈',
  },
  {
    id: '4',
    slug: 'flying-dream',
    name: '나는 꿈',
    summary: '나는 꿈은 자유와 해방감을 상징합니다.',
    category: 'action',
    popularity: 650,
    tags: ['나는꿈', '해몽', '자유', '해방'],
    score: 68,
    reason: '관련 태그 기반',
  },
  {
    id: '5',
    slug: 'money-dream',
    name: '돈 꿈',
    summary: '돈 꿈은 재물운과 경제적 안정을 상징합니다.',
    category: 'object',
    popularity: 890,
    tags: ['돈꿈', '해몽', '재물', '부'],
    score: 65,
    reason: '인기 카테고리',
  },
];

export function PersonalizedRecommendations({
  limit = 4,
  showHeader = true,
  className = ''
}: {
  limit?: number;
  showHeader?: boolean;
  className?: string;
}) {
  const { bookmarks } = useBookmarks();
  const [recommendations, setRecommendations] = useState<DreamRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  // 추천 알고리즘
  const generateRecommendations = useMemo(() => {
    // 클라이언트 사이드에서만 localStorage 접근
    if (typeof window === 'undefined') {
      return [];
    }

    // 검색 기록 가져오기
    const searchHistory = JSON.parse(localStorage.getItem('dreamscope-search-history') || '[]');

    // 북마크한 꿈들의 태그 분석
    const bookmarkedTags = new Set<string>();
    const bookmarkedDreams = MOCK_DREAMS.filter(dream => bookmarks.includes(dream.slug));

    bookmarkedDreams.forEach(dream => {
      dream.tags.forEach(tag => bookmarkedTags.add(tag));
    });

    // 검색한 키워드 분석
    const searchedKeywords = new Set<string>();
    searchHistory.forEach((query: string) => {
      // 간단한 키워드 추출 (실제로는 더 정교한 NLP 사용)
      const words = query.split(' ');
      words.forEach(word => {
        if (word.length > 1) searchedKeywords.add(word);
      });
    });

    // 추천 점수 계산
    const scoredDreams = MOCK_DREAMS.map(dream => {
      let score = dream.popularity / 10; // 기본 인기도 점수
      let reason = '인기 꿈';

      // 북마크 기반 점수
      const bookmarkMatches = dream.tags.filter(tag => bookmarkedTags.has(tag)).length;
      if (bookmarkMatches > 0) {
        score += bookmarkMatches * 25;
        reason = '북마크한 꿈과 유사';
      }

      // 검색 기록 기반 점수
      const searchMatches = dream.tags.filter(tag =>
        Array.from(searchedKeywords).some(keyword =>
          tag.includes(keyword) || keyword.includes(tag)
        )
      ).length;
      if (searchMatches > 0) {
        score += searchMatches * 20;
        reason = '최근 검색 기록 기반';
      }

      // 시간 기반 가중치 (최근 검색/북마크가 더 높은 점수)
      const timeWeight = Math.max(0, 1 - (Date.now() - Date.parse('2024-01-01')) / (1000 * 60 * 60 * 24 * 30));
      score += timeWeight * 10;

      // 이미 본 꿈은 점수 감소
      if (bookmarks.includes(dream.slug)) {
        score *= 0.3;
        reason = '이미 북마크함';
      }

      return {
        ...dream,
        score: Math.min(100, Math.round(score)),
        reason,
      };
    });

    // 점수 기준 정렬 및 중복 제거
    return scoredDreams
      .filter(dream => !bookmarks.includes(dream.slug)) // 이미 북마크한 꿈 제외
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }, [bookmarks, limit]);

  useEffect(() => {
    // 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setRecommendations(generateRecommendations);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [generateRecommendations]);

  if (loading) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary animate-pulse" />
              개인 맞춤 추천
            </CardTitle>
            <CardDescription>
              당신에게 맞는 꿈 해석을 찾고 있습니다...
            </CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              개인 맞춤 추천
            </CardTitle>
            <CardDescription>
              더 많은 꿈을 검색하고 북마크하면 맞춤 추천을 받을 수 있습니다.
            </CardDescription>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">추천 준비중</h3>
            <p className="text-muted-foreground mb-4">
              꿈을 검색하고 북마크하면 개인 맞춤 추천을 받을 수 있습니다.
            </p>
            <Button asChild>
              <Link href="/dream">꿈 사전 둘러보기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            개인 맞춤 추천
          </CardTitle>
          <CardDescription>
            당신의 관심사와 검색 기록을 바탕으로 추천하는 꿈 해석입니다.
          </CardDescription>
        </CardHeader>
      )}

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.map((dream) => (
            <div
              key={dream.id}
              className="group relative p-4 border rounded-lg hover:shadow-md transition-all hover:border-primary/20"
            >
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {dream.category}
                </Badge>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{dream.score}%</span>
                </div>
              </div>

              <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">
                <Link href={`/dream/${dream.slug}`} className="hover:underline">
                  {dream.name}
                </Link>
              </h4>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {dream.summary}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Heart className="h-3 w-3" />
                  <span>{dream.reason}</span>
                </div>

                <Button size="sm" variant="ghost" asChild>
                  <Link href={`/dream/${dream.slug}`}>
                    보기
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {recommendations.length >= limit && (
          <div className="text-center mt-6">
            <Button variant="outline" asChild>
              <Link href="/dream">
                더 많은 꿈 보기
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 추천 카드 컴포넌트 (더 컴팩트한 버전)
export function RecommendationCard({ dream }: { dream: DreamRecommendation }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {dream.category}
          </Badge>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-xs font-medium">{dream.score}</span>
          </div>
        </div>

        <h4 className="font-medium mb-1">
          <Link href={`/dream/${dream.slug}`} className="hover:text-primary hover:underline">
            {dream.name}
          </Link>
        </h4>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {dream.summary}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{dream.reason}</span>
          <Button size="sm" variant="ghost">
            <Link href={`/dream/${dream.slug}`}>보기</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// 추천 섹션 컴포넌트 (메인 페이지용)
export function RecommendationSection() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">맞춤 꿈 추천</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            당신의 관심사와 검색 기록을 분석하여 개인 맞춤 꿈 해석을 추천합니다.
          </p>
        </div>

        <PersonalizedRecommendations
          limit={6}
          showHeader={false}
          className="max-w-6xl mx-auto"
        />
      </div>
    </section>
  );
}
