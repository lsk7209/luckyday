/**
 * SearchBox 컴포넌트
 * @description 검색 입력창 컴포넌트
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { dreamDb } from '@/lib/supabase-client';
import { SearchResult } from '@/types/dream';

interface SearchBoxProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
}

export default function SearchBox({
  placeholder = "꿈에 나온 것을 검색하세요...",
  className = "",
  autoFocus = false,
  onSearch
}: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 자동완성 검색
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: () => query.length >= 2 ? dreamDb.searchDreamSymbols(query, 5) : [],
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5분
  });

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        router.push(`/dream?q=${encodeURIComponent(query.trim())}`);
      }
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchResult) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    router.push(`/dream/${suggestion.slug}`);
  };

  const clearQuery = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 text-base"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // 약간의 지연을 주어 클릭 이벤트가 처리되도록 함
            setTimeout(() => setShowSuggestions(false), 200);
          }}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            onClick={clearQuery}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* 자동완성 제안 */}
      {showSuggestions && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg mt-1 z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              검색 중...
            </div>
          ) : suggestions && suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.slug}
                  className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center justify-between"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div>
                    <div className="font-medium">{suggestion.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {suggestion.category} • 인기도: {suggestion.popularity}
                    </div>
                  </div>
                </button>
              ))}
              <div className="border-t px-4 py-2">
                <button
                  className="w-full text-left text-primary hover:underline"
                  onClick={() => {
                    router.push(`/dream?q=${encodeURIComponent(query)}`);
                    setShowSuggestions(false);
                  }}
                >
                  "{query}" 전체 검색 결과 보기
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              검색 결과가 없습니다
            </div>
          )}
        </div>
      )}
    </div>
  );
}
