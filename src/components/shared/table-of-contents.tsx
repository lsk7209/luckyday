/**
 * Table of Contents 컴포넌트
 * @description 콘텐츠의 목차를 표시하는 컴포넌트
 */
'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TocItem } from '@/types/dream';

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export default function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  // 콘텐츠에서 헤딩 추출
  useEffect(() => {
    const headings = content.match(/^#{2,3} .+$/gm) || [];
    const items: TocItem[] = headings.map((heading, index) => {
      const level = heading.match(/^#+/)?.[0].length || 2;
      const text = heading.replace(/^#+\s/, '');
      const id = `heading-${index}`;

      return {
        id,
        text,
        level,
      };
    });

    setTocItems(items);
  }, [content]);

  // 스크롤 위치에 따른 활성 헤딩 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    // 헤딩 요소들에 observer 연결
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <span>목차</span>
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-1 mt-2">
          <nav className="space-y-1">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-muted ${
                  activeId === item.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                style={{
                  paddingLeft: `${(item.level - 2) * 12 + 12}px`,
                }}
              >
                {item.text}
              </button>
            ))}
          </nav>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
