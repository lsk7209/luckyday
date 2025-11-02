/**
 * Dream Dictionary 페이지
 * @description 꿈 심볼 목록 및 검색 기능 - HTML 디자인 반영
 */
'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flight, 
  Tooth, 
  Droplets, 
  Run, 
  Web, 
  Home, 
  ArrowDown,
  Plane,
  Water,
  Activity,
  Spider,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdSlot from '@/components/shared/ad-slot';
import { workersDreamDb } from '@/lib/api-client-dream';
import { DreamSymbol } from '@/types/dream';

/**
 * 꿈 이름에 따른 아이콘 매핑
 */
const getDreamIcon = (name: string, category: string) => {
  const nameLower = name.toLowerCase();
  
  // 특정 꿈에 대한 아이콘 매핑
  if (nameLower.includes('flying') || nameLower.includes('비행')) return Flight;
  if (nameLower.includes('teeth') || nameLower.includes('이빨') || nameLower.includes('치아')) return Tooth;
  if (nameLower.includes('water') || nameLower.includes('물')) return Droplets;
  if (nameLower.includes('chase') || nameLower.includes('쫓김') || nameLower.includes('추격')) return Run;
  if (nameLower.includes('spider') || nameLower.includes('거미')) return Web;
  if (nameLower.includes('house') || nameLower.includes('집') || nameLower.includes('home')) return Home;
  if (nameLower.includes('falling') || nameLower.includes('떨어짐') || nameLower.includes('낙하')) return ArrowDown;
  
  // 카테고리별 기본 아이콘
  switch (category) {
    case 'animal':
      return Activity;
    case 'place':
      return Building;
    case 'emotion':
      return Activity;
    default:
      return Activity;
  }
};

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'animal', label: 'Animals' },
  { value: 'object', label: 'Objects' },
  { value: 'emotion', label: 'Emotions' },
  { value: 'place', label: 'Places' },
  { value: 'action', label: 'Actions' },
  { value: 'color', label: 'Colors' },
  { value: 'number', label: 'Numbers' },
];

const ALPHABET = ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export default function DreamDictionary() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [sortBy, setSortBy] = useState<'popularity' | 'name'>('popularity');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // 전체 데이터와 페이지네이션된 데이터를 별도로 관리
  const { data: allDreamsData, isLoading, error } = useQuery({
    queryKey: ['dream-symbols-all', selectedCategory, selectedLetter, sortBy],
    queryFn: async () => {
      const allDreams = await workersDreamDb.getDreamSymbols({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        limit: 1000, // 알파벳 필터를 위해 충분한 데이터 가져오기
        orderBy: sortBy
      });
      
      // 알파벳 필터 적용
      let filtered = allDreams;
      if (selectedLetter !== 'All') {
        filtered = allDreams.filter(dream => {
          const firstLetter = dream.name.charAt(0).toUpperCase();
          return firstLetter === selectedLetter;
        });
      }
      
      return filtered;
    },
  });

  // 페이지네이션 적용
  const dreams = useMemo(() => {
    if (!allDreamsData) return [];
    const startIndex = (page - 1) * pageSize;
    return allDreamsData.slice(startIndex, startIndex + pageSize);
  }, [allDreamsData, page]);

  // 총 페이지 수 계산
  const totalPages = useMemo(() => {
    if (!allDreamsData || allDreamsData.length === 0) return 1;
    return Math.ceil(allDreamsData.length / pageSize);
  }, [allDreamsData]);

  // 페이지네이션 계산
  const maxPages = 10; // HTML에서 보이는 최대 페이지 수
  const paginationPages = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2, 3, '...', totalPages);
    }
    return pages;
  }, [totalPages]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 py-8 md:py-12 px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter">
              Dream Dictionary
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal max-w-xl">
              Search our comprehensive dictionary to uncover the psychological and symbolic meanings behind your dreams.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse h-[250px]"></Card>
          ))}
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex flex-col gap-8 py-8 md:py-12 px-4 sm:px-6">
        <div className="text-center py-12">
          <p className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  // 기본 렌더링
  return (
    <div className="flex flex-col gap-8 py-8 md:py-12">
      {/* 제목 섹션 */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-4 sm:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter text-slate-900 dark:text-slate-50">
            Dream Dictionary
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal max-w-xl">
            Search our comprehensive dictionary to uncover the psychological and symbolic meanings behind your dreams.
          </p>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-4">
        {/* 알파벳 필터 */}
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Filter by Letter:</p>
          <div className="flex gap-1.5 flex-wrap">
            {ALPHABET.slice(0, 4).map((letter) => (
              <Button
                key={letter}
                variant={selectedLetter === letter ? 'default' : 'ghost'}
                size="sm"
                className={`h-8 w-8 shrink-0 ${
                  selectedLetter === letter 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
                onClick={() => {
                  setSelectedLetter(letter);
                  setPage(1);
                }}
              >
                {letter === 'All' ? 'All' : letter === '...' ? '...' : letter}
              </Button>
            ))}
            <span className="text-slate-400 dark:text-slate-500 py-2">...</span>
            {ALPHABET.slice(-1).map((letter) => (
              <Button
                key={letter}
                variant={selectedLetter === letter ? 'default' : 'ghost'}
                size="sm"
                className={`h-8 w-8 shrink-0 ${
                  selectedLetter === letter 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
                onClick={() => {
                  setSelectedLetter(letter);
                  setPage(1);
                }}
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>

        {/* 정렬 및 카테고리 */}
        <div className="flex items-center gap-4 flex-wrap">
          <Select value={sortBy} onValueChange={(value: 'popularity' | 'name') => setSortBy(value)}>
            <SelectTrigger className="w-40 bg-card border border-slate-200 dark:border-slate-800 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <SelectValue>
                {sortBy === 'popularity' ? 'Sort by Popularity' : 'Sort by Alphabetical'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Sort by Popularity</SelectItem>
              <SelectItem value="name">Sort by Alphabetical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={(value) => {
            setSelectedCategory(value);
            setPage(1);
          }}>
            <SelectTrigger className="w-40 bg-card border border-slate-200 dark:border-slate-800 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
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
      </div>

      {/* 카드 그리드 */}
      <div className="px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dreams && dreams.length > 0 ? (
            <>
              {dreams.map((dream: DreamSymbol, index: number) => {
                const IconComponent = getDreamIcon(dream.name, dream.category);
                
                // 4번째 카드 위치에 광고 삽입
                if (index === 4) {
                  return (
                    <div key={`ad-${index}`}>
                      <div className="flex min-h-[250px] items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-slate-500 dark:text-slate-400">
                        <AdSlot slot="dream-dictionary-ad" />
                      </div>
                    </div>
                  );
                }
                
                return (
                  <Link key={dream.slug} href={`/dream/${dream.slug}`}>
                    <Card className="group flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
                      <IconComponent className="h-12 w-12 text-primary" />
                      <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                          {dream.name}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                          {dream.summary || dream.quick_answer}
                        </p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </>
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                No dream symbols found.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center pt-8 px-4 sm:px-6">
        <nav aria-label="Pagination" className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-md text-slate-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-gray-800"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          {paginationPages.map((pageNum, idx) => (
            pageNum === '...' ? (
              <span key={`ellipsis-${idx}`} className="text-slate-500 dark:text-slate-400 px-2">
                ...
              </span>
            ) : (
              <Button
                key={pageNum}
                variant={page === pageNum ? 'default' : 'ghost'}
                size="icon"
                className={`h-10 w-10 rounded-md font-medium text-sm ${
                  page === pageNum
                    ? 'bg-primary/20 text-primary'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
                onClick={() => setPage(pageNum as number)}
              >
                {pageNum}
              </Button>
            )
          ))}
          
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-md text-slate-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-gray-800"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </div>
  );
}
