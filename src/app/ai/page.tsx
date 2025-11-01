/**
 * AI 해몽 페이지
 * @description 꿈 입력 폼과 AI 해몽 결과 표시
 */
'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Brain, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import DreamCard from '@/components/dream/dream-card';
import RelatedList from '@/components/shared/related-list';
import { DreamInput, DreamInterpretation } from '@/types/dream';
import { interpretDream } from '@/lib/openai-client';

const EMOTIONS = [
  '평온', '불안', '공포', '기쁨', '슬픔', '분노', '흥분', '혼란'
];

const COLORS = [
  '흰색', '검은색', '빨간색', '파란색', '초록색', '노란색', '보라색', '회색'
];

const SCENARIOS = [
  { value: 'chased', label: '쫓김' },
  { value: 'falling', label: '추락' },
  { value: 'flying', label: '비행' },
  { value: 'lost', label: '길 잃음' },
  { value: 'meeting', label: '만남' },
  { value: 'death', label: '죽음' },
  { value: 'water', label: '물' },
  { value: 'other', label: '기타' }
];

export default function AIInterpretation() {
  const [input, setInput] = useState<DreamInput>({
    keywords: [],
    scenario: '',
    emotions: [],
    colors: [],
    numbers: [],
    relations: [],
    details: ''
  });

  const [result, setResult] = useState<DreamInterpretation | null>(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [numberInput, setNumberInput] = useState('');

  // AI 해몽 뮤테이션
  const interpretMutation = useMutation({
    mutationFn: async (dreamInput: DreamInput) => {
      // OpenAI API 직접 호출
      // 주의: output: 'export' 모드에서는 Next.js API Routes가 작동하지 않으므로
      // 클라이언트에서 직접 OpenAI API를 호출합니다
      // ⚠️ 보안 경고: API 키가 클라이언트에 노출될 수 있으므로 Workers API 사용을 권장합니다
      // TODO: Workers API에 /api/ai/interpret 엔드포인트 구현 필요
      return await interpretDream(dreamInput);
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (input.keywords.length === 0) {
      alert('키워드를 최소 1개 이상 입력해주세요.');
      return;
    }

    interpretMutation.mutate(input);
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !input.keywords.includes(keywordInput.trim())) {
      setInput(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setInput(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const addNumber = () => {
    const num = parseInt(numberInput);
    if (!isNaN(num) && !(input.numbers || []).includes(num)) {
      setInput(prev => ({
        ...prev,
        numbers: [...(prev.numbers || []), num]
      }));
      setNumberInput('');
    }
  };

  const removeNumber = (number: number) => {
    setInput(prev => ({
      ...prev,
      numbers: (prev.numbers || []).filter(n => n !== number)
    }));
  };

  const toggleEmotion = (emotion: string) => {
    setInput(prev => ({
      ...prev,
      emotions: (prev.emotions || []).includes(emotion)
        ? (prev.emotions || []).filter(e => e !== emotion)
        : [...(prev.emotions || []), emotion]
    }));
  };

  const toggleColor = (color: string) => {
    setInput(prev => ({
      ...prev,
      colors: (prev.colors || []).includes(color)
        ? (prev.colors || []).filter(c => c !== color)
        : [...(prev.colors || []), color]
    }));
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 text-primary">
          <Brain className="h-8 w-8" />
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">AI 꿈 해몽</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          꿈의 키워드와 감정을 입력하면 AI가 심리학·문화·상징학 관점에서 분석해드립니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 입력 폼 */}
        <Card>
          <CardHeader>
            <CardTitle>꿈 입력하기</CardTitle>
            <CardDescription>
              꿈에 나온 중요한 요소들을 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 키워드 */}
              <div className="space-y-2">
                <Label>꿈에 나온 주요 키워드 *</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="예: 뱀, 물, 집..."
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <Button type="button" onClick={addKeyword} disabled={!keywordInput.trim()}>
                    추가
                  </Button>
                </div>
                {input.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {input.keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="cursor-pointer" onClick={() => removeKeyword(keyword)}>
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* 시나리오 */}
              <div className="space-y-2">
                <Label>주요 상황</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {SCENARIOS.map((scenario) => (
                    <Button
                      key={scenario.value}
                      type="button"
                      variant={input.scenario === scenario.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setInput(prev => ({ ...prev, scenario: prev.scenario === scenario.value ? '' : scenario.value }))}
                    >
                      {scenario.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 감정 */}
              <div className="space-y-2">
                <Label>느낀 감정</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {EMOTIONS.map((emotion) => (
                    <Button
                      key={emotion}
                      type="button"
                      variant={(input.emotions || []).includes(emotion) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleEmotion(emotion)}
                    >
                      {emotion}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 색상 */}
              <div className="space-y-2">
                <Label>주요 색상</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <Button
                      key={color}
                      type="button"
                      variant={(input.colors || []).includes(color) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 숫자 */}
              <div className="space-y-2">
                <Label>나온 숫자</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="예: 3"
                    value={numberInput}
                    onChange={(e) => setNumberInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNumber())}
                  />
                  <Button type="button" onClick={addNumber} disabled={!numberInput}>
                    추가
                  </Button>
                </div>
                {(input.numbers || []).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                    {(input.numbers || []).map((number) => (
                      <Badge key={number} variant="secondary" className="cursor-pointer" onClick={() => removeNumber(number)}>
                        {number} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* 상세 설명 */}
              <div className="space-y-2">
                <Label>꿈 상세 설명</Label>
                <Textarea
                  placeholder="꿈의 구체적인 내용이나 맥락을 설명해주세요..."
                  value={input.details}
                  onChange={(e) => setInput(prev => ({ ...prev, details: e.target.value }))}
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={interpretMutation.isPending}
              >
                {interpretMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    AI가 분석하는 중...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-5 w-5" />
                    AI 해몽 받기
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 결과 표시 */}
        <div className="space-y-6">
          {interpretMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                해몽 생성 중 오류가 발생했습니다. 다시 시도해주세요.
              </AlertDescription>
            </Alert>
          )}

          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>AI 해몽 결과</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 요약 */}
                <div>
                  <h3 className="font-semibold mb-2">해몽 요약</h3>
                  <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
                </div>

                <Separator />

                {/* 가설들 */}
                <div>
                  <h3 className="font-semibold mb-4">분석 가설</h3>
                  <div className="space-y-3">
                    {result.hypotheses.map((hypothesis, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{hypothesis.label}</h4>
                            <div className="text-sm text-muted-foreground">
                              신뢰도: {Math.round(hypothesis.confidence * 100)}%
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            근거: {hypothesis.evidence.join(', ')}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* 신호들 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-green-600">긍정적 신호</h3>
                    <ul className="space-y-1">
                      {result.positive_signs.map((sign, index) => (
                        <li key={index} className="text-sm text-muted-foreground">• {sign}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-red-600">주의 신호</h3>
                    <ul className="space-y-1">
                      {result.caution_points.map((point, index) => (
                        <li key={index} className="text-sm text-muted-foreground">• {point}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator />

                {/* 관련 꿈들 */}
                {result.related_slugs.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">관련 꿈 해몽</h3>
                    <RelatedList
                      items={result.related_slugs.map(slug => ({
                        slug,
                        title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        type: 'dream',
                        similarity: 0.5
                      }))}
                    />
                  </div>
                )}

                <Separator />

                {/* 디스클레이머 */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {result.disclaimer}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
