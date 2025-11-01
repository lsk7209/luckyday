/**
 * DreamScope 꿈 데이터 관리 페이지
 * @description 꿈 심볼 데이터의 CRUD 관리 인터페이스
 */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Moon,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  TrendingUp,
  Calendar,
  Tag,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 꿈 카테고리 정의
const DREAM_CATEGORIES = [
  { value: 'animal', label: '동물' },
  { value: 'emotion', label: '감정' },
  { value: 'place', label: '장소' },
  { value: 'object', label: '물건' },
  { value: 'action', label: '행동' },
  { value: 'scenario', label: '시나리오' },
  { value: 'color', label: '색상' },
  { value: 'number', label: '숫자' },
];

// 임시 꿈 데이터 - 실제로는 Supabase에서 가져올 예정
const mockDreamData = [
  {
    id: '1',
    slug: 'baem-snake-dream',
    name: '뱀 꿈',
    category: 'animal',
    summary: '뱀 꿈은 변화와 갱신의 신호입니다.',
    quick_answer: '뱀 꿈은 대개 변화, 갱신, 회복의 의미로 해석됩니다.',
    popularity: 1250,
    tags: ['뱀꿈', '해몽', '변화', '갱신'],
    last_updated: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    slug: 'tooth-loss-dream',
    name: '이빨 꿈',
    category: 'body',
    summary: '이빨 꿈은 변화, 불안, 자기표현의 신호입니다.',
    quick_answer: '이빨 꿈은 대개 불안이나 변화의 신호로, 잃어버리는 치아의 위치에 따라 가족, 일, 대인관계 문제를 반영합니다.',
    popularity: 980,
    tags: ['이빨꿈', '해몽', '불안', '변화'],
    last_updated: '2024-01-15T11:00:00Z',
  },
  {
    id: '3',
    slug: 'water-dream',
    name: '물 꿈',
    category: 'element',
    summary: '물 꿈은 감정 상태와 무의식을 반영합니다.',
    quick_answer: '물 꿈은 감정의 흐름을 상징하며, 맑은 물은 평온함,浑浊 물은 혼란스러운 감정을 나타냅니다.',
    popularity: 750,
    tags: ['물꿈', '해몽', '감정', '무의식'],
    last_updated: '2024-01-15T12:00:00Z',
  },
];

interface DreamFormData {
  name: string;
  category: string;
  summary: string;
  quick_answer: string;
  tags: string[];
}

export default function DreamContentPage() {
  const [dreams, setDreams] = useState(mockDreamData);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDream, setSelectedDream] = useState<any>(null);
  const [formData, setFormData] = useState<DreamFormData>({
    name: '',
    category: '',
    summary: '',
    quick_answer: '',
    tags: [],
  });
  const { toast } = useToast();

  // 필터링된 꿈 데이터
  const filteredDreams = dreams.filter((dream) => {
    const matchesSearch = dream.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dream.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || dream.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // CRUD 함수들
  const handleCreate = async () => {
    if (!formData.name || !formData.category || !formData.summary || !formData.quick_answer) {
      toast({
        title: "필수 정보 누락",
        description: "이름, 카테고리, 요약, 빠른 답변은 필수입니다.",
        variant: "destructive",
      });
      return;
    }

    const newDream = {
      id: Date.now().toString(),
      slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, ''),
      ...formData,
      popularity: 0,
      last_updated: new Date().toISOString(),
    };

    setDreams([...dreams, newDream]);
    setIsCreateDialogOpen(false);
    setFormData({ name: '', category: '', summary: '', quick_answer: '', tags: [] });

    toast({
      title: "꿈 데이터 추가 완료",
      description: `${newDream.name} 꿈이 성공적으로 추가되었습니다.`,
    });
  };

  const handleEdit = (dream: any) => {
    setSelectedDream(dream);
    setFormData({
      name: dream.name,
      category: dream.category,
      summary: dream.summary,
      quick_answer: dream.quick_answer,
      tags: dream.tags,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedDream) return;

    const updatedDream = {
      ...selectedDream,
      ...formData,
      last_updated: new Date().toISOString(),
    };

    setDreams(dreams.map(d => d.id === selectedDream.id ? updatedDream : d));
    setIsEditDialogOpen(false);
    setSelectedDream(null);
    setFormData({ name: '', category: '', summary: '', quick_answer: '', tags: [] });

    toast({
      title: "꿈 데이터 수정 완료",
      description: `${updatedDream.name} 꿈이 성공적으로 수정되었습니다.`,
    });
  };

  const handleDelete = (dream: any) => {
    if (confirm(`${dream.name} 꿈을 정말 삭제하시겠습니까?`)) {
      setDreams(dreams.filter(d => d.id !== dream.id));
      toast({
        title: "꿈 데이터 삭제 완료",
        description: `${dream.name} 꿈이 삭제되었습니다.`,
      });
    }
  };

  const handleTagChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({ ...formData, tags });
  };

  const getCategoryBadge = (category: string) => {
    const categoryInfo = DREAM_CATEGORIES.find(c => c.value === category);
    return <Badge variant="outline">{categoryInfo?.label || category}</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Moon className="mr-2 h-8 w-8" />
            꿈 데이터 관리
          </h1>
          <p className="text-muted-foreground">
            꿈 심볼 데이터를 추가, 수정, 삭제하세요.
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              새 꿈 데이터
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 꿈 데이터 추가</DialogTitle>
              <DialogDescription>
                꿈 심볼의 기본 정보를 입력하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">꿈 이름</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="예: 뱀 꿈"
                  />
                </div>
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {DREAM_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="summary">요약</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="꿈의 간단한 요약을 입력하세요"
                />
              </div>

              <div>
                <Label htmlFor="quick_answer">빠른 답변</Label>
                <Textarea
                  id="quick_answer"
                  value={formData.quick_answer}
                  onChange={(e) => setFormData({ ...formData, quick_answer: e.target.value })}
                  placeholder="110자 이내의 빠른 답변을 입력하세요"
                />
              </div>

              <div>
                <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagChange(e.target.value)}
                  placeholder="예: 뱀꿈, 해몽, 변화, 갱신"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleCreate}>추가</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="꿈 이름 또는 태그 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="카테고리 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                {DREAM_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 꿈 데이터 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>꿈 심볼 목록 ({filteredDreams.length}개)</CardTitle>
          <CardDescription>
            등록된 꿈 심볼 데이터를 관리하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>인기도</TableHead>
                <TableHead>마지막 수정</TableHead>
                <TableHead>태그</TableHead>
                <TableHead className="w-24">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDreams.map((dream) => (
                <TableRow key={dream.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{dream.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {dream.summary}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryBadge(dream.category)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>{dream.popularity.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(dream.last_updated).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {dream.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {dream.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{dream.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a href={`/dream/${dream.slug}`} target="_blank" className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            미리보기
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(dream)}>
                          <Edit className="mr-2 h-4 w-4" />
                          수정
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(dream)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredDreams.length === 0 && (
            <div className="text-center py-12">
              <Moon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
              <p className="text-muted-foreground">
                다른 검색어로 시도하거나 필터를 조정해보세요.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>꿈 데이터 수정</DialogTitle>
            <DialogDescription>
              꿈 심볼 정보를 수정하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">꿈 이름</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">카테고리</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DREAM_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-summary">요약</Label>
              <Textarea
                id="edit-summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-quick_answer">빠른 답변</Label>
              <Textarea
                id="edit-quick_answer"
                value={formData.quick_answer}
                onChange={(e) => setFormData({ ...formData, quick_answer: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-tags">태그 (쉼표로 구분)</Label>
              <Input
                id="edit-tags"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagChange(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleUpdate}>수정</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
