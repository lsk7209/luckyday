'use client';

/**
 * 고급 검색 컴포넌트
 * @description 자연어 검색, 자동완성, 추천 시스템을 포함한 고급 검색
 */
import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { getWorkersApiUrl } from '@/lib/workers-api-url';

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  summary: string;
  category: string;
  popularity: number;
  tags: string[];
  searchScore?: number;
}

interface AdvancedSearchProps {
  onSearch?: (query: string, results: SearchResult[]) => void;
  placeholder?: string;
  showRecommendations?: boolean;
}

export function AdvancedSearch({
  onSearch,
  placeholder = "꿈에 대해 자연어로 물어보세요 (예: 무서운 꿈, 큰 뱀 꿈)",
  showRecommendations = true
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recommendations, setRecommendations] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 검색 기록 불러오기
  useEffect(() => {
    const history = localStorage.getItem('dreamscope-search-history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // 검색 기록 저장
  const saveSearchHistory = (searchQuery: string) => {
    const updated = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
    setSearchHistory(updated);
    localStorage.setItem('dreamscope-search-history', JSON.stringify(updated));
  };

  // 자동완성 API 호출
  const fetchAutocomplete = async (input: string) => {
    if (input.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Workers API 직접 호출 (API Routes 대신 - output: 'export' 모드에서는 API Routes가 작동하지 않음)
      const WORKERS_API_URL = getWorkersApiUrl();
      const response = await fetch(`${WORKERS_API_URL}/api/dream/search?q=${encodeURIComponent(input)}&limit=5&autocomplete=true`);
      const data = await response.json();

      if (data.success) {
        setSuggestions(data.suggestions || []);
        setShowSuggestions(data.suggestions.length > 0);
      }
    } catch (error) {
      console.error('Autocomplete error:', error);
    }
  };

  // 검색 API 호출
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setRecommendations([]);
      return;
    }

    setIsLoading(true);
    try {
      // Workers API 직접 호출 (API Routes 대신 - output: 'export' 모드에서는 API Routes가 작동하지 않음)
      const WORKERS_API_URL = getWorkersApiUrl();
      const response = await fetch(`${WORKERS_API_URL}/api/dream/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.results || []);
        setRecommendations(data.recommendations || []);
        saveSearchHistory(searchQuery);

        if (onSearch) {
          onSearch(searchQuery, data.results || []);
        }

        // 검색 결과 토스트
        if (data.results.length > 0) {
          toast({
            title: `"${searchQuery}" 검색 결과`,
            description: `${data.results.length}개의 꿈 해석을 찾았습니다.`,
          });
        }
      } else {
        toast({
          title: "검색 오류",
          description: data.error || "검색 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "검색 오류",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowSuggestions(false);
    }
  };

  // 실시간 자동완성
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAutocomplete(query);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
    performSearch(historyItem);
  };

  return (
    <div className="space-y-6">
      {/* 검색 폼 */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-20 text-lg"
                autoComplete="off"
              />
              <Button
                type="submit"
                disabled={isLoading || query.length < 2}
                className="absolute right-1 top-1/2 -translate-y-1/2"
                size="sm"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                검색
              </Button>
            </div>

            {/* 자동완성/검색 기록 드롭다운 */}
            {(showSuggestions || (query.length === 0 && searchHistory.length > 0)) && (
              <Card className="absolute z-50 w-full mt-1 max-h-64 overflow-y-auto">
                <CardContent className="p-2">
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                        추천 검색어
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <span>{suggestion}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {query.length === 0 && searchHistory.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                        최근 검색
                      </div>
                      {searchHistory.slice(0, 5).map((history, index) => (
                        <button
                          key={index}
                          onClick={() => handleHistoryClick(history)}
                          className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{history}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </form>
        </CardContent>
      </Card>

      {/* 검색 결과 */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              검색 결과 ({results.length}개)
            </h2>
            {results[0]?.searchScore && (
              <Badge variant="secondary">
                검색 점수: {Math.round(results[0].searchScore)}점
              </Badge>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((dream) => (
              <Card key={dream.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{dream.category}</Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>{dream.popularity}</span>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">
                    <Link href={`/dream/${dream.slug}`} className="hover:underline">
                      {dream.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {dream.summary}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {dream.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" className="w-full" asChild>
                    <Link href={`/dream/${dream.slug}`}>
                      자세히 보기
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 추천 결과 */}
      {showRecommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              추천 꿈 해석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((dream) => (
                <div key={dream.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/dream/${dream.slug}`}
                      className="font-medium hover:underline line-clamp-1"
                    >
                      {dream.name}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {dream.summary}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {dream.category}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 검색 팁 */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">💡 고급 검색 팁</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">자연어 검색</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• "무서운 꿈" → 공포, 두려움 관련 꿈</li>
                <li>• "큰 뱀 꿈" → 큰 뱀, 보아 관련 꿈</li>
                <li>• "화난 꿈" → 분노, 짜증 관련 꿈</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">키워드 검색</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 동물 이름: 뱀, 고양이, 개, 새</li>
                <li>• 감정: 기쁨, 슬픔, 불안, 화남</li>
                <li>• 상황: 결혼, 시험, 돈, 질병</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
