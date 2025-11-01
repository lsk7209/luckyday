/**
 * 블로그 상세 페이지
 * @description 블로그 포스트의 상세 내용 표시
 */
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import TableOfContents from '@/components/blog/table-of-contents';
import FAQSection from '@/components/shared/faq-section';
import RelatedContent from '@/components/shared/related-content';
import { BlogContent } from '@/types/content';

// 임시 데이터 - 실제로는 API에서 가져올 예정
const mockBlogData: Record<string, BlogContent> = {
  'salary-negotiation-guide': {
    id: '1',
    type: 'blog',
    slug: 'salary-negotiation-guide',
    title: '연봉 협상 시 고려해야 할 5가지 포인트',
    summary: '연봉 협상을 성공적으로 이끌어내기 위한 전략과 실전 팁을 알아보세요.',
    seoTitle: '연봉 협상 가이드: 성공을 위한 5가지 핵심 포인트 | CMS Blog',
    seoDescription: '연봉 협상을 위한 완벽 가이드. 타이밍, 준비사항, 협상 전략 등 실무에 바로 적용 가능한 노하우를 소개합니다.',
    date: new Date('2024-01-15'),
    readingMinutes: 8,
    body: `# 연봉 협상 시 고려해야 할 5가지 포인트

연봉 협상은 커리어에서 가장 중요한 순간 중 하나입니다. 올바른 전략과 준비로 성공적인 결과를 이끌어낼 수 있습니다.

## 1. 타이밍을 정확히 파악하라

연봉 협상의 적절한 시기는 다음과 같습니다:

- **입사 전**: 채용 제안을 받았을 때
- **성과급 시즌**: 연말이나 반기 평가 후
- **프로모션 시**: 직급이 올라갈 때
- **시장 상황 개선시**: 회사 실적이 좋을 때

## 2. 충분한 준비를 하라

협상 전 반드시 준비해야 할 것들:

### 자신의 가치 평가
- 현재 업무 성과
- 담당 업무의 난이도와 범위
- 시장 내 자신의 경쟁력

### 회사 정보 수집
- 회사의 재무 상태
- 동종 업계 평균 연봉
- 회사의 연봉 인상율

## 3. 구체적인 숫자를 제시하라

추상적인 표현 대신 구체적인 숫자를 사용하세요:

❌ "좀 더 주셨으면 좋겠어요"
✅ "현재 4,500만원인데 5,200만원으로 조정 부탁드립니다"

## 4. 상대방의 입장을 고려하라

협상은 양방향 커뮤니케이션입니다:

- **관리자의 입장**: 예산, 회사 정책, 형평성
- **인사팀의 입장**: 급여 테이블, 보상 정책
- **대표의 입장**: 회사 전체 인건비 영향

## 5. B Plan을 준비하라

협상이 결렬될 경우를 대비한 대안:

- **현재 회사 잔류**: 승진이나 복리후생 개선 요구
- **이직 고려**: 다른 회사 오퍼 준비
- **시간 끌기**: 추후 재협상 예약

## 결론

연봉 협상은 단순히 금액을 높이는 것 이상의 의미가 있습니다. 자신의 가치를 인정받고, 회사와의 관계를 돈독히 하는 기회입니다.`,
    tags: ['연봉', '협상', '커리어', '급여'],
    faq: [
      {
        question: '연봉 협상은 언제 하는 게 좋나요?',
        answer: '입사 제안 시, 연말 평가 후, 프로모션 시, 회사 실적이 좋을 때가 적절합니다. 이직을 고려할 때는 반드시 현재 연봉을 기준으로 협상하세요.',
      },
      {
        question: '얼마를 요구하는 게 적절할까요?',
        answer: '현재 연봉의 20-30% 인상을 목표로 하되, 자신의 성과와 시장 상황을 고려하세요. 너무 높게 요구하면 오히려 역효과가 날 수 있습니다.',
      },
      {
        question: '협상에서 거절당하면 어떻게 하나요?',
        answer: '거절 시 B Plan을 실행하세요. 승진, 추가 휴가, 업무 경감 등의 대안을 제시하거나, 다른 회사 오퍼를 준비하여 재협상에 나서세요.',
      },
    ],
    related: [
      {
        slug: 'salary-calculator',
        title: '연봉 계산기',
        type: 'utility',
        similarity: 0.9,
        summary: '연봉을 월급, 시급으로 변환하고 세금을 계산해보세요.',
      },
      {
        slug: 'tax-calculator',
        title: '세금 계산기',
        type: 'utility',
        similarity: 0.7,
        summary: '근로소득세와 지방소득세를 계산해보세요.',
      },
      {
        slug: 'career-development-guide',
        title: '커리어 개발 가이드',
        type: 'guide',
        similarity: 0.8,
        summary: '장기적인 커리어 플랜 수립 방법을 알아보세요.',
      },
    ],
    status: 'published',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    jsonLd: {
      '@type': 'BlogPosting',
      headline: '연봉 협상 시 고려해야 할 5가지 포인트',
      description: '연봉 협상을 위한 완벽 가이드. 타이밍, 준비사항, 협상 전략 등 실무에 바로 적용 가능한 노하우를 소개합니다.',
      datePublished: '2024-01-15',
      dateModified: '2024-01-15',
      author: {
        '@type': 'Organization',
        name: 'CMS Calculator',
      },
      publisher: {
        '@type': 'Organization',
        name: 'CMS Calculator',
        logo: {
          '@type': 'ImageObject',
          url: 'https://example.com/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://example.com/blog/salary-negotiation-guide',
      },
    },
  },
};

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

// SEO 메타데이터 생성
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = mockBlogData[slug];

  if (!blog) {
    return {
      title: '블로그 포스트를 찾을 수 없습니다',
    };
  }

  return {
    title: blog.seoTitle,
    description: blog.seoDescription,
    keywords: blog.tags.join(', '),
    authors: [{ name: 'CMS Team' }],
    openGraph: {
      title: blog.seoTitle,
      description: blog.seoDescription,
      type: 'article',
      publishedTime: blog.date.toISOString(),
      modifiedTime: blog.updatedAt.toISOString(),
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.seoTitle,
      description: blog.seoDescription,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = mockBlogData[slug];

  if (!blog) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">블로그 포스트를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-6">
          요청하신 블로그 포스트가 존재하지 않거나 삭제되었을 수 있습니다.
        </p>
        <Button asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            블로그 목록으로 돌아가기
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
          <Link href="/blog" className="hover:text-foreground">블로그</Link>
          <span>/</span>
          <span>{blog.title}</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {blog.title}
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed">
            {blog.summary}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={blog.date.toISOString()}>
                {blog.date.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{blog.readingMinutes}분 읽기</span>
            </div>

            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>CMS Team</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 목차 - 데스크톱 사이드바 */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24 space-y-6">
            <TableOfContents content={blog.body} />
          </div>
        </div>

        {/* 본문 */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <Card>
            <CardContent className="p-8">
              <article className="prose prose-lg max-w-none dark:prose-invert">
                {/* 마크다운 콘텐츠를 HTML로 변환하는 로직이 필요 */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: blog.body
                      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                      .replace(/\*(.*)\*/gim, '<em>$1</em>')
                      .replace(/\n\n/gim, '</p><p>')
                      .replace(/\n/gim, '<br>')
                      .replace(/^/, '<p>')
                      .replace(/$/, '</p>')
                      .replace(/<p><\/p>/g, '')
                      .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1'),
                  }}
                />
              </article>
            </CardContent>
          </Card>
        </div>

        {/* 관련 콘텐츠 - 데스크톱 사이드바 */}
        <div className="lg:col-span-1 order-3">
          <div className="sticky top-24 space-y-6">
            <RelatedContent items={blog.related} />
          </div>
        </div>
      </div>

      {/* FAQ 섹션 */}
      <FAQSection faqs={blog.faq} />

      {/* 네비게이션 */}
      <div className="flex justify-between items-center pt-8 border-t">
        <Button variant="outline" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            블로그 목록
          </Link>
        </Button>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            공유하기
          </Button>
          <Button variant="outline" size="sm">
            북마크
          </Button>
        </div>
      </div>
    </div>
  );
}

// output: 'export' 모드용 정적 파라미터 생성
export async function generateStaticParams() {
  // 실제로는 데이터베이스나 API에서 가져올 예정
  const slugs = ['salary-negotiation-guide', 'work-life-balance', 'career-development'];

  return slugs.map((slug) => ({
    slug: slug,
  }));
}