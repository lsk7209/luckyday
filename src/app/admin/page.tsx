/**
 * DreamScope 관리자 대시보드
 * @description 꿈 해몽 서비스 주요 메트릭 및 관리 개요
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Moon,
  Sparkles,
  Brain,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Database,
  Zap,
  PieChart,
  Activity,
  Target,
} from 'lucide-react';

// 최근 활동 데이터
const recentActivityData = [
  {
    type: 'dream_added',
    message: '새 꿈 심볼 "용 꿈" 추가됨',
    time: '1시간 전',
    status: 'success',
  },
  {
    type: 'ai_interpretation',
    message: 'AI 해몽 45회 수행됨',
    time: '2시간 전',
    status: 'success',
  },
  {
    type: 'seo_indexed',
    message: '꿈 페이지 12개 색인됨',
    time: '4시간 전',
    status: 'success',
  },
  {
    type: 'user_search',
    message: '"뱀 꿈" 검색 급증 (+23%)',
    time: '6시간 전',
    status: 'info',
  },
  {
    type: 'content_updated',
    message: '인기 꿈 심볼 순위 업데이트됨',
    time: '1일 전',
    status: 'success',
  },
];

// 임시 데이터 - 실제로는 API에서 가져올 예정
const metrics = {
  overview: {
    totalUsers: 8750,
    totalSessions: 12400,
    pageViews: 28300,
    avgSessionDuration: 245, // 초
    bounceRate: 28.5,
    aiInterpretations: 3450,
  },
  dreams: {
    totalDreamSymbols: 1250,
    publishedDreams: 1180,
    categoriesCount: 8,
    avgPopularity: 1250,
  },
  ai: {
    totalInterpretations: 3450,
    avgResponseTime: 2.3, // 초
    successRate: 98.7,
    popularEmotions: ['불안', '평온', '공포', '기쁨'],
  },
  seo: {
    indexedPages: 450,
    pagesInQueue: 12,
    brokenLinks: 2,
  },
  analytics: {
    topSearchedDreams: [
      { name: '뱀 꿈', searches: 1250, trend: 'up' },
      { name: '이빨 꿈', searches: 980, trend: 'up' },
      { name: '물 꿈', searches: 750, trend: 'stable' },
      { name: '하늘 꿈', searches: 620, trend: 'down' },
      { name: '집 꿈', searches: 580, trend: 'up' },
    ],
    userDemographics: {
      ageGroups: [
        { range: '18-24', percentage: 25.5 },
        { range: '25-34', percentage: 35.2 },
        { range: '35-44', percentage: 22.1 },
        { range: '45-54', percentage: 12.8 },
        { range: '55+', percentage: 4.4 },
      ],
      devices: [
        { type: '모바일', percentage: 68.5 },
        { type: '데스크톱', percentage: 25.3 },
        { type: '태블릿', percentage: 6.2 },
      ],
    },
    userBehavior: {
      avgTimeOnPage: 185, // 초
      returnVisitorRate: 42.3,
      bookmarkRate: 15.7,
      shareRate: 8.2,
    },
    searchPatterns: {
      commonQueries: [
        '무서운 꿈',
        '결혼 꿈',
        '시험 꿈',
        '돈 꿈',
        '죽음 꿈',
      ],
      peakHours: [
        { hour: '22:00-24:00', searches: 1450 },
        { hour: '18:00-22:00', searches: 1200 },
        { hour: '06:00-10:00', searches: 980 },
      ],
    },
  },
    sitemapLastUpdated: new Date('2024-01-31T08:30:00'),
  },
  recentActivity: recentActivityData,
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <BarChart3 className="mr-2 h-8 w-8" />
          DreamScope 관리자
        </h1>
        <p className="text-muted-foreground">
          꿈 해몽 서비스 운영 현황 및 주요 메트릭을 확인하세요.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="content">콘텐츠 관리</TabsTrigger>
          <TabsTrigger value="analytics">사용자 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                +15.3%
              </span>
              {' '}지난 달 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI 해몽 수</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.overview.aiInterpretations.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 inline-flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +22.1%
              </span>
              {' '}지난 달 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 체류시간</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(metrics.overview.avgSessionDuration / 60)}분 {metrics.overview.avgSessionDuration % 60}초
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 inline-flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.7%
              </span>
              {' '}지난 달 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI 성공률</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.ai.successRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 inline-flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +1.2%
              </span>
              {' '}지난 달 대비
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 꿈 데이터 현황 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Moon className="h-5 w-5" />
              <span>꿈 데이터 현황</span>
            </CardTitle>
            <CardDescription>
              꿈 심볼 데이터베이스 및 카테고리 현황
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-blue-500" />
                <span className="text-sm">총 꿈 심볼</span>
              </div>
              <Badge variant="secondary">{metrics.dreams.totalDreamSymbols}개</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">게시됨</span>
              </div>
              <Badge variant="secondary">{metrics.dreams.publishedDreams}개</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className="text-sm">카테고리</span>
              </div>
              <Badge variant="secondary">{metrics.dreams.categoriesCount}개</Badge>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span>평균 인기도</span>
                <span className="font-medium">{metrics.dreams.avgPopularity.toLocaleString()}</span>
              </div>
            </div>

            <Button size="sm" className="w-full">
              꿈 데이터 관리
            </Button>
          </CardContent>
        </Card>

        {/* AI 현황 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI 성능 모니터링</span>
            </CardTitle>
            <CardDescription>
              AI 해몽 서비스 실시간 성능 지표 및 품질 모니터링
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">총 해몽 수</span>
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{metrics.ai.totalInterpretations.toLocaleString()}회</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">평균 응답시간</span>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{metrics.ai.avgResponseTime}초</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">성공률</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{metrics.ai.successRate}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">사용자 만족도</span>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">4.8/5.0</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground mb-2">인기 감정 키워드</div>
              <div className="flex flex-wrap gap-1">
                {metrics.ai.popularEmotions.map((emotion) => (
                  <Badge key={emotion} variant="outline" className="text-xs">
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground mb-3">AI 성능 상태</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">응답 속도</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    양호
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">정확도</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    개선중
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">사용률</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    상승
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground mb-2">최근 AI 성능 로그</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>• 응답 시간 최적화 완료</span>
                  <span>2시간 전</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>• 감정 분석 모델 업데이트</span>
                  <span>1일 전</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>• 새로운 꿈 패턴 학습</span>
                  <span>3일 전</span>
                </div>
              </div>
            </div>

            <Button size="sm" className="w-full" variant="outline">
              상세 AI 모니터링
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
              <Moon className="h-5 w-5" />
              <span className="text-sm">꿈 데이터 추가</span>
            </Button>

            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Brain className="h-5 w-5" />
              <span className="text-sm">AI 성능 모니터링</span>
            </Button>

            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Search className="h-5 w-5" />
              <span className="text-sm">SEO 색인 상태</span>
            </Button>

            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">사용자 분석</span>
            </Button>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>콘텐츠 관리</CardTitle>
              <CardDescription>
                꿈 데이터 CRUD 관리 및 콘텐츠 현황
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Moon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">콘텐츠 관리</h3>
                <p className="text-muted-foreground mb-4">
                  꿈 데이터 추가, 수정, 삭제 및 관리 기능을 제공합니다.
                </p>
                <Button asChild>
                  <a href="/admin/content">
                    콘텐츠 관리 페이지로 이동
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* 사용자 분석 메트릭 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">평균 체류시간</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(metrics.analytics.userBehavior.avgTimeOnPage / 60)}분 {metrics.analytics.userBehavior.avgTimeOnPage % 60}초
                </div>
                <p className="text-xs text-muted-foreground">
                  페이지당 평균 체류시간
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">재방문율</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.analytics.userBehavior.returnVisitorRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  재방문 사용자 비율
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">북마크율</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.analytics.userBehavior.bookmarkRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  꿈 해석 북마크 비율
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">공유율</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.analytics.userBehavior.shareRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  콘텐츠 공유 비율
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 인기 검색어 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>인기 검색 꿈</span>
                </CardTitle>
                <CardDescription>
                  가장 많이 검색된 꿈 심볼 순위
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.analytics.topSearchedDreams.map((dream, index) => (
                    <div key={dream.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          {index + 1}
                        </span>
                        <span className="font-medium">{dream.name}</span>
                        {dream.trend === 'up' && (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        )}
                        {dream.trend === 'down' && (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        {dream.trend === 'stable' && (
                          <div className="h-4 w-4 border-t-2 border-gray-400" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {dream.searches.toLocaleString()}회
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 사용자 연령대 분포 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>사용자 연령대</span>
                </CardTitle>
                <CardDescription>
                  방문자 연령대별 분포
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.analytics.userDemographics.ageGroups.map((group) => (
                    <div key={group.range} className="flex items-center justify-between">
                      <span className="font-medium">{group.range}세</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${group.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-10">
                          {group.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 기기별 사용 현황 */}
            <Card>
              <CardHeader>
                <CardTitle>기기별 사용 현황</CardTitle>
                <CardDescription>
                  모바일/데스크톱/태블릿 사용 비율
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.analytics.userDemographics.devices.map((device) => (
                    <div key={device.type} className="flex items-center justify-between">
                      <span className="font-medium">{device.type}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${device.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-10">
                          {device.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 검색 패턴 */}
            <Card>
              <CardHeader>
                <CardTitle>검색 패턴 분석</CardTitle>
                <CardDescription>
                  시간대별 검색량 및 인기 검색어
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">피크 타임</h4>
                    <div className="space-y-2">
                      {metrics.analytics.searchPatterns.peakHours.map((peak) => (
                        <div key={peak.hour} className="flex items-center justify-between text-sm">
                          <span>{peak.hour}</span>
                          <span className="text-muted-foreground">
                            {peak.searches.toLocaleString()}회
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">인기 검색어</h4>
                    <div className="flex flex-wrap gap-2">
                      {metrics.analytics.searchPatterns.commonQueries.map((query) => (
                        <Badge key={query} variant="outline">
                          {query}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
