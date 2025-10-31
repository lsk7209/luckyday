/**
 * 검색 페이지
 * @description 통합 검색 결과 표시
 */
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Search, FileText, BookOpen, Calculator, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { searchContent } from '@/lib/api/search';
import { Content } from '@/types/content';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<'all' | 'blog' | 'guide' | 'utility'>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'popularity'>('relevance');

  // URL 파라미터 변경 시 검색어 업데이트
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // 검색 실행
  const { data: searchData, isLoading, error, refetch } = useQuery({
    queryKey: ['search', query, type, sortBy],
    queryFn: () => {
      if (!query.trim()) return null;

      return searchContent({
        q: query,
        type: type === 'all' ? undefined : type,
        limit: 50,
      });
    },
    enabled: query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2분
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      refetch();
    }
  };

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case 'blog':
        return <FileText className="h-4 w-4" />;
      case 'guide':
        return <BookOpen className="h-4 w-4" />;
      case 'utility':
        return <Calculator className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (contentType: string) => {
    switch (contentType) {
      case 'blog':
        return '블로그';
      case 'guide':
        return '가이드';
      case 'utility':
        return '계산기';
      default:
        return contentType;
    }
  };

  const renderSearchResult = (content: Content) => {
    const isBlog = content.type === 'blog';
    const isGuide = content.type === 'guide';
    const isUtility = content.type === 'utility';

    return (
      <Card key={content.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              {getContentIcon(content.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{getTypeLabel(content.type)}</Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(content.updatedAt).toLocaleDateString('ko-KR')}
                </span>
              </div>

              <Link
                href={`/${content.type}/${(content as any).slug || content.id}`}
                className="block hover:text-primary transition-colors"
              >
                <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                  {content.title}
                </h3>
              </Link>

              <p className="text-muted-foreground line-clamp-3 mb-3">
                {(content as any).summary || '요약이 없습니다.'}
              </p>

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                {isBlog && (content as any).readingMinutes && (
                  <span>{(content as any).readingMinutes}분 읽기</span>
                )}
                {isGuide && (content as any).durationMinutes && (
                  <span>{(content as any).durationMinutes}분 소요</span>
                )}
                {isGuide && (content as any).level && (
                  <span>난이도: {(content as any).level}</span>
                )}
                {isUtility && (content as any).category && (
                  <span>카테고리: {(content as any).category}</span>
                )}
              </div>

              {(content as any).tags && (content as any).tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {(content as any).tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* 검색 헤더 */}
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">검색</h1>
          <p className="text-muted-foreground">
            계산기, 가이드, 블로그에서 원하는 콘텐츠를 찾아보세요.
          </p>
        </div>

        {/* 검색 폼 */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="검색어를 입력하세요..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              검색
            </Button>
          </div>
        </form>

        {/* 필터 옵션 */}
        {query.trim() && (
          <div className="flex items-center justify-center space-x-4">
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="blog">블로그</SelectItem>
                <SelectItem value="guide">가이드</SelectItem>
                <SelectItem value="utility">계산기</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">관련도</SelectItem>
                <SelectItem value="date">최신순</SelectItem>
                <SelectItem value="popularity">인기순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* 검색 결과 */}
      {query.trim() ? (
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">검색 중...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                검색 중 오류가 발생했습니다.
              </div>
              <Button onClick={() => refetch()} variant="outline">
                다시 시도
              </Button>
            </div>
          ) : searchData ? (
            <div className="space-y-6">
              {/* 결과 요약 */}
              <div className="flex items-center justify-between">
                <div className="text-muted-foreground">
                  <strong>{searchData.total}</strong>개의 결과가 있습니다.
                  {searchData.query && (
                    <span className="ml-2">
                      검색어: "<strong>{searchData.query}</strong>"
                    </span>
                  )}
                </div>

                {searchData.suggestions && searchData.suggestions.length > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">추천 검색어: </span>
                    {searchData.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="link"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => setQuery(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* 결과 목록 */}
              {searchData.results.length > 0 ? (
                <div className="space-y-4">
                  {searchData.results.map(renderSearchResult)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">검색 결과가 없습니다</h3>
                  <p className="mt-2 text-muted-foreground">
                    다른 검색어로 시도해보세요.
                  </p>
                </div>
              )}

              {/* 더보기 */}
              {searchData.hasMore && (
                <div className="text-center pt-8">
                  <Button variant="outline">
                    더 많은 결과 보기
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">검색어를 입력하세요</h3>
              <p className="mt-2 text-muted-foreground">
                찾고 싶은 콘텐츠의 키워드를 입력해주세요.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">검색을 시작하세요</h3>
          <p className="mt-2 text-muted-foreground">
            계산기, 가이드, 블로그에서 원하는 콘텐츠를 찾아보세요.
          </p>
        </div>
      )}
    </div>
  );
}
