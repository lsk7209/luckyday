/**
 * SEO 관리 메인 페이지
 * @description SEO 도구 및 색인 관리 개요
 */
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Search,
  FileText,
  Globe,
  Target,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';

// 임시 데이터 - 실제로는 API에서 가져올 예정
const seoStats = {
  indexed: 78,
  pending: 5,
  failed: 2,
  sitemapLastUpdated: new Date('2024-01-15T10:30:00'),
  lastIndexCheck: new Date('2024-01-15T09:45:00'),
  totalPages: 85,
  averageScore: 87,
};

const recentIndexSubmissions = [
  {
    url: '/blog/salary-negotiation-guide',
    provider: 'google',
    status: 'indexed',
    submittedAt: '2024-01-15T08:30:00',
    indexedAt: '2024-01-15T10:15:00',
  },
  {
    url: '/utility/salary-calculator',
    provider: 'bing',
    status: 'indexed',
    submittedAt: '2024-01-15T08:30:00',
    indexedAt: '2024-01-15T09:45:00',
  },
  {
    url: '/guide/tax-filing-guide',
    provider: 'google',
    status: 'pending',
    submittedAt: '2024-01-15T08:30:00',
    indexedAt: null,
  },
  {
    url: '/blog/health-tips',
    provider: 'google',
    status: 'failed',
    submittedAt: '2024-01-14T16:20:00',
    indexedAt: null,
    errorMessage: 'Server error (5xx)',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'indexed':
      return <Badge className="bg-green-500">색인됨</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-500">대기중</Badge>;
    case 'failed':
      return <Badge className="bg-red-500">실패</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getProviderName = (provider: string) => {
  switch (provider) {
    case 'google':
      return 'Google';
    case 'bing':
      return 'Bing';
    case 'naver':
      return 'Naver';
    case 'indexnow':
      return 'IndexNow';
    default:
      return provider;
  }
};

export default function SEOManagement() {
  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">SEO & 색인 관리</h1>
        <p className="text-muted-foreground">
          검색 엔진 최적화 및 자동 색인 관리 도구
        </p>
      </div>

      {/* SEO 개요 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">색인된 페이지</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seoStats.indexed}</div>
            <p className="text-xs text-muted-foreground">
              총 {seoStats.totalPages}페이지 중
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">대기 중</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seoStats.pending}</div>
            <p className="text-xs text-muted-foreground">
              색인 요청 대기
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">실패</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seoStats.failed}</div>
            <p className="text-xs text-muted-foreground">
              재시도 필요
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 점수</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{seoStats.averageScore}</div>
            <p className="text-xs text-muted-foreground">
              SEO 품질 점수
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 빠른 액션 */}
        <Card>
          <CardHeader>
            <CardTitle>빠른 액션</CardTitle>
            <CardDescription>
              자주 사용하는 SEO 작업들
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" asChild>
              <Link href="/admin/seo/indexing">
                <Target className="mr-2 h-4 w-4" />
                색인 요청
              </Link>
            </Button>

            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/seo/sitemaps">
                <FileText className="mr-2 h-4 w-4" />
                사이트맵 관리
              </Link>
            </Button>

            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/seo/meta">
                <Search className="mr-2 h-4 w-4" />
                메타 태그 관리
              </Link>
            </Button>

            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/seo/canonical">
                <Globe className="mr-2 h-4 w-4" />
                캐노니컬 관리
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* 최근 색인 제출 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>최근 색인 제출</CardTitle>
            <CardDescription>
              검색 엔진에 제출된 URL들의 상태
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIndexSubmissions.map((submission, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm font-medium">{submission.url}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{getProviderName(submission.provider)}</span>
                        <span>•</span>
                        <span>{new Date(submission.submittedAt).toLocaleString('ko-KR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(submission.status)}
                    {submission.indexedAt && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(submission.indexedAt).toLocaleString('ko-KR')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                마지막 확인: {seoStats.lastIndexCheck.toLocaleString('ko-KR')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO 도구 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Search className="h-8 w-8 mx-auto text-blue-500" />
            <CardTitle className="text-lg">메타 태그</CardTitle>
            <CardDescription>
              SEO 메타 태그 및 구조화 데이터 관리
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/seo/meta">관리하기</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <FileText className="h-8 w-8 mx-auto text-green-500" />
            <CardTitle className="text-lg">사이트맵</CardTitle>
            <CardDescription>
              XML 사이트맵 생성 및 관리
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/seo/sitemaps">관리하기</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Target className="h-8 w-8 mx-auto text-orange-500" />
            <CardTitle className="text-lg">색인 현황</CardTitle>
            <CardDescription>
              검색 엔진 색인 상태 모니터링
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/seo/indexing">관리하기</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <Globe className="h-8 w-8 mx-auto text-purple-500" />
            <CardTitle className="text-lg">캐노니컬</CardTitle>
            <CardDescription>
              중복 URL 캐노니컬 태그 관리
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/seo/canonical">관리하기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* SEO 상태 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>SEO 건강 상태</span>
          </CardTitle>
          <CardDescription>
            사이트의 검색 엔진 최적화 현황 요약
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {Math.round((seoStats.indexed / seoStats.totalPages) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">색인율</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {seoStats.averageScore}
              </div>
              <p className="text-sm text-muted-foreground">평균 SEO 점수</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {seoStats.pending + seoStats.failed}
              </div>
              <p className="text-sm text-muted-foreground">주의 필요</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
