/**
 * 콘텐츠 관리 메인 페이지
 * @description 모든 콘텐츠 타입의 목록 및 관리 인터페이스
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  BookOpen,
  Calculator,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 임시 데이터 - 실제로는 API에서 가져올 예정
const contentData = {
  blog: [
    {
      id: '1',
      title: '연봉 협상 시 고려해야 할 5가지 포인트',
      slug: 'salary-negotiation-guide',
      status: 'published',
      author: 'CMS Team',
      publishedAt: '2024-01-15',
      views: 1250,
      readingTime: 8,
      tags: ['연봉', '협상'],
    },
    {
      id: '2',
      title: '건강한 체중 유지하기: BMI와 칼로리 계산',
      slug: 'healthy-weight-maintenance',
      status: 'published',
      author: 'CMS Team',
      publishedAt: '2024-01-10',
      views: 890,
      readingTime: 7,
      tags: ['건강', '체중'],
    },
  ],
  guide: [
    {
      id: '1',
      title: '개인所得税 신고 가이드',
      slug: 'tax-filing-guide',
      status: 'published',
      author: 'CMS Team',
      publishedAt: '2024-01-08',
      views: 2100,
      duration: 145,
      level: '중급',
    },
  ],
  utility: [
    {
      id: '1',
      title: '연봉 계산기',
      slug: 'salary-calculator',
      status: 'published',
      author: 'CMS Team',
      publishedAt: '2024-01-01',
      views: 4560,
      category: '금융',
      version: '2.1.0',
    },
    {
      id: '2',
      title: 'BMI 계산기',
      slug: 'bmi-calculator',
      status: 'draft',
      author: 'CMS Team',
      publishedAt: null,
      views: 0,
      category: '건강',
      version: '1.0.0',
    },
  ],
};

export default function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">게시됨</Badge>;
      case 'draft':
        return <Badge variant="secondary">초안</Badge>;
      case 'archived':
        return <Badge variant="outline">보관됨</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getContentIcon = (type: string) => {
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

  const renderContentList = (type: string, items: any[]) => (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getContentIcon(type)}
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>작성자: {item.author}</span>
                    {item.publishedAt && (
                      <>
                        <span>•</span>
                        <span>게시일: {item.publishedAt}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>조회수: {item.views.toLocaleString()}</span>
                    {type === 'blog' && item.readingTime && (
                      <>
                        <span>•</span>
                        <span>{item.readingTime}분 읽기</span>
                      </>
                    )}
                    {type === 'guide' && item.duration && (
                      <>
                        <span>•</span>
                        <span>{Math.floor(item.duration / 60)}시간 {item.duration % 60}분</span>
                      </>
                    )}
                    {type === 'utility' && item.version && (
                      <>
                        <span>•</span>
                        <span>v{item.version}</span>
                      </>
                    )}
                  </div>
                  {item.tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {getStatusBadge(item.status)}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/${type}/${item.slug}`} className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        미리보기
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/content/${type}/edit/${item.id}`} className="flex items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        편집
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">콘텐츠 관리</h1>
          <p className="text-muted-foreground">
            블로그, 가이드, 계산기 콘텐츠를 관리하세요.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="콘텐츠 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                새 콘텐츠
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/admin/content/blog/new">
                  <FileText className="mr-2 h-4 w-4" />
                  블로그 포스트
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/content/guide/new">
                  <BookOpen className="mr-2 h-4 w-4" />
                  가이드
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/content/utility/new">
                  <Calculator className="mr-2 h-4 w-4" />
                  계산기
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 콘텐츠 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">전체 ({Object.values(contentData).flat().length})</TabsTrigger>
          <TabsTrigger value="blog">블로그 ({contentData.blog.length})</TabsTrigger>
          <TabsTrigger value="guide">가이드 ({contentData.guide.length})</TabsTrigger>
          <TabsTrigger value="utility">계산기 ({contentData.utility.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>블로그 포스트</CardTitle>
              <CardDescription>최신 블로그 포스트 목록</CardDescription>
            </CardHeader>
            <CardContent>
              {renderContentList('blog', contentData.blog)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>가이드</CardTitle>
              <CardDescription>사용자 가이드 목록</CardDescription>
            </CardHeader>
            <CardContent>
              {renderContentList('guide', contentData.guide)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>계산기</CardTitle>
              <CardDescription>계산기 도구 목록</CardDescription>
            </CardHeader>
            <CardContent>
              {renderContentList('utility', contentData.utility)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle>블로그 포스트</CardTitle>
              <CardDescription>블로그 포스트 관리</CardDescription>
            </CardHeader>
            <CardContent>
              {renderContentList('blog', contentData.blog)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>가이드</CardTitle>
              <CardDescription>가이드 관리</CardDescription>
            </CardHeader>
            <CardContent>
              {renderContentList('guide', contentData.guide)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utility">
          <Card>
            <CardHeader>
              <CardTitle>계산기</CardTitle>
              <CardDescription>계산기 도구 관리</CardDescription>
            </CardHeader>
            <CardContent>
              {renderContentList('utility', contentData.utility)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
