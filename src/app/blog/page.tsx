/**
 * DreamScope Blog 페이지
 * @description 블로그 포스트 목록 - HTML 디자인 반영
 */
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AdSlot from '@/components/shared/ad-slot';

/**
 * 블로그 카테고리
 */
const CATEGORIES = ['All Posts', 'Psychology', 'Symbolism', 'Culture', 'Sleep Science'];

/**
 * 블로그 포스트 데이터 (임시 - 실제로는 API에서 가져올 예정)
 */
const BLOG_POSTS = [
  {
    id: 'archetypes-in-dreams',
    slug: 'archetypes-in-dreams',
    category: 'Psychology',
    title: 'The Role of Archetypes in Dreams',
    description: 'Discover Carl Jung\'s theory of archetypes and how universal symbols appear in our nightly visions.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR5NNf4abyUQmukO5Lq-TCUVEbsgrHm2rdFllKBNj1QLYgYwkYpHAkIGIa59YImUh9W7MT2C2_kww2dy4kWgXA_G1eCo-9u-5w3bN_S9NKV49DNO2qv2l5KOsFTaaLIQhKruqdJ04xQPNzeTO2bP8enhQth266MQ0VN25aXl_VOIU_g5MgWX1dJLcZ4q4aSeeB4Ss1DcgQTrBafgzzsfJbAGnk_MfqyCS6Set-NiFptTVwMH_paq-DcgAKLCTTBSf00EPvbJi0LPY',
  },
  {
    id: 'decoding-subconscious',
    slug: 'decoding-subconscious',
    category: 'Symbolism',
    title: 'Decoding the Language of Your Subconscious',
    description: 'Learn how psychological frameworks can help you understand the messages hidden in your dreams.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyNuAGVtrRWKMAo7xPNwYGTn7_Qmo7tYlp9ZMNCjseY_mJV0LD8T4N39tKUkifY6oeowEKX3ZaQfH8tZCKgMYMVOhuWNAOjeT2eFhtrL7QNzf712QdA3OuBfHPsIQwvrDNZLs5KDGKMlVV90IqKzTPLGP3Jdu-GiWgMhFbKE8syFg40NGP8Mj_6XxZx2MVriaXvnJSFTpOUAQWQgig_VYIMxgDuN-_vyBTOIp_V1fPQpwgs7DIV1kUb5oVH1FtT54hgWk6K_p1BxM',
  },
  {
    id: 'cultural-interpretations',
    slug: 'cultural-interpretations',
    category: 'Culture',
    title: 'Cultural Interpretations of Common Dreams',
    description: 'Explore how different cultures view universal dream symbols, from falling teeth to flying.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKvZcqNuN9OvZ_v6y_2Q-m5HcB-Q3PJP43-Ak7rd7rqtZWXJCbOFZ3EwnnWtT--VWEBo5LOFxxI_hIdpYtS5LeR4A00j3S5ZjUFC4gGfQqAYB8ZCdXhEfnSSiA7EtvhGF7h4SW6dKCXO7tOiYOaKAHOi_KYCU6Gu_yH4zgtTPbE531xYahBUpcUn5LkcQrW3yuB4ln30UNZH1oZ51AZFY6X7bPT0cbC9qbl38-uEZoIVAgWZ8JHgcUBY9oxeoHCNIsGVRpXSehawg',
  },
  {
    id: 'sleep-science-dreaming',
    slug: 'sleep-science-dreaming',
    category: 'Sleep Science',
    title: 'Sleep Science and Its Impact on Dreaming',
    description: 'The connection between sleep cycles, brain activity, and the vividness of your dreams.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2g18B0Ri1bICNZ6WEUntndSMVURWb-9Qz_7fea_4UwWZ6D8yt_67x-Hoz5XYqbwXgJIS5hKTlX8ZqrFpPO_J0BmRNv_ZgTnucNdzvABCUS1gYXmyxj5gIQzQRU4c9O2yu-TTpmApceXv3eCZCWOZTgX08u_BeVAAM75E1bMxoIj0OsCWU8e_N_tvNl3bfmASWWgt1OJEJlkdn4ZH0jNViANMAh3rdlsCExf-rk9i8DC8S87P5x-zERwDmEI7toPM_gYft1GY1AyM',
  },
  {
    id: 'dream-journal',
    slug: 'dream-journal',
    category: 'Symbolism',
    title: 'How to Keep a Dream Journal Effectively',
    description: 'Practical tips and techniques for recording your dreams to uncover patterns and insights.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApWWB0uD2i470NLEM9c3wpV6ap85-tPKtFucssl7rETMUGXNglGi__EdutGA0tK8MCIlDpij_6Dc4diU512kCQZaLGbQwie82JXApm0tyte4EP8C7kELgp6ITucgT8bFonlPPttIGQejEk9nDXv-gtx3sazSzC7LW-ru5U-P7-Yw24H9O7iqFnYp675yclpjDrhdrI4Zvjsjqw3zHwKzQgwtTwfKUiCVqPEiWeEGDL5JeUAn3-Em1USOy7qUjNE5m9lzGSzZwl098',
  },
  {
    id: 'recurring-dream-themes',
    slug: 'recurring-dream-themes',
    category: 'Psychology',
    title: 'Navigating Recurring Dream Themes',
    description: 'Understand why certain dreams repeat and what they might be trying to tell you about your life.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaz-A5EarY6fdswEdAe-SK_iNXg6NXXXxr6PaQ2mK-YTllOgn2kmJO9x7fPR1EiUb1BEbLSkrcuCfB02dtjzkY5gYWBrIiGOya3h0G_vj2b-OGICCy-2pJt5lfmFxaQtplNENqHuflzUlb7FLHe-cJvGdp2ms5bUylFVfCde1UfKew6f9Ui0BYbo2Fz9j5rtLOpjpxUWGpwTb-DV7tdeQi7Zsls8_FtmbEIGuIY_8oZv3VwukybB0HiBlJBQXoxUP2ktzqkaWttIY',
  },
  {
    id: 'lucid-dreaming',
    slug: 'lucid-dreaming',
    category: 'Sleep Science',
    title: 'Lucid Dreaming: Taking Control of Your Inner World',
    description: 'An introductory guide to achieving lucidity and interacting consciously with your dream environment.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJKIrybJyGaSi0LXUrt14W_ZwA4HzM3KRP0FDs64v9aMd5-d_KIV1R8IAJheNLeODZ1Z2tpaDvuTNNg0bHPOiQqF221fqJHKtMVgbnOYE6cmlu2B5j5enUqoMXSxGQjn3e9EW3AxtAtMEB6u4FJNrUbvRUXSKflVKKUXnT5FgWAsbhacVvv2bDj85qMPNfq5YLhm6MLbBnrvYU1bfgCN31_EK2mrxdxKFQDvtEAsa_VCdwyVKxbOZD44GJvuzFlVOjd7Grlvf8GwY',
  },
  {
    id: 'water-in-dreams',
    slug: 'water-in-dreams',
    category: 'Symbolism',
    title: 'The Meaning Behind Water in Dreams',
    description: 'From calm seas to raging storms, uncover what the presence of water signifies in your dreams.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzGzuv6nzsAUf199iQWZGJg12_PITNwS3z-zhZKCbavLc3-nvKXPkmBP80cUgO72G63ng5bMRNlDVwL1LUZJiesb4RfTSyk8n_ufRp9A4c2QTi5m5moR-hcsMmLcS6Cs8XynOuIhlw_mwGbxaKOa9m0B4G0ZypxH1EcWDk2F1d5uOu7GaGqo5d-emUn9eFV9xP9TUvE3C0xjIgdEe24QiVFGNSDLQWjoSMQcOk8mVNPRgl_DCIXNuxgdOu549PjYwLFdmZzfOKx-Y',
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [page, setPage] = useState(1);
  const pageSize = 9; // 3x3 그리드

  // 카테고리 필터 적용
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All Posts') {
      return BLOG_POSTS;
    }
    return BLOG_POSTS.filter(post => post.category === selectedCategory);
  }, [selectedCategory]);

  // 페이지네이션 적용
  const paginatedPosts = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredPosts.slice(startIndex, startIndex + pageSize);
  }, [filteredPosts, page]);

  // 총 페이지 수 계산
  const totalPages = useMemo(() => {
    return Math.ceil(filteredPosts.length / pageSize);
  }, [filteredPosts]);

  // 페이지네이션 페이지 번호 계산
  const paginationPages = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2, 3, '...', totalPages);
    }
    return pages;
  }, [totalPages]);

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="flex-1">
        <div className="mx-auto flex max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
          <main className="py-12 md:py-16">
            {/* Hero Section */}
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
                The DreamScope Blog
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Exploring the Psychology and Symbolism of Our Inner Worlds
              </p>
            </div>

            {/* Category Filters */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-9 shrink-0 rounded-full px-4 text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-slate-50 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setPage(1);
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post, index) => {
                // 3개 포스트 후 (4번째 위치) 광고 삽입
                if (index === 3) {
                  return (
                    <div key={`ad-${index}`} className="flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 shadow-md sm:col-span-2 lg:col-span-1" style={{ minHeight: '240px' }}>
                      <AdSlot slot="blog-ad" />
                    </div>
                  );
                }

                return (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="group flex transform flex-col overflow-hidden rounded-lg bg-white dark:bg-slate-900 shadow-md transition-transform duration-300 hover:-translate-y-1">
                      <div className="relative aspect-video w-full bg-cover bg-center">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                          {post.category}
                        </p>
                        <h3 className="flex-1 text-lg font-bold leading-snug text-slate-900 dark:text-slate-50 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                          {post.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                );
              })}
              
              {/* 광고가 표시되지 않은 경우 추가 (3개 미만일 때) */}
              {paginatedPosts.length === 3 && (
                <div className="flex items-center justify-center rounded-lg bg-white dark:bg-slate-900 shadow-md sm:col-span-2 lg:col-span-1" style={{ minHeight: '240px' }}>
                  <AdSlot slot="blog-ad" />
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex items-center justify-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {paginationPages.map((pageNum, idx) => (
                pageNum === '...' ? (
                  <span key={`ellipsis-${idx}`} className="flex h-9 w-9 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                    ...
                  </span>
                ) : (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'default' : 'ghost'}
                    size="icon"
                    className={`h-9 w-9 rounded-full text-sm font-bold transition-colors ${
                      page === pageNum
                        ? 'bg-primary text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setPage(pageNum as number)}
                  >
                    {pageNum}
                  </Button>
                )
              ))}

              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

