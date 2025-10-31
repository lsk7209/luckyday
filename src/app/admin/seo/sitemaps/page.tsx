/**
 * 사이트맵 관리 페이지
 * @description XML 사이트맵 생성, 관리 및 제출
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
  FileText,
  RefreshCw,
  Download,
  ExternalLink,
  Plus,
  Settings,
  Eye,
  Globe,
  AlertTriangle,
} from 'lucide-react';

// 임시 데이터 - 실제로는 API에서 가져올 예정
const sitemapData = {
  main: {
    url: 'https://cms-calculator.com/sitemap.xml',
    lastGenerated: '2024-01-15T10:30:00',
    lastSubmitted: '2024-01-15T10:35:00',
    totalUrls: 85,
    status: 'active',
    format: 'xml',
    priority: 1.0,
    changeFrequency: 'daily',
  },
  blog: {
    url: 'https://cms-calculator.com/sitemap-blog.xml',
    lastGenerated: '2024-01-15T10:30:00',
    lastSubmitted: '2024-01-15T10:35:00',
    totalUrls: 45,
    status: 'active',
    format: 'xml',
    priority: 0.8,
    changeFrequency: 'weekly',
  },
  utilities: {
    url: 'https://cms-calculator.com/sitemap-utilities.xml',
    lastGenerated: '2024-01-15T10:30:00',
    lastSubmitted: '2024-01-15T10:35:00',
    totalUrls: 12,
    status: 'active',
    format: 'xml',
    priority: 1.0,
    changeFrequency: 'monthly',
  },
  guides: {
    url: 'https://cms-calculator.com/sitemap-guides.xml',
    lastGenerated: '2024-01-15T10:30:00',
    lastSubmitted: '2024-01-15T10:35:00',
    totalUrls: 28,
    status: 'active',
    format: 'xml',
    priority: 0.9,
    changeFrequency: 'monthly',
  },
};

const submissionHistory = [
  {
    sitemap: 'main',
    provider: 'google',
    submittedAt: '2024-01-15T10:35:00',
    status: 'success',
    responseCode: 200,
  },
  {
    sitemap: 'blog',
    provider: 'bing',
    submittedAt: '2024-01-15T10:35:00',
    status: 'success',
    responseCode: 200,
  },
  {
    sitemap: 'main',
    provider: 'google',
    submittedAt: '2024-01-14T10:30:00',
    status: 'success',
    responseCode: 200,
  },
  {
    sitemap: 'utilities',
    provider: 'google',
    submittedAt: '2024-01-14T10:30:00',
    status: 'failed',
    responseCode: 500,
    errorMessage: 'Server error',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500">활성</Badge>;
    case 'inactive':
      return <Badge variant="secondary">비활성</Badge>;
    case 'success':
      return <Badge className="bg-green-500">성공</Badge>;
    case 'failed':
      return <Badge className="bg-red-500">실패</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-500">대기중</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getPriorityLabel = (priority: number) => {
  if (priority >= 1.0) return '매우 높음';
  if (priority >= 0.8) return '높음';
  if (priority >= 0.5) return '보통';
  if (priority >= 0.3) return '낮음';
  return '매우 낮음';
};

const getProviderName = (provider: string) => {
  switch (provider) {
    case 'google':
      return 'Google Search Console';
    case 'bing':
      return 'Bing Webmaster Tools';
    case 'naver':
      return 'Naver Webmaster Tool';
    default:
      return provider;
  }
};

export default function SitemapManagement() {
  const [selectedSitemap, setSelectedSitemap] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerateSitemap = async (sitemapType: string) => {
    setIsGenerating(true);

    try {
      // TODO: 실제 사이트맵 생성 API 호출
      console.log(`Generating sitemap: ${sitemapType}`);

      await new Promise(resolve => setTimeout(resolve, 2000));

      alert(`${sitemapType} 사이트맵이 생성되었습니다.`);
    } catch (error) {
      console.error('Sitemap generation error:', error);
      alert('사이트맵 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitSitemap = async (sitemapType: string, provider: string) => {
    setIsSubmitting(true);

    try {
      // TODO: 실제 사이트맵 제출 API 호출
      console.log(`Submitting sitemap ${sitemapType} to ${provider}`);

      await new Promise(resolve => setTimeout(resolve, 1500));

      alert(`${provider}에 ${sitemapType} 사이트맵을 제출했습니다.`);
    } catch (error) {
      console.error('Sitemap submission error:', error);
      alert('사이트맵 제출에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkGenerate = async () => {
    setIsGenerating(true);

    try {
      // TODO: 모든 사이트맵 일괄 생성
      console.log('Generating all sitemaps');

      await new Promise(resolve => setTimeout(resolve, 3000));

      alert('모든 사이트맵이 생성되었습니다.');
    } catch (error) {
      console.error('Bulk sitemap generation error:', error);
      alert('사이트맵 일괄 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">사이트맵 관리</h1>
        <p className="text-muted-foreground">
          XML 사이트맵을 생성하고 검색 엔진에 제출하세요.
        </p>
      </div>

      {/* 사이트맵 생성 도구 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>사이트맵 생성</span>
          </CardTitle>
          <CardDescription>
            콘텐츠를 기반으로 XML 사이트맵을 자동 생성합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 수동 생성 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="sitemap-type">사이트맵 타입</Label>
                <Select value={selectedSitemap} onValueChange={setSelectedSitemap}>
                  <SelectTrigger>
                    <SelectValue placeholder="사이트맵 타입 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">메인 사이트맵</SelectItem>
                    <SelectItem value="blog">블로그 사이트맵</SelectItem>
                    <SelectItem value="utilities">계산기 사이트맵</SelectItem>
                    <SelectItem value="guides">가이드 사이트맵</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end space-x-2">
                <Button
                  onClick={() => handleGenerateSitemap(selectedSitemap)}
                  disabled={isGenerating || !selectedSitemap}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  생성
                </Button>
              </div>
            </div>
          </div>

          {/* 일괄 생성 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">일괄 생성</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleBulkGenerate} disabled={isGenerating}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                모든 사이트맵 생성
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 사이트맵 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>사이트맵 목록</CardTitle>
          <CardDescription>
            생성된 사이트맵들의 상태 및 관리
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(sitemapData).map(([type, sitemap]) => (
              <div key={type} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Globe className="h-8 w-8 text-blue-500" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium capitalize">{type} Sitemap</h3>
                      {getStatusBadge(sitemap.status)}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>URL: {sitemap.totalUrls}개</span>
                      <span>•</span>
                      <span>우선순위: {getPriorityLabel(sitemap.priority)}</span>
                      <span>•</span>
                      <span>변경빈도: {sitemap.changeFrequency}</span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      마지막 생성: {new Date(sitemap.lastGenerated).toLocaleString('ko-KR')}
                      {sitemap.lastSubmitted && (
                        <> • 마지막 제출: {new Date(sitemap.lastSubmitted).toLocaleString('ko-KR')}</>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={sitemap.url} target="_blank" rel="noopener noreferrer">
                      <Eye className="mr-2 h-4 w-4" />
                      보기
                    </a>
                  </Button>

                  <Button variant="outline" size="sm" asChild>
                    <a href={sitemap.url} download>
                      <Download className="mr-2 h-4 w-4" />
                      다운로드
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSubmitSitemap(type, 'google')}
                    disabled={isSubmitting}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Google 제출
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSubmitSitemap(type, 'bing')}
                    disabled={isSubmitting}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Bing 제출
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 제출 기록 */}
      <Card>
        <CardHeader>
          <CardTitle>제출 기록</CardTitle>
          <CardDescription>
            검색 엔진에 제출된 사이트맵들의 기록
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사이트맵</TableHead>
                <TableHead>제출처</TableHead>
                <TableHead>제출시간</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>응답코드</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissionHistory.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="capitalize">{record.sitemap}</TableCell>
                  <TableCell>{getProviderName(record.provider)}</TableCell>
                  <TableCell>
                    {new Date(record.submittedAt).toLocaleString('ko-KR')}
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <Badge variant={record.responseCode >= 200 && record.responseCode < 300 ? "default" : "destructive"}>
                      {record.responseCode}
                    </Badge>
                    {record.errorMessage && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {record.errorMessage}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 사이트맵 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>사이트맵 설정</span>
          </CardTitle>
          <CardDescription>
            사이트맵 생성 및 제출에 대한 설정
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="default-priority">기본 우선순위</Label>
              <Input
                id="default-priority"
                type="number"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-frequency">기본 변경빈도</Label>
              <Select defaultValue="weekly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always">항상</SelectItem>
                  <SelectItem value="hourly">시간별</SelectItem>
                  <SelectItem value="daily">일별</SelectItem>
                  <SelectItem value="weekly">주별</SelectItem>
                  <SelectItem value="monthly">월별</SelectItem>
                  <SelectItem value="yearly">연별</SelectItem>
                  <SelectItem value="never">변경없음</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">자동 생성</h3>
                <p className="text-sm text-muted-foreground">
                  콘텐츠 변경 시 자동으로 사이트맵 업데이트
                </p>
              </div>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                설정
              </Button>
            </div>
          </div>

          <Button className="w-full">
            설정 저장
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
