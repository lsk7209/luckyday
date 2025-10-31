/**
 * 관련 콘텐츠 컴포넌트
 * @description 관련된 콘텐츠 목록 표시
 */
import Link from 'next/link';
import { FileText, BookOpen, Calculator, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RelatedItem {
  slug: string;
  title: string;
  type: 'blog' | 'guide' | 'utility';
  similarity?: number;
  summary?: string;
}

interface RelatedContentProps {
  items: RelatedItem[];
  title?: string;
  className?: string;
}

/**
 * RelatedContent: 관련 콘텐츠 목록 표시 컴포넌트
 */
export default function RelatedContent({
  items,
  title = '관련 콘텐츠',
  className = '',
}: RelatedContentProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    switch (type) {
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'blog':
        return '블로그';
      case 'guide':
        return '가이드';
      case 'utility':
        return '계산기';
      default:
        return type;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {getTypeLabel(item.type)}
                  </Badge>
                  {item.similarity && (
                    <span className="text-xs text-muted-foreground">
                      유사도: {(item.similarity * 100).toFixed(0)}%
                    </span>
                  )}
                </div>

                <Link
                  href={`/${item.type}/${item.slug}`}
                  className="block hover:text-primary transition-colors"
                >
                  <h3 className="font-medium line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                </Link>

                {item.summary && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.summary}
                  </p>
                )}
              </div>

              <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                <Link href={`/${item.type}/${item.slug}`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link href={`/${items[0]?.type}`}>
              더 많은 {getTypeLabel(items[0]?.type || '')} 보기
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
