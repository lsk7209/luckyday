'use client';

/**
 * 북마크 기능 컴포넌트
 * 꿈 심볼 북마크 추가/제거 기능
 */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  dreamSlug: string;
  dreamName: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
}

export function BookmarkButton({
  dreamSlug,
  dreamName,
  className,
  size = 'default',
  showText = false
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 북마크 상태 초기화 (localStorage에서 불러오기)
  useEffect(() => {
    const bookmarks = getBookmarksFromStorage();
    setIsBookmarked(bookmarks.includes(dreamSlug));
  }, [dreamSlug]);

  const getBookmarksFromStorage = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('dreamscope-bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveBookmarksToStorage = (bookmarks: string[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('dreamscope-bookmarks', JSON.stringify(bookmarks));
    } catch (error) {
      console.error('북마크 저장 실패:', error);
    }
  };

  const handleBookmarkToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const currentBookmarks = getBookmarksFromStorage();

    try {
      if (isBookmarked) {
        // 북마크 제거
        const newBookmarks = currentBookmarks.filter(slug => slug !== dreamSlug);
        saveBookmarksToStorage(newBookmarks);
        setIsBookmarked(false);

        console.log(`북마크 제거됨: "${dreamName}" 꿈이 북마크에서 제거되었습니다.`);
      } else {
        // 북마크 추가
        const newBookmarks = [...currentBookmarks, dreamSlug];
        saveBookmarksToStorage(newBookmarks);
        setIsBookmarked(true);

        console.log(`북마크 추가됨: "${dreamName}" 꿈이 북마크에 추가되었습니다.`);
      }
    } catch (error) {
      console.error('북마크 토글 실패:', error);
      console.error("북마크 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleBookmarkToggle}
      disabled={isLoading}
      className={cn(
        "transition-colors",
        isBookmarked && "text-yellow-600 hover:text-yellow-700",
        className
      )}
      title={isBookmarked ? "북마크 제거" : "북마크 추가"}
    >
      {isBookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {showText && (
        <span className="ml-2">
          {isBookmarked ? "북마크됨" : "북마크"}
        </span>
      )}
    </Button>
  );
}

// 북마크 목록 가져오기 훅
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const getBookmarks = () => {
      if (typeof window === 'undefined') return [];
      try {
        const stored = localStorage.getItem('dreamscope-bookmarks');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    };

    setBookmarks(getBookmarks());

    // storage 이벤트 리스너 (다른 탭에서의 변경 감지)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dreamscope-bookmarks') {
        setBookmarks(getBookmarks());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addBookmark = (slug: string) => {
    setBookmarks(prev => {
      const newBookmarks = [...new Set([...prev, slug])];
      localStorage.setItem('dreamscope-bookmarks', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  const removeBookmark = (slug: string) => {
    setBookmarks(prev => {
      const newBookmarks = prev.filter(s => s !== slug);
      localStorage.setItem('dreamscope-bookmarks', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  const toggleBookmark = (slug: string) => {
    if (bookmarks.includes(slug)) {
      removeBookmark(slug);
    } else {
      addBookmark(slug);
    }
  };

  const isBookmarked = (slug: string) => bookmarks.includes(slug);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
  };
}

// 북마크된 꿈 목록 컴포넌트
export function BookmarkedDreamsList() {
  const { bookmarks } = useBookmarks();
  const [dreams, setDreams] = useState<any[]>([]);

  useEffect(() => {
    // 실제로는 API에서 북마크된 꿈 데이터를 가져와야 함
    // 여기서는 임시로 mock 데이터 사용
    const mockDreams = [
      {
        id: '1',
        slug: 'baem-snake-dream',
        name: '뱀 꿈',
        category: 'animal',
        summary: '뱀 꿈은 변화와 갱신의 신호입니다.',
        popularity: 1250,
      },
      {
        id: '2',
        slug: 'tooth-loss-dream',
        name: '이빨 꿈',
        category: 'body',
        summary: '이빨 꿈은 변화, 불안, 자기표현의 신호입니다.',
        popularity: 980,
      },
    ];

    const bookmarkedDreams = mockDreams.filter(dream =>
      bookmarks.includes(dream.slug)
    );

    setDreams(bookmarkedDreams);
  }, [bookmarks]);

  if (dreams.length === 0) {
    return (
      <div className="text-center py-12">
        <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">북마크된 꿈이 없습니다</h3>
        <p className="text-muted-foreground">
          관심 있는 꿈을 북마크해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dreams.map((dream) => (
        <div key={dream.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium">{dream.name}</h4>
            <p className="text-sm text-muted-foreground">{dream.summary}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs bg-secondary px-2 py-1 rounded">
                {dream.category}
              </span>
              <span className="text-xs text-muted-foreground">
                조회수: {dream.popularity.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <BookmarkButton
              dreamSlug={dream.slug}
              dreamName={dream.name}
              size="sm"
            />
            <Button variant="outline" size="sm" asChild>
              <a href={`/dream/${dream.slug}`}>
                보기
              </a>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
