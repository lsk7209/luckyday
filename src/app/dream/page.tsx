/**
 * 꿈 사전 페이지
 * @description 꿈 심볼 목록 및 검색 기능
 */
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Filter, Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DreamCard from '@/components/dream/dream-card';
import { AdvancedSearch } from '@/components/advanced-search';
import { dreamDb } from '@/lib/supabase-client';
import { DreamSymbol } from '@/types/dream';


const CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: 'animal', label: '동물' },
  { value: 'emotion', label: '감정' },
  { value: 'place', label: '장소' },
  { value: 'object', label: '물건' },
  { value: 'action', label: '행동' },
  { value: 'color', label: '색상' },
  { value: 'number', label: '숫자' },
];

export default function DreamDictionary() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'name'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [searchResults, setSearchResults] = useState<DreamSymbol[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const pageSize = 20;


  // 꿈 심볼 목록 조회 (검색 모드가 아닐 때만)
  const { data: dreams, isLoading, error } = useQuery({
    queryKey: ['dream-symbols', selectedCategory, sortBy, page],
    queryFn: () => dreamDb.getDreamSymbols({
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: sortBy
    }),
    staleTime: 10 * 60 * 1000, // 10분
  });

  // 검색 핸들러
  const handleAdvancedSearch = (query: string, results: DreamSymbol[]) => {
    setSearchResults(results);
    setIsSearchMode(results.length > 0);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchResults([]);
    setIsSearchMode(false);
    setPage(1);
  };

  const displayDreams = isSearchMode ? searchResults : dreams;
  const isLoadingData = isLoading;

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">꿈 사전</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          5,000개 이상의 꿈 심볼을 검색하고 의미를 알아보세요
        </p>
      </div>

      {/* 고급 검색 */}
      <div className="max-w-4xl mx-auto">
        <AdvancedSearch
          onSearch={handleAdvancedSearch}
          placeholder="꿈에 대해 자연어로 물어보세요 (예: 무서운 꿈, 큰 뱀 꿈)"
          showRecommendations={true}
        />
      </div>

      {/* 카테고리 필터 (검색 모드가 아닐 때만 표시) */}
      {!isSearchMode && (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">정렬:</span>
              <Select value={sortBy} onValueChange={(value: 'popularity' | 'name') => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">인기순</SelectItem>
                  <SelectItem value="name">가나다순</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {isSearchMode && (
          <div className="text-center">
            <p className="text-muted-foreground">
              검색 결과: {displayDreams?.length || 0}개
            </p>
            <Button variant="ghost" size="sm" onClick={clearSearch} className="mt-2">
              검색 초기화
            </Button>
          </div>
        )}
      </div>

      {/* 콘텐츠 렌더링 */}
      <div>
        {isLoadingData && (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {Array.from({ length: 6 }).map((_, i) => (
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
        )}

        {!isLoadingData && error && (
          <div className="text-center py-12">
            <p className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        )}

        {!isLoadingData && !error && displayDreams && displayDreams.length > 0 && (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {displayDreams.map((dream: DreamSymbol) => (
              <DreamCard key={dream.slug} dream={dream} />
            ))}
          </div>
        )}

        {!isLoadingData && !error && (!displayDreams || displayDreams.length === 0) && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {searchQuery ? '검색 결과가 없습니다.' : '등록된 꿈 심볼이 없습니다.'}
            </div>
            {searchQuery && (
              <Button onClick={clearSearch}>전체 목록 보기</Button>
            )}
          </div>
        )}
      </div>

      {/* 페이지네이션 (검색이 아닐 때만) */}
      {!searchQuery && dreams && dreams.length >= pageSize && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            이전
          </Button>
          <span className="px-4 py-2 text-muted-foreground">
            {page} 페이지
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
