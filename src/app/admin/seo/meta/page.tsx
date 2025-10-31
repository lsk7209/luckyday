/**
 * 메타 태그 관리 페이지
 * @description SEO 메타 태그 및 구조화 데이터 관리
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Search,
  Settings,
  Code,
  FileText,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Save,
  Eye,
} from 'lucide-react';

// 임시 데이터 - 실제로는 API에서 가져올 예정
const metaData = [
  {
    id: 1,
    page: '/',
    title: 'CMS Calculator - 생활형 계산기 플랫폼',
    description: '연봉 계산기, 세금 계산기 등 생활에 필요한 계산기와 가이드를 제공합니다.',
    keywords: '계산기, 연봉, 세금, 금융, 건강',
    ogTitle: 'CMS Calculator - 생활형 계산기 플랫폼',
    ogDescription: '연봉 계산기, 세금 계산기 등 생활에 필요한 계산기와 가이드를 제공합니다.',
    ogImage: '/og-image.jpg',
    canonical: 'https://cms-calculator.com/',
    structuredData: 'Organization',
    lastUpdated: '2024-01-15T10:30:00',
    seoScore: 95,
  },
  {
    id: 2,
    page: '/utility/salary-calculator',
    title: '연봉 계산기 - 월급, 시급 변환 및 세금 계산',
    description: '연봉을 월급으로, 월급을 시급으로 변환하고 세금을 계산하는 정확한 계산기.',
    keywords: '연봉 계산기, 월급 계산, 시급 계산, 세금 계산',
    ogTitle: '연봉 계산기 - 정확한 월급/시급 변환',
    ogDescription: '연봉을 월급으로, 월급을 시급으로 변환하고 세금을 계산해보세요.',
    ogImage: '/salary-calculator-og.jpg',
    canonical: 'https://cms-calculator.com/utility/salary-calculator',
    structuredData: 'SoftwareApplication',
    lastUpdated: '2024-01-15T09:45:00',
    seoScore: 92,
  },
  {
    id: 3,
    page: '/blog/salary-negotiation-guide',
    title: '연봉 협상 가이드: 성공을 위한 5가지 핵심 포인트',
    description: '연봉 협상을 위한 완벽 가이드. 타이밍, 준비사항, 협상 전략 등 실무에 바로 적용 가능한 노하우를 소개합니다.',
    keywords: '연봉 협상, 커리어, 급여 협상, 연봉 인상',
    ogTitle: '연봉 협상 가이드 - 성공 전략 5가지',
    ogDescription: '연봉 협상을 성공적으로 이끌어내기 위한 전략과 실전 팁.',
    ogImage: '/salary-negotiation-og.jpg',
    canonical: 'https://cms-calculator.com/blog/salary-negotiation-guide',
    structuredData: 'BlogPosting',
    lastUpdated: '2024-01-14T16:20:00',
    seoScore: 88,
  },
];

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBadge = (score: number) => {
  if (score >= 90) return <Badge className="bg-green-500">우수</Badge>;
  if (score >= 80) return <Badge className="bg-yellow-500">양호</Badge>;
  return <Badge className="bg-red-500">개선 필요</Badge>;
};

export default function MetaManagement() {
  const [selectedPage, setSelectedPage] = useState(metaData[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(selectedPage);

  const handleEdit = (page: any) => {
    setSelectedPage(page);
    setEditedData(page);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // TODO: 실제 메타 데이터 저장 API 호출
      console.log('Saving meta data:', editedData);

      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('메타 데이터가 저장되었습니다.');
      setIsEditing(false);
    } catch (error) {
      console.error('Save meta data error:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleGenerateStructuredData = (type: string) => {
    // TODO: 구조화 데이터 자동 생성 로직
    console.log(`Generating structured data for ${type}`);
  };

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">메타 태그 관리</h1>
        <p className="text-muted-foreground">
          SEO 메타 태그와 구조화 데이터를 관리하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 메타 데이터 목록 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>페이지 목록</CardTitle>
            <CardDescription>
              메타 태그를 관리할 페이지들
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metaData.map((page) => (
                <div
                  key={page.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPage.id === page.id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedPage(page)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{page.page}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {page.title}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getScoreColor(page.seoScore)}`}>
                        {page.seoScore}
                      </span>
                      {getScoreBadge(page.seoScore)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 메타 데이터 편집기 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>메타 태그 편집</span>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button onClick={() => handleEdit(selectedPage)}>
                    <Settings className="mr-2 h-4 w-4" />
                    편집
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      취소
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      저장
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              {selectedPage.page} 페이지의 메타 태그 설정
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">기본 메타</TabsTrigger>
                <TabsTrigger value="social">소셜 미디어</TabsTrigger>
                <TabsTrigger value="structured">구조화 데이터</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">페이지 제목</Label>
                    <Input
                      id="title"
                      value={isEditing ? editedData.title : selectedPage.title}
                      onChange={(e) => setEditedData({...editedData, title: e.target.value})}
                      disabled={!isEditing}
                      placeholder="60자 이내로 입력하세요"
                    />
                    <p className="text-xs text-muted-foreground">
                      {(isEditing ? editedData.title : selectedPage.title).length}/60자
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">메타 설명</Label>
                    <Textarea
                      id="description"
                      value={isEditing ? editedData.description : selectedPage.description}
                      onChange={(e) => setEditedData({...editedData, description: e.target.value})}
                      disabled={!isEditing}
                      placeholder="160자 이내로 입력하세요"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {(isEditing ? editedData.description : selectedPage.description).length}/160자
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">키워드</Label>
                    <Input
                      id="keywords"
                      value={isEditing ? editedData.keywords : selectedPage.keywords}
                      onChange={(e) => setEditedData({...editedData, keywords: e.target.value})}
                      disabled={!isEditing}
                      placeholder="쉼표로 구분하여 입력하세요"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="canonical">Canonical URL</Label>
                    <Input
                      id="canonical"
                      value={isEditing ? editedData.canonical : selectedPage.canonical}
                      onChange={(e) => setEditedData({...editedData, canonical: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="og-title">Open Graph 제목</Label>
                    <Input
                      id="og-title"
                      value={isEditing ? editedData.ogTitle : selectedPage.ogTitle}
                      onChange={(e) => setEditedData({...editedData, ogTitle: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="og-description">Open Graph 설명</Label>
                    <Textarea
                      id="og-description"
                      value={isEditing ? editedData.ogDescription : selectedPage.ogDescription}
                      onChange={(e) => setEditedData({...editedData, ogDescription: e.target.value})}
                      disabled={!isEditing}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="og-image">Open Graph 이미지 URL</Label>
                    <Input
                      id="og-image"
                      value={isEditing ? editedData.ogImage : selectedPage.ogImage}
                      onChange={(e) => setEditedData({...editedData, ogImage: e.target.value})}
                      disabled={!isEditing}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="structured" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>구조화 데이터 타입</Label>
                      <p className="text-sm text-muted-foreground">
                        현재: {selectedPage.structuredData}
                      </p>
                    </div>
                    <Select
                      value={selectedPage.structuredData}
                      onValueChange={(value) => setEditedData({...editedData, structuredData: value})}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Organization">Organization</SelectItem>
                        <SelectItem value="WebSite">WebSite</SelectItem>
                        <SelectItem value="BlogPosting">BlogPosting</SelectItem>
                        <SelectItem value="Article">Article</SelectItem>
                        <SelectItem value="SoftwareApplication">SoftwareApplication</SelectItem>
                        <SelectItem value="HowTo">HowTo</SelectItem>
                        <SelectItem value="FAQPage">FAQPage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>자동 생성</Label>
                    <Button
                      variant="outline"
                      onClick={() => handleGenerateStructuredData(selectedPage.structuredData)}
                      disabled={!isEditing}
                    >
                      <Code className="mr-2 h-4 w-4" />
                      구조화 데이터 생성
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      선택한 타입에 맞는 JSON-LD 구조화 데이터를 자동으로 생성합니다.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* SEO 점수 분석 */}
      <Card>
        <CardHeader>
          <CardTitle>SEO 점수 분석</CardTitle>
          <CardDescription>
            각 페이지의 SEO 최적화 점수 및 개선 제안
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>페이지</TableHead>
                <TableHead>SEO 점수</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>마지막 업데이트</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metaData.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{page.page}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-48">
                        {page.title}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${getScoreColor(page.seoScore)}`}>
                        {page.seoScore}
                      </span>
                      <span className="text-sm text-muted-foreground">/100</span>
                    </div>
                  </TableCell>
                  <TableCell>{getScoreBadge(page.seoScore)}</TableCell>
                  <TableCell>
                    {new Date(page.lastUpdated).toLocaleString('ko-KR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(page)}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={page.canonical} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 일괄 작업 */}
      <Card>
        <CardHeader>
          <CardTitle>일괄 작업</CardTitle>
          <CardDescription>
            여러 페이지의 메타 태그를 한 번에 관리
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <RefreshCw className="mr-2 h-4 w-4" />
              모든 페이지 SEO 점수 재계산
            </Button>

            <Button variant="outline" className="justify-start">
              <FileText className="mr-2 h-4 w-4" />
              누락된 메타 태그 자동 생성
            </Button>

            <Button variant="outline" className="justify-start">
              <CheckCircle className="mr-2 h-4 w-4" />
              SEO 검증 실행
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
