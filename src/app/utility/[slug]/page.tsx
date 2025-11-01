/**
 * 계산기 상세 페이지
 * @description 특정 계산기의 상세 정보와 계산 기능 제공
 */
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Star, TrendingUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UtilityCalculator from '@/components/utility/utility-calculator';
import { UtilityContent } from '@/types/content';

// 임시 데이터 - 실제로는 API에서 가져올 예정
const mockUtilityData: Record<string, UtilityContent> = {
  'salary-calculator': {
    id: '1',
    type: 'utility',
    slug: 'salary-calculator',
    title: '연봉 계산기',
    summary: '연봉, 월급, 시급을 서로 변환하고 세금을 계산해보세요',
    seoTitle: '연봉 계산기 - 월급, 시급 변환 및 세금 계산 | CMS Calculator',
    seoDescription: '연봉을 월급으로, 월급을 시급으로 변환하고 세금을 계산하는 정확한 계산기. 연봉 협상 시 필수 도구입니다.',
    category: '금융',
    version: '2.1.0',
    inputs: [
      {
        key: 'annualSalary',
        label: '연봉',
        type: 'number',
        required: false,
        unit: '원',
        placeholder: '예: 50000000',
        validation: { min: 0 },
      },
      {
        key: 'monthlySalary',
        label: '월급',
        type: 'number',
        required: false,
        unit: '원',
        placeholder: '예: 4166667',
        validation: { min: 0 },
      },
      {
        key: 'hourlyWage',
        label: '시급',
        type: 'number',
        required: false,
        unit: '원',
        placeholder: '예: 25000',
        validation: { min: 0 },
      },
      {
        key: 'workHours',
        label: '일일 근무시간',
        type: 'number',
        required: false,
        unit: '시간',
        placeholder: '예: 8',
        validation: { min: 1, max: 24 },
      },
      {
        key: 'workDays',
        label: '월 근무일수',
        type: 'number',
        required: false,
        unit: '일',
        placeholder: '예: 22',
        validation: { min: 1, max: 31 },
      },
    ],
    outputs: [
      {
        key: 'calculatedAnnualSalary',
        label: '연봉',
        type: 'number',
        unit: '원',
        description: '계산된 연봉 금액',
        interpretation: '세전 연봉 금액입니다.',
      },
      {
        key: 'monthlySalary',
        label: '월급',
        type: 'number',
        unit: '원',
        description: '계산된 월급 금액',
        interpretation: '세전 월급 금액입니다.',
      },
      {
        key: 'hourlyWage',
        label: '시급',
        type: 'number',
        unit: '원',
        description: '계산된 시급 금액',
        interpretation: '세전 시급 금액입니다.',
      },
      {
        key: 'estimatedTax',
        label: '예상 세금',
        type: 'number',
        unit: '원',
        description: '근로소득세 및 지방소득세 합계',
        interpretation: '예상 세금 금액입니다. 실제 세금은 소득공제 등에 따라 달라질 수 있습니다.',
      },
      {
        key: 'takeHomePay',
        label: '실수령액',
        type: 'number',
        unit: '원',
        description: '세금을 제외한 실제 수령 금액',
        interpretation: '세금을 제외한 월 실수령액입니다.',
      },
    ],
    formulaKey: 'salary_conversion',
    sources: [
      {
        name: '국세청',
        url: 'https://www.nts.go.kr',
        description: '근로소득세 계산 기준',
      },
    ],
    faq: [
      {
        question: '연봉 계산은 정확한가요?',
        answer: '이 계산기는 국세청 기준에 따라 근로소득세를 계산합니다. 다만 실제 세금은 개인의 소득공제, 세액공제 등에 따라 달라질 수 있습니다.',
      },
      {
        question: '월 근무일수는 어떻게 계산하나요?',
        answer: '일반적으로 월 22일(주 5일 근무 기준)을 사용합니다. 회사 정책에 따라 다를 수 있으니 확인 후 입력하세요.',
      },
    ],
    related: [
      {
        slug: 'tax-calculator',
        title: '세금 계산기',
        type: 'utility',
        similarity: 0.85,
      },
      {
        slug: 'salary-negotiation-guide',
        title: '연봉 협상 가이드',
        type: 'guide',
        similarity: 0.75,
      },
    ],
    status: 'published',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    tags: ['연봉', '월급', '시급', '세금', '계산기'],
    jsonLd: {
      '@type': 'SoftwareApplication',
      name: '연봉 계산기',
      description: '연봉, 월급, 시급을 서로 변환하고 세금을 계산하는 정확한 계산기',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'KRW',
      },
    },
  },
};

interface UtilityPageProps {
  params: Promise<{ slug: string }>;
}

// SEO 메타데이터 생성
export async function generateMetadata({ params }: UtilityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const utility = mockUtilityData[slug];

  if (!utility) {
    return {
      title: '계산기를 찾을 수 없습니다',
    };
  }

  return {
    title: utility.seoTitle,
    description: utility.seoDescription,
    keywords: utility.tags.join(', '),
    openGraph: {
      title: utility.seoTitle,
      description: utility.seoDescription,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: utility.seoTitle,
      description: utility.seoDescription,
    },
  };
}

export default async function UtilityPage({ params }: UtilityPageProps) {
  const { slug } = await params;
  const utility = mockUtilityData[slug];

  if (!utility) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">계산기를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-6">
          요청하신 계산기가 존재하지 않거나 삭제되었을 수 있습니다.
        </p>
        <Button asChild>
          <Link href="/utility">
            <ArrowLeft className="mr-2 h-4 w-4" />
            계산기 목록으로 돌아가기
          </Link>
        </Button>
      </div>
    );
  }

  // 임시 계산 함수 - 실제로는 API 호출
  const handleCalculate = async (inputs: Record<string, any>) => {
    // 간단한 연봉 계산 로직 (실제로는 더 복잡한 계산 필요)
    const { annualSalary, monthlySalary, hourlyWage, workHours = 8, workDays = 22 } = inputs;

    let calculatedAnnualSalary = annualSalary || (monthlySalary * 12) || (hourlyWage * workHours * workDays * 12);
    let calculatedMonthlySalary = monthlySalary || (calculatedAnnualSalary / 12);
    let calculatedHourlyWage = hourlyWage || (calculatedMonthlySalary / workDays / workHours);

    // 간단한 세금 계산 (실제로는 누진세 계산 필요)
    const taxRate = calculatedAnnualSalary > 50000000 ? 0.22 : calculatedAnnualSalary > 30000000 ? 0.15 : 0.08;
    const estimatedTax = Math.round(calculatedAnnualSalary * taxRate);
    const takeHomePay = Math.round(calculatedMonthlySalary - (estimatedTax / 12));

    return {
      calculatedAnnualSalary: Math.round(calculatedAnnualSalary),
      monthlySalary: Math.round(calculatedMonthlySalary),
      hourlyWage: Math.round(calculatedHourlyWage),
      estimatedTax,
      takeHomePay,
    };
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/utility" className="hover:text-foreground">계산기</Link>
          <span>/</span>
          <span>{utility.title}</span>
        </div>

        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">{utility.title}</h1>
            <p className="text-xl text-muted-foreground">{utility.summary}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">4.8</span>
              <span className="text-muted-foreground">(2,450)</span>
            </div>
            <Badge variant="secondary">{utility.category}</Badge>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 계산기 */}
        <div className="lg:col-span-2">
          <UtilityCalculator
            inputs={utility.inputs}
            outputs={utility.outputs}
            formulaKey={utility.formulaKey}
            onCalculate={handleCalculate}
          />
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 정보 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">계산기 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">카테고리</span>
                <Badge variant="outline">{utility.category}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">버전</span>
                <span className="font-medium">{utility.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">사용 횟수</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium">12.5K</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 출처 */}
          {utility.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">출처 및 참고</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {utility.sources.map((source, index) => (
                    <li key={index}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <span>{source.name}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      {source.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {source.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* 관련 콘텐츠 */}
          {utility.related.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">관련 콘텐츠</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {utility.related.map((related) => (
                    <li key={related.slug}>
                      <Link
                        href={`/${related.type}/${related.slug}`}
                        className="block hover:bg-muted p-2 rounded-md transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {related.type === 'utility' ? '계산기' : related.type === 'guide' ? '가이드' : '블로그'}
                          </Badge>
                          <span className="text-sm font-medium line-clamp-2">
                            {related.title}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* FAQ 섹션 */}
      {utility.faq.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>자주 묻는 질문</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {utility.faq.map((faq, index) => (
                <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <h3 className="font-medium mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
