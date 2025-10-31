/**
 * 가이드 상세 페이지
 * @description 가이드의 상세 내용과 단계별 설명 표시
 */
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FAQSection from '@/components/shared/faq-section';
import RelatedContent from '@/components/shared/related-content';
import { GuideContent } from '@/types/content';

// 임시 데이터
const mockGuideData: Record<string, GuideContent> = {
  'tax-filing-guide': {
    id: '1',
    type: 'guide',
    slug: 'tax-filing-guide',
    title: '개인所得税 신고 가이드',
    summary: '개인所得税 신고 방법을 단계별로 알아보세요.',
    seoTitle: '개인所得税 신고 가이드: 종합소득세 신고 방법 | CMS Guide',
    seoDescription: '개인所得税 신고를 위한 완벽 가이드. 신고 기간, 필요 서류, 절세 팁까지 단계별로 상세히 설명합니다.',
    steps: [
      {
        title: '신고 대상 확인',
        description: '근로소득, 사업소득, 기타소득 등 신고 대상 여부를 확인하세요.',
        durationMinutes: 10,
      },
      {
        title: '필요 서류 준비',
        description: '소득금액증명원, 의료비 영수증, 기부금 영수증 등 필요 서류를 준비하세요.',
        durationMinutes: 30,
      },
      {
        title: '홈택스 접속 및 로그인',
        description: '국세청 홈택스 사이트에 접속하여 공동인증서로 로그인하세요.',
        durationMinutes: 5,
      },
      {
        title: '소득 정보 입력',
        description: '근로소득, 사업소득 등 모든 소득 정보를 정확히 입력하세요.',
        durationMinutes: 45,
      },
      {
        title: '공제 항목 입력',
        description: '인적공제, 연금보험료 공제 등 공제 항목을 입력하세요.',
        durationMinutes: 30,
      },
      {
        title: '세액 계산 및 검토',
        description: '자동 계산된 세액을 검토하고, 추가 공제 사항이 있는지 확인하세요.',
        durationMinutes: 15,
      },
      {
        title: '신고서 제출',
        description: '모든 정보가 정확한지 최종 확인 후 신고서를 제출하세요.',
        durationMinutes: 10,
      },
    ],
    level: 'intermediate',
    durationMinutes: 145,
    body: '개인所得税 신고 가이드 상세 내용...',
    faq: [
      {
        question: '所得税 신고 기간은 언제인가요?',
        answer: '종합소득세 신고 기간은 매년 5월 1일부터 5월 31일까지입니다.',
      },
    ],
    related: [],
    status: 'published',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    tags: ['세금', '신고', '종합소득세'],
    jsonLd: {
      '@type': 'HowTo',
      name: '개인所得税 신고 가이드',
      description: '개인所得税 신고를 위한 완벽 가이드',
      totalTime: 'PT145M',
      step: [],
    },
  },
};

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = mockGuideData[slug];

  if (!guide) {
    return {
      title: '가이드를 찾을 수 없습니다',
    };
  }

  return {
    title: guide.seoTitle,
    description: guide.seoDescription,
    keywords: guide.tags.join(', '),
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = mockGuideData[slug];

  if (!guide) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">가이드를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-6">
          요청하신 가이드가 존재하지 않거나 삭제되었을 수 있습니다.
        </p>
        <Button asChild>
          <Link href="/guide">
            <ArrowLeft className="mr-2 h-4 w-4" />
            가이드 목록으로 돌아가기
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/guide" className="hover:text-foreground">가이드</Link>
          <span>/</span>
          <span>{guide.title}</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {guide.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">
            {guide.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>총 {guide.durationMinutes}분 소요</span>
            </div>

            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>난이도: {guide.level === 'beginner' ? '초급' : guide.level === 'intermediate' ? '중급' : '고급'}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {guide.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* 단계별 가이드 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">단계별 가이드</h2>

        <div className="space-y-4">
          {guide.steps.map((step, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {step.description}
                    </CardDescription>
                    {step.durationMinutes && (
                      <div className="flex items-center space-x-1 mt-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{step.durationMinutes}분</span>
                      </div>
                    )}
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <FAQSection faqs={guide.faq} />

      {/* 관련 콘텐츠 */}
      <RelatedContent items={guide.related} />

      {/* 네비게이션 */}
      <div className="flex justify-between items-center pt-8 border-t">
        <Button variant="outline" asChild>
          <Link href="/guide">
            <ArrowLeft className="mr-2 h-4 w-4" />
            가이드 목록
          </Link>
        </Button>

        <Button variant="outline" size="sm">
          공유하기
        </Button>
      </div>
    </div>
  );
}
