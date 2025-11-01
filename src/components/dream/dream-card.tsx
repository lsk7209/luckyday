/**
 * DreamCard 컴포넌트
 * @description 꿈 심볼을 표시하는 카드 컴포넌트
 */
import Link from 'next/link';
import { TrendingUp, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookmarkButton } from '@/components/bookmark';
import { DreamCardProps } from '@/types/dream';

export default function DreamCard({ dream, href }: DreamCardProps) {
  const cardHref = href || `/dream/${dream.slug}`;

  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {dream.category}
          </Badge>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>{dream.popularity}</span>
          </div>
        </div>
        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={cardHref} className="hover:underline">
            {dream.name}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {dream.summary}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-1 mb-4">
          {dream.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
          {dream.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{dream.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex space-x-2">
          <Button size="sm" className="flex-1" asChild>
            <Link href={cardHref}>해몽 보기</Link>
          </Button>
          <BookmarkButton
            dreamSlug={dream.slug}
            dreamName={dream.name}
            size="sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
