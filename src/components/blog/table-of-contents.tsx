/**
 * 목차 컴포넌트
 * @description 블로그 포스트의 목차 표시
 */
'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

/**
 * TableOfContents: 블로그 포스트의 목차를 자동 생성
 */
export default function TableOfContents({ content, className = '' }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(true);

  // 콘텐츠에서 헤딩 추출
  useEffect(() => {
    const headingRegex = /^#{2,3}\s+(.+)$/gm;
    const headings: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[0].startsWith('###') ? 3 : 2;
      const text = match[1].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      headings.push({
        id,
        text,
        level,
      });
    }

    // 계층 구조 생성 (H2 아래 H3들 그룹화)
    const structuredToc: TocItem[] = [];
    let currentH2: TocItem | null = null;

    headings.forEach((heading) => {
      if (heading.level === 2) {
        currentH2 = { ...heading, children: [] };
        structuredToc.push(currentH2);
      } else if (heading.level === 3 && currentH2) {
        currentH2.children!.push(heading);
      }
    });

    setTocItems(structuredToc);
  }, [content]);

  // 스크롤 시 활성 헤딩 추적
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);

      item.children?.forEach((child) => {
        const childElement = document.getElementById(child.id);
        if (childElement) observer.observe(childElement);
      });
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (tocItems.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <List className="h-5 w-5" />
            <span>목차</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <nav>
            <ul className="space-y-1">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToHeading(item.id)}
                    className={`block w-full text-left py-1 px-2 rounded text-sm hover:bg-muted transition-colors ${
                      activeId === item.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.text}
                  </button>

                  {item.children && item.children.length > 0 && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <button
                            onClick={() => scrollToHeading(child.id)}
                            className={`block w-full text-left py-1 px-2 rounded text-xs hover:bg-muted transition-colors ${
                              activeId === child.id
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {child.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </CardContent>
      )}
    </Card>
  );
}
