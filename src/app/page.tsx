/**
 * DreamScope 홈페이지
 * @description 꿈 해몽 사이트 메인 페이지 - 검색, 카테고리, AI 해몽 CTA
 */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Heart, Smile, Building2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AdSlot from '@/components/shared/ad-slot';
import Image from 'next/image';

/**
 * 카테고리 데이터
 */
const categories = [
  { 
    name: '동물', 
    description: '동물 꿈의 상징적 의미', 
    icon: Heart,
    href: '/dream?category=animal'
  },
  { 
    name: '감정', 
    description: '꿈 속 감정 해석', 
    icon: Smile,
    href: '/dream?category=emotion'
  },
  { 
    name: '상황', 
    description: '일상적인 꿈 시나리오', 
    icon: Building2,
    href: '/dream?category=situation'
  },
  { 
    name: '색상', 
    description: '색깔별 꿈 해몽', 
    icon: Palette,
    href: '/dream?category=color'
  },
];

/**
 * 최신 해몽 및 인사이트 아티클 데이터
 */
const latestArticles = [
  {
    id: 'water-dream',
    category: '상징',
    title: '물 꿈 해몽 | 감정의 깊이와 흐름',
    description: '물 꿈은 감정과 무의식의 상태를 비춥니다. 바다·강·호수 등 장면에 따라 의미가 달라집니다.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2QNx_Mfi02xtS_5RIjmIe17ltz0s6d-kbLMJq89zKZCpiMRULuQQa00-VzJ2orj8z1UBREcpo8MHHmapN0o_bXbOa3kJxyrxfICPEWobvH129nxgLF_OzSD8HcJ3-S_LcOwb86Bzy1dzMKomIMyX7pN4I0EDshbVpEqEDr6yvybFVPWOjN6FJMAplvnpPJJPZ9juxPDiVqrUHhVmVeDF8QL8VZ5NaLjBLsPesXRFS0gBQrOD_FIvXXae_WXqpIbjTnNex0_W0uYE',
    href: '/dream/water-dream',
  },
  {
    id: 'snake-dream',
    category: '상징',
    title: '뱀 꿈 해몽 | 변화와 두려움, 재생의 신호',
    description: '뱀 꿈은 욕망과 두려움이 교차하는 상징으로, 변화를 준비하라는 무의식의 신호일 수 있습니다.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK2mAn6TQkGYw8rXepu_bv3hbugubd2FXEGBCOFVUaysSgCEQH-Gjq-aSspQ3RDibfUmQG3x7F4VoG0ja7wbDeMbUfCYxTUCFriwa3VyAFH0vYVMe36SoHSiATCGiEVqGGPQ-v2AuhQo1_8I1g59wV1V3LDVfxz4FvTqWj7N6QYZexk_v0n7v0lB4yXhVER44qUx5QS6jX1vMCUMAJvxSu-KIWTDQdzHe08VrAdIPysjkZwdiD2SsaRSTG53yP9BvfUr4Ks3P9_AI',
    href: '/dream/snake-dream',
  },
  {
    id: 'pregnancy-dream',
    category: '상황',
    title: '임신 꿈 해몽 | 시작·창조·책임의 상징',
    description: '임신 꿈은 새로운 가능성과 책임의 탄생을 비춥니다. 설렘과 불안이 함께 올 수 있습니다.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrh5Ks3l8DofDkyT7gZdCiRoXIRm-jUBhWD4aDy1Na_i4CY3NKgQKMF79lWo77b_WThWMHqGNjq1WUMFq4S3cI6sAk3DBLyMoB7QWyrWzVUWy_JIDzVG76TjMb3sEdkDiITWvQMvUN8f9AZ5HMKAIQE_AKictuvEbrYKe4HE1EdZn3j9YQNNfQgb-7W8f0YJBaXb4Qi5g15u17ew3btQ7lBl5Ut9m1d_P602j_jvIgL56nu7qy_SX_bjFX8yn83ZmANueIyAPKo1E',
    href: '/dream/pregnancy-dream',
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  // 검색 처리
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/dream?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <main className="flex-grow">
        <div className="container mx-auto flex flex-col items-center px-4 py-5">
          <div className="flex w-full max-w-5xl flex-col">
            {/* Hero Section */}
            <section className="w-full py-16 sm:py-24">
              <div className="flex flex-col items-center justify-center gap-6 text-center">
                <div className="flex flex-col gap-2">
                  <h1 className="text-4xl font-black leading-tight tracking-tighter text-slate-900 sm:text-5xl dark:text-slate-50">
                    어떤 꿈을 꾸셨나요?
                  </h1>
                  <h2 className="text-base font-normal leading-normal text-slate-600 sm:text-lg dark:text-slate-400">
                    꿈 속 숨겨진 의미를 발견하세요
                  </h2>
                </div>
                
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex h-14 w-full max-w-xl flex-col sm:h-16">
                  <div className="flex h-full w-full flex-1 items-stretch rounded-lg shadow-sm border border-slate-300 dark:border-slate-700">
                    <div className="flex items-center justify-center rounded-l-lg bg-slate-50 dark:bg-slate-800 pl-4 text-slate-500 dark:text-slate-400">
                      <Search className="h-6 w-6" />
                    </div>
                    <Input
                      type="search"
                      placeholder="예: 물 꿈, 이빨 빠지는 꿈, 뱀 꿈"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-full min-w-0 flex-1 resize-none overflow-hidden border-y border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-base font-normal leading-normal text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:outline-0 focus:ring-1 focus:ring-primary"
                    />
                    <div className="flex items-center justify-center rounded-r-lg bg-slate-50 dark:bg-slate-800 pr-2 border-y border-r border-slate-300 dark:border-slate-700">
                      <Button 
                        type="submit"
                        className="flex h-10 min-w-[84px] items-center justify-center overflow-hidden rounded-md bg-primary px-4 text-sm font-bold leading-normal tracking-wide text-white transition-colors hover:bg-primary/90 sm:h-12 sm:px-5 sm:text-base"
                      >
                        <span className="truncate">검색</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </section>

            {/* Category Cards */}
            <section className="w-full py-8">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Link key={category.name} href={category.href}>
                      <Card className="flex flex-1 cursor-pointer flex-col gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-primary/50 h-full">
                        <IconComponent className="h-8 w-8 text-primary" />
                        <div className="flex flex-col gap-1">
                          <h2 className="text-base font-bold leading-tight text-slate-900 dark:text-slate-50">
                            {category.name}
                          </h2>
                          <p className="text-sm font-normal leading-normal text-slate-500 dark:text-slate-400">
                            {category.description}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* AI Interpretation Banner */}
            <section className="w-full py-8">
              <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-transparent bg-primary/5 dark:bg-primary/10 p-6 sm:flex-row sm:items-center">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-bold leading-tight text-slate-900 dark:text-slate-50">
                    AI 꿈 해몽 받아보기
                  </p>
                  <p className="text-base font-normal leading-normal text-slate-600 dark:text-slate-400">
                    개인 맞춤형 심리 분석으로 꿈의 의미를 알아보세요
                  </p>
                </div>
                <Button 
                  asChild
                  className="flex h-10 min-w-[84px] items-center justify-center overflow-hidden whitespace-nowrap rounded-lg bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  <Link href="/ai">
                    <span className="truncate">무료로 해몽 받기</span>
                  </Link>
                </Button>
              </div>
            </section>

            {/* Advertisement Section */}
            <section className="w-full py-8">
              <div className="flex min-h-[100px] w-full items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900">
                <AdSlot slot="homepage-ad" />
              </div>
            </section>

            {/* Latest Interpretations & Insights */}
            <section className="w-full py-8">
              <h2 className="px-0 pb-4 pt-0 text-2xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
                최신 해몽과 인사이트
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latestArticles.map((article) => (
                  <Link key={article.id} href={article.href}>
                    <Card className="flex cursor-pointer flex-col overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-shadow hover:shadow-lg">
                      <div className="relative h-48 w-full">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="flex flex-col gap-2 p-4">
                        <Badge variant="secondary" className="text-xs font-semibold uppercase tracking-wider text-primary w-fit">
                          {article.category}
                        </Badge>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                          {article.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {article.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
