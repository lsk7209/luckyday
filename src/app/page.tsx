/**
 * 홈 페이지
 * @description CMS 메인 페이지 - 계산기, 블로그, 가이드 인기 콘텐츠 표시
 */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calculator, BookOpen, FileText, Search, TrendingUp, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getContentList } from '@/lib/api/content';
import { searchContent } from '@/lib/api/search';
import { Content } from '@/types/content';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  // 인기 계산기 조회
  const { data: utilitiesData, isLoading: utilitiesLoading } = useQuery({
    queryKey: ['featured-utilities'],
    queryFn: () => getContentList({
      type: 'utility',
      status: 'published',
      limit: 3,
    }),
    staleTime: 5 * 60 * 1000, // 5분
  });

  // 최신 콘텐츠 조회
  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ['recent-content'],
    queryFn: () => getContentList({
      status: 'published',
      limit: 3,
      // 타입별로 섞어서 가져오기 위해 별도 로직 필요
    }),
    staleTime: 5 * 60 * 1000,
  });

  // 검색 처리
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 검색 페이지로 이동
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // 데이터 가공
  const featuredUtilities = utilitiesData?.content.map((item: any) => ({
    id: item.id.toString(),
    title: item.title,
    description: item.summary,
    category: (item as any).category || '기타',
    rating: 4.5, // 임시 값
    usage: 1000, // 임시 값
  })) || [];

  const recentPosts = recentData?.content.map((item: any) => ({
    id: item.id.toString(),
    title: item.title,
    type: item.type,
    readingMinutes: item.readingMinutes || 5,
    durationMinutes: item.durationMinutes || 10,
    level: item.level || '중급',
    tags: item.tags || [],
  })) || [];

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          워드프레스보다 빠르고,<br />
          <span className="text-primary">자동으로 색인되는</span><br />
          생활형 계산기 CMS
          </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          계산기, 블로그, 가이드를 하나의 플랫폼에서 관리하세요.
          SEO 최적화와 자동 색인으로 검색 상위 노출을 보장합니다.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="계산기, 가이드, 블로그 검색..."
            className="pl-10 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/utility">
              <Calculator className="mr-2 h-5 w-5" />
              계산기 둘러보기
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/blog">블로그 읽기</Link>
          </Button>
        </div>
      </section>

      {/* Featured Utilities */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">인기 계산기</h2>
          <Button variant="ghost" asChild>
            <Link href="/utility">전체 보기</Link>
          </Button>
        </div>

        {utilitiesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredUtilities.length > 0 ? featuredUtilities.map((utility) => (
            <Card key={utility.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{utility.category}</Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{utility.rating}</span>
                  </div>
                </div>
                <CardTitle className="line-clamp-2">{utility.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {utility.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    {utility.usage.toLocaleString()}회 사용
                  </span>
                  <Button size="sm" asChild>
                    <Link href={`/utility/${utility.id}`}>사용하기</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-12">
              <Calculator className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">계산기를 찾을 수 없습니다</h3>
              <p className="mt-2 text-muted-foreground">
                아직 등록된 계산기가 없습니다.
              </p>
            </div>
          )}
        )}
      </div>
      </section>

      {/* Recent Content */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">최신 콘텐츠</h2>
          <Button variant="ghost" asChild>
            <Link href="/blog">전체 보기</Link>
          </Button>
        </div>

        {recentLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded mb-3"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.length > 0 ? recentPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  {post.type === 'blog' ? (
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Badge variant="outline">{post.type === 'blog' ? '블로그' : '가이드'}</Badge>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  {post.type === 'blog' ? (
                    <>
                      <span>{post.readingMinutes}분 읽기</span>
                      <div className="flex flex-wrap gap-1">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <span>{post.durationMinutes}분 소요</span>
                      <Badge variant="secondary" className="text-xs">
                        {post.level}
                      </Badge>
                    </>
                  )}
                </div>
                <Button size="sm" className="w-full mt-4" asChild>
                  <Link href={`/${post.type}/${post.id}`}>
                    {post.type === 'blog' ? '읽기' : '보기'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">콘텐츠를 찾을 수 없습니다</h3>
              <p className="mt-2 text-muted-foreground">
                아직 등록된 콘텐츠가 없습니다.
              </p>
            </div>
          )}
        )}
      </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted rounded-lg p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">SEO 최적화와 자동 색인으로</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Google Search Console, IndexNow, 그리고 내장된 분석 도구로
          검색 엔진 최적화를 자동화하세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/admin">관리자 콘솔</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/docs">문서 보기</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
