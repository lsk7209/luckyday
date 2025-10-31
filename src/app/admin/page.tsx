/**
 * 관리자 대시보드
 * @description CMS 주요 메트릭 및 관리 개요
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  FileText,
  Calculator,
  BookOpen,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
} from 'lucide-react';

// 임시 데이터 - 실제로는 API에서 가져올 예정
const metrics = {
  overview: {
    totalUsers: 15420,
    totalSessions: 23150,
    pageViews: 45680,
    avgSessionDuration: 185, // 초
    bounceRate: 34.2,
    conversionRate: 5.8,
  },
  content: {
    totalBlogs: 45,
    totalGuides: 28,
    totalUtilities: 12,
    publishedContent: 83,
    draftContent: 2,
  },
  seo: {
    indexedPages: 78,
    pagesInQueue: 5,
    brokenLinks: 3,
    sitemapLastUpdated: new Date('2024-01-15T10:30:00'),
  },
  recentActivity: [
    {
      type: 'content_published',
      message: '연봉 계산기 업데이트됨',
      time: '2시간 전',
      status: 'success',
    },
    {
      type: 'seo_indexed',
      message: '블로그 포스트 3개 색인됨',
      time: '4시간 전',
      status: 'success',
    },
    {
      type: 'link_broken',
      message: '깨진 링크 2개 발견됨',
      time: '6시간 전',
      status: 'warning',
    },
    {
      type: 'content_created',
      message: '새 가이드 초안 생성됨',
      time: '1일 전',
      status: 'info',
    },
  ],
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">
          CMS 운영 현황 및 주요 메트릭을 확인하세요.
        </p>
      </div>

      {/* 주요 메트릭 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.overview.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 inline-flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5%
              </span>
              {' '}지난 달 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">페이지뷰</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.overview.pageViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 inline-flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2%
              </span>
              {' '}지난 달 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">세션 시간</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(metrics.overview.avgSessionDuration / 60)}분 {metrics.overview.avgSessionDuration % 60}초
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 inline-flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.1%
              </span>
              {' '}지난 달 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전환율</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.overview.conversionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 inline-flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.1%
              </span>
              {' '}지난 달 대비
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 콘텐츠 현황 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>콘텐츠 현황</span>
            </CardTitle>
            <CardDescription>
              게시된 콘텐츠 및 상태별 현황
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm">블로그</span>
              </div>
              <Badge variant="secondary">{metrics.content.totalBlogs}개</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-green-500" />
                <span className="text-sm">가이드</span>
              </div>
              <Badge variant="secondary">{metrics.content.totalGuides}개</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="h-4 w-4 text-orange-500" />
                <span className="text-sm">계산기</span>
              </div>
              <Badge variant="secondary">{metrics.content.totalUtilities}개</Badge>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span>총 콘텐츠</span>
                <span className="font-medium">{metrics.content.publishedContent}개 게시됨</span>
              </div>
              {metrics.content.draftContent > 0 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>초안</span>
                  <span>{metrics.content.draftContent}개</span>
                </div>
              )}
            </div>

            <Button size="sm" className="w-full">
              콘텐츠 관리
            </Button>
          </CardContent>
        </Card>

        {/* SEO 현황 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>SEO 현황</span>
            </CardTitle>
            <CardDescription>
              검색엔진 색인 및 최적화 상태
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">색인된 페이지</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">{metrics.seo.indexedPages}개</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">대기 중</span>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{metrics.seo.pagesInQueue}개</span>
              </div>
            </div>

            {metrics.seo.brokenLinks > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm">깨진 링크</span>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="font-medium">{metrics.seo.brokenLinks}개</span>
                </div>
              </div>
            )}

            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground">
                사이트맵 최종 업데이트: {metrics.seo.sitemapLastUpdated.toLocaleDateString('ko-KR')}
              </div>
            </div>

            <Button size="sm" className="w-full" variant="outline">
              SEO 관리
            </Button>
          </CardContent>
        </Card>

        {/* 최근 활동 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>
              시스템 및 콘텐츠 변경 내역
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {activity.status === 'warning' && (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                    {activity.status === 'info' && (
                      <Clock className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="sm" className="w-full mt-4" variant="outline">
              전체 로그 보기
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 빠른 액션 */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 액션</CardTitle>
          <CardDescription>
            자주 사용하는 관리 기능을 바로 실행하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <FileText className="h-5 w-5" />
              <span className="text-sm">새 콘텐츠</span>
            </Button>

            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Search className="h-5 w-5" />
              <span className="text-sm">색인 요청</span>
            </Button>

            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">분석 보기</span>
            </Button>

            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Settings className="h-5 w-5" />
              <span className="text-sm">설정</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
