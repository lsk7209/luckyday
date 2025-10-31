/**
 * 색인 현황 관리 페이지
 * @description 검색 엔진 색인 상태 모니터링 및 수동 제출
 */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Target,
  Search,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

// 임시 데이터 - 실제로는 API에서 가져올 예정
const indexingData = [
  {
    url: '/blog/salary-negotiation-guide',
    title: '연봉 협상 시 고려해야 할 5가지 포인트',
    googleStatus: 'indexed',
    googleLastChecked: '2024-01-15T10:30:00',
    googleCoverage: 'Included',
    bingStatus: 'indexed',
    bingLastChecked: '2024-01-15T09:45:00',
    naverStatus: 'indexed',
    naverLastChecked: '2024-01-15T08:30:00',
    indexNowStatus: 'submitted',
    lastSubmitted: '2024-01-15T08:30:00',
  },
  {
    url: '/utility/salary-calculator',
    title: '연봉 계산기',
    googleStatus: 'indexed',
    googleLastChecked: '2024-01-15T10:15:00',
    googleCoverage: 'Included',
    bingStatus: 'indexed',
    bingLastChecked: '2024-01-15T09:30:00',
    naverStatus: 'pending',
    naverLastChecked: '2024-01-15T08:15:00',
    indexNowStatus: 'indexed',
    lastSubmitted: '2024-01-15T08:15:00',
  },
  {
    url: '/guide/tax-filing-guide',
    title: '개인所得税 신고 가이드',
    googleStatus: 'pending',
    googleLastChecked: '2024-01-15T10:00:00',
    googleCoverage: 'Pending',
    bingStatus: 'not_submitted',
    bingLastChecked: null,
    naverStatus: 'not_submitted',
    naverLastChecked: null,
    indexNowStatus: 'not_submitted',
    lastSubmitted: null,
  },
  {
    url: '/blog/recent-article',
    title: '최신 블로그 포스트',
    googleStatus: 'failed',
    googleLastChecked: '2024-01-14T16:20:00',
    googleCoverage: 'Excluded',
    bingStatus: 'failed',
    bingLastChecked: '2024-01-14T16:20:00',
    naverStatus: 'failed',
    naverLastChecked: '2024-01-14T16:20:00',
    indexNowStatus: 'failed',
    lastSubmitted: '2024-01-14T16:20:00',
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
    case 'not_submitted':
      return <Badge variant="outline">미제출</Badge>;
    case 'submitted':
      return <Badge className="bg-blue-500">제출됨</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'indexed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-500" />;
  }
};

export default function IndexingManagement() {
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [manualUrl, setManualUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitToIndex = async (provider: string) => {
    if (selectedUrls.length === 0 && !manualUrl) return;

    setIsSubmitting(true);

    const urls = manualUrl ? [manualUrl] : selectedUrls;

    try {
      // TODO: 실제 색인 제출 API 호출
      console.log(`Submitting ${urls.length} URLs to ${provider}`);

      // 임시로 2초 기다린 후 성공 처리
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert(`${urls.length}개의 URL을 ${provider}에 제출했습니다.`);
      setSelectedUrls([]);
      setManualUrl('');
    } catch (error) {
      console.error('Index submission error:', error);
      alert('색인 제출에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSubmit = async (provider: string) => {
    const urls = indexingData
      .filter(item => item[`${provider}Status`] !== 'indexed')
      .map(item => item.url);

    if (urls.length === 0) {
      alert('제출할 URL이 없습니다.');
      return;
    }

    setSelectedUrls(urls);
    await handleSubmitToIndex(provider);
  };

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">색인 현황</h1>
        <p className="text-muted-foreground">
          검색 엔진 색인 상태를 모니터링하고 수동으로 색인을 요청하세요.
        </p>
      </div>

      {/* 색인 제출 도구 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>색인 제출</span>
          </CardTitle>
          <CardDescription>
            선택한 URL들을 검색 엔진에 색인 요청합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 수동 URL 입력 */}
          <div className="space-y-2">
            <Label htmlFor="manual-url">수동 URL 제출</Label>
            <div className="flex space-x-2">
              <Input
                id="manual-url"
                placeholder="https://example.com/page"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => handleSubmitToIndex('google')}
                disabled={isSubmitting || !manualUrl}
              >
                Google 제출
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSubmitToIndex('indexnow')}
                disabled={isSubmitting || !manualUrl}
              >
                IndexNow 제출
              </Button>
            </div>
          </div>

          {/* 일괄 제출 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">일괄 제출</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => handleBulkSubmit('google')}
                disabled={isSubmitting}
              >
                Google 미색인 URL 일괄 제출
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkSubmit('bing')}
                disabled={isSubmitting}
              >
                Bing 미색인 URL 일괄 제출
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkSubmit('naver')}
                disabled={isSubmitting}
              >
                Naver 미색인 URL 일괄 제출
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkSubmit('indexnow')}
                disabled={isSubmitting}
              >
                IndexNow 일괄 제출
              </Button>
            </div>
          </div>

          {/* 선택된 URL 표시 */}
          {selectedUrls.length > 0 && (
            <div className="space-y-2">
              <Label>선택된 URL ({selectedUrls.length}개)</Label>
              <Textarea
                value={selectedUrls.join('\n')}
                readOnly
                rows={Math.min(selectedUrls.length, 5)}
                className="font-mono text-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 색인 현황 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>색인 현황</CardTitle>
          <CardDescription>
            각 페이지의 검색 엔진별 색인 상태
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-64">페이지</TableHead>
                  <TableHead>Google</TableHead>
                  <TableHead>Bing</TableHead>
                  <TableHead>Naver</TableHead>
                  <TableHead>IndexNow</TableHead>
                  <TableHead>마지막 제출</TableHead>
                  <TableHead className="w-32">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {indexingData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium truncate max-w-60" title={item.title}>
                          {item.title}
                        </div>
                        <div className="text-sm text-muted-foreground truncate max-w-60" title={item.url}>
                          {item.url}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.googleStatus)}
                        <div>
                          <div className="flex items-center space-x-1">
                            {getStatusBadge(item.googleStatus)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.googleLastChecked
                              ? new Date(item.googleLastChecked).toLocaleString('ko-KR')
                              : '미확인'
                            }
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.bingStatus)}
                        <div>
                          <div className="flex items-center space-x-1">
                            {getStatusBadge(item.bingStatus)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.bingLastChecked
                              ? new Date(item.bingLastChecked).toLocaleString('ko-KR')
                              : '미확인'
                            }
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.naverStatus)}
                        <div>
                          <div className="flex items-center space-x-1">
                            {getStatusBadge(item.naverStatus)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.naverLastChecked
                              ? new Date(item.naverLastChecked).toLocaleString('ko-KR')
                              : '미확인'
                            }
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getStatusBadge(item.indexNowStatus)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">
                        {item.lastSubmitted
                          ? new Date(item.lastSubmitted).toLocaleString('ko-KR')
                          : '미제출'
                        }
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSubmitToIndex('google')}
                          disabled={item.googleStatus === 'indexed'}
                        >
                          G
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSubmitToIndex('bing')}
                          disabled={item.bingStatus === 'indexed'}
                        >
                          B
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSubmitToIndex('indexnow')}
                        >
                          I
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 색인 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Google 색인율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {Math.round((indexingData.filter(item => item.googleStatus === 'indexed').length / indexingData.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {indexingData.filter(item => item.googleStatus === 'indexed').length}/{indexingData.length} 페이지
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">대기 중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {indexingData.filter(item => item.googleStatus === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Google 색인 대기
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">실패</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {indexingData.filter(item => item.googleStatus === 'failed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              재시도 필요
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">마지막 동기화</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {new Date().toLocaleString('ko-KR')}
            </div>
            <Button variant="outline" size="sm" className="mt-2 w-full">
              <RefreshCw className="mr-2 h-3 w-3" />
              동기화
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
