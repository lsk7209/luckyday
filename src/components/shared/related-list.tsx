/**
 * Related List 컴포넌트
 * @description 관련 꿈/콘텐츠 목록을 표시
 */
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RelatedDream } from '@/types/dream';

interface RelatedListProps {
  items: RelatedDream[];
  title?: string;
  className?: string;
}

export default function RelatedList({
  items,
  title = '관련 꿈 해몽',
  className = ''
}: RelatedListProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold flex items-center space-x-2">
        <TrendingUp className="h-5 w-5" />
        <span>{title}</span>
      </h3>

      <div className="space-y-3">
        {items.map((item) => (
          <Link key={item.slug} href={`/${item.type}/${item.slug}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.type === 'dream' ? '꿈' : '시나리오'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        유사도: {Math.round(item.similarity * 100)}%
                      </span>
                    </div>

                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h4>

                    {item.summary && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {item.summary}
                      </p>
                    )}
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
