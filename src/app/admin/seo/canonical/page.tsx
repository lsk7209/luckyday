/**
 * 캐노니컬 관리 페이지
 * @description 중복 URL 캐노니컬 태그 관리
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Globe,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Copy,
  Search,
} from 'lucide-react';

// 임시 데이터 - 실제로는 API에서 가져올 예정
const canonicalRules = [
  {
    id: 1,
    sourceUrl: '/blog/post-title',
    canonicalUrl: 'https://cms-calculator.com/blog/post-title',
    type: 'self',
    status: 'active',
    lastChecked: '2024-01-15T10:30:00',
    issues: [],
  },
  {
    id: 2,
    sourceUrl: '/blog/post-title?utm_source=facebook',
    canonicalUrl: 'https://cms-calculator.com/blog/post-title',
    type: 'parameter',
    status: 'active',
    lastChecked: '2024-01-15T10:30:00',
    issues: [],
  },
  {
    id: 3,
    sourceUrl: '/old-blog-url',
    canonicalUrl: 'https://cms-calculator.com/blog/new-url',
    type: 'redirect',
    status: 'active',
    lastChecked: '2024-01-15T10:15:00',
    issues: ['redirect_missing'],
  },
  {
    id: 4,
    sourceUrl: '/duplicate-content',
    canonicalUrl: 'https://cms-calculator.com/original-content',
    type: 'duplicate',
    status: 'inactive',
    lastChecked: '2024-01-14T16:20:00',
    issues: ['canonical_not_set'],
  },
];

const duplicateUrls = [
  {
    originalUrl: '/blog/original-post',
    duplicateUrls: [
      '/blog/original-post?utm_source=email',
      '/blog/original-post?ref=newsletter',
      '/blog/original-post?version=old',
    ],
    canonicalSet: true,
    lastDetected: '2024-01-15T08:30:00',
  },
  {
    originalUrl: '/utility/calculator',
    duplicateUrls: [
      '/utility/calculator?mobile=true',
      '/utility/calculator?theme=dark',
    ],
    canonicalSet: false,
    lastDetected: '2024-01-15T09:45:00',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500">활성</Badge>;
    case 'inactive':
      return <Badge variant="secondary">비활성</Badge>;
    case 'error':
      return <Badge className="bg-red-500">오류</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'self':
      return '자체 참조';
    case 'parameter':
      return '파라미터 제거';
    case 'redirect':
      return '리다이렉트';
    case 'duplicate':
      return '중복 콘텐츠';
    default:
      return type;
  }
};

const getTypeDescription = (type: string) => {
  switch (type) {
    case 'self':
      return '페이지가 자신의 URL을 캐노니컬로 지정';
    case 'parameter':
      return 'UTM 파라미터 등 추적 코드를 제거한 클린 URL로 지정';
    case 'redirect':
      return '이전 URL에서 새 URL로 캐노니컬 지정';
    case 'duplicate':
      return '중복된 콘텐츠에서 대표 URL로 지정';
    default:
      return '';
  }
};

export default function CanonicalManagement() {
  const [selectedRule, setSelectedRule] = useState<any>(null);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRule, setNewRule] = useState({
    sourceUrl: '',
    canonicalUrl: '',
    type: 'self',
  });

  const handleAddRule = async () => {
    try {
      // TODO: 실제 캐노니컬 규칙 추가 API 호출
      console.log('Adding canonical rule:', newRule);

      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('캐노니컬 규칙이 추가되었습니다.');
      setIsAddingRule(false);
      setNewRule({ sourceUrl: '', canonicalUrl: '', type: 'self' });
    } catch (error) {
      console.error('Add canonical rule error:', error);
      alert('규칙 추가에 실패했습니다.');
    }
  };

  const handleDeleteRule = async (ruleId: number) => {
    try {
      // TODO: 실제 캐노니컬 규칙 삭제 API 호출
      console.log('Deleting canonical rule:', ruleId);

      await new Promise(resolve => setTimeout(resolve, 500));

      alert('캐노니컬 규칙이 삭제되었습니다.');
    } catch (error) {
      console.error('Delete canonical rule error:', error);
      alert('규칙 삭제에 실패했습니다.');
    }
  };

  const handleScanDuplicates = async () => {
    try {
      // TODO: 실제 중복 URL 스캔 API 호출
      console.log('Scanning for duplicate URLs');

      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('중복 URL 스캔이 완료되었습니다.');
    } catch (error) {
      console.error('Scan duplicates error:', error);
      alert('스캔에 실패했습니다.');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // TODO: 토스트 메시지 표시
  };

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">캐노니컬 관리</h1>
        <p className="text-muted-foreground">
          중복 URL의 캐노니컬 태그를 관리하고 SEO 중복 문제를 해결하세요.
        </p>
      </div>

      {/* 캐노니컬 규칙 추가 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>캐노니컬 규칙 관리</span>
            </div>
            <Button onClick={() => setIsAddingRule(!isAddingRule)}>
              <Plus className="mr-2 h-4 w-4" />
              새 규칙 추가
            </Button>
          </CardTitle>
          <CardDescription>
            URL별 캐노니컬 태그 설정 및 관리
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAddingRule && (
            <div className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/50">
              <h3 className="font-medium">새 캐노니컬 규칙 추가</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source-url">소스 URL</Label>
                  <Input
                    id="source-url"
                    placeholder="/page-url"
                    value={newRule.sourceUrl}
                    onChange={(e) => setNewRule({...newRule, sourceUrl: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonical-url">캐노니컬 URL</Label>
                  <Input
                    id="canonical-url"
                    placeholder="https://example.com/canonical-url"
                    value={newRule.canonicalUrl}
                    onChange={(e) => setNewRule({...newRule, canonicalUrl: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rule-type">규칙 타입</Label>
                <Select value={newRule.type} onValueChange={(value) => setNewRule({...newRule, type: value})}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self">자체 참조</SelectItem>
                    <SelectItem value="parameter">파라미터 제거</SelectItem>
                    <SelectItem value="redirect">리다이렉트</SelectItem>
                    <SelectItem value="duplicate">중복 콘텐츠</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {getTypeDescription(newRule.type)}
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingRule(false)}>
                  취소
                </Button>
                <Button onClick={handleAddRule}>
                  추가
                </Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>소스 URL</TableHead>
                <TableHead>캐노니컬 URL</TableHead>
                <TableHead>타입</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>마지막 확인</TableHead>
                <TableHead className="w-32">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {canonicalRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">{rule.sourceUrl}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyUrl(rule.sourceUrl)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm truncate max-w-48">
                        {rule.canonicalUrl}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyUrl(rule.canonicalUrl)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a href={rule.canonicalUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getTypeLabel(rule.type)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(rule.status)}
                      {rule.issues.length > 0 && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(rule.lastChecked).toLocaleString('ko-KR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>캐노니컬 규칙 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              이 캐노니컬 규칙을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteRule(rule.id)}>
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 중복 URL 탐지 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>중복 URL 탐지</span>
            </div>
            <Button onClick={handleScanDuplicates}>
              <Search className="mr-2 h-4 w-4" />
              스캔 실행
            </Button>
          </CardTitle>
          <CardDescription>
            사이트 내 중복 URL을 탐지하고 캐노니컬 태그 설정을 제안합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {duplicateUrls.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">대표 URL</span>
                    <span className="font-mono text-sm">{item.originalUrl}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.canonicalSet ? (
                      <Badge className="bg-green-500">캐노니컬 설정됨</Badge>
                    ) : (
                      <Badge className="bg-yellow-500">설정 필요</Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      마지막 탐지: {new Date(item.lastDetected).toLocaleString('ko-KR')}
                    </span>
                  </div>
                </div>

                <div className="ml-7 space-y-2">
                  <p className="text-sm text-muted-foreground">중복 URL들:</p>
                  <div className="space-y-1">
                    {item.duplicateUrls.map((url, urlIndex) => (
                      <div key={urlIndex} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="font-mono text-sm">{url}</span>
                        <Button variant="outline" size="sm">
                          캐노니컬 설정
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 캐노니컬 검증 */}
      <Card>
        <CardHeader>
          <CardTitle>캐노니컬 검증</CardTitle>
          <CardDescription>
            설정된 캐노니컬 태그의 유효성을 검증하고 문제를 해결하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-500 mb-2">
                  {canonicalRules.filter(r => r.status === 'active' && r.issues.length === 0).length}
                </div>
                <p className="text-sm text-muted-foreground">정상</p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-500 mb-2">
                  {canonicalRules.filter(r => r.issues.length > 0).length}
                </div>
                <p className="text-sm text-muted-foreground">주의 필요</p>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-500 mb-2">
                  {canonicalRules.filter(r => r.status === 'error').length}
                </div>
                <p className="text-sm text-muted-foreground">오류</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">검증 작업</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  모든 캐노니컬 검증
                </Button>
                <Button variant="outline">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  문제 해결 제안
                </Button>
                <Button variant="outline">
                  <Globe className="mr-2 h-4 w-4" />
                  HTML 소스 확인
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
