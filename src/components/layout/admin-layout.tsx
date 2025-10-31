/**
 * 관리자 레이아웃 컴포넌트
 * @description 관리자 콘솔 전용 레이아웃
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Calculator,
  Search,
  BarChart3,
  Settings,
  Link as LinkIcon,
  Palette,
  Zap,
  Shield,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: '대시보드',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: '콘텐츠 관리',
    href: '/admin/content',
    icon: FileText,
    children: [
      { name: '블로그', href: '/admin/content/blog' },
      { name: '가이드', href: '/admin/content/guide' },
      { name: '계산기', href: '/admin/content/utility' },
    ],
  },
  {
    name: 'SEO & 색인',
    href: '/admin/seo',
    icon: Search,
    children: [
      { name: '메타 관리', href: '/admin/seo/meta' },
      { name: '사이트맵', href: '/admin/seo/sitemaps' },
      { name: '색인 현황', href: '/admin/seo/indexing' },
      { name: '캐노니컬', href: '/admin/seo/canonical' },
    ],
  },
  {
    name: '프로그래매틱 SEO',
    href: '/admin/pseo',
    icon: Zap,
    children: [
      { name: '엔티티', href: '/admin/pseo/entities' },
      { name: '모디파이어', href: '/admin/pseo/modifiers' },
      { name: '로케일', href: '/admin/pseo/locale' },
      { name: '규칙', href: '/admin/pseo/rules' },
    ],
  },
  {
    name: '분석',
    href: '/admin/analytics',
    icon: BarChart3,
    children: [
      { name: '개요', href: '/admin/analytics/overview' },
      { name: '채널', href: '/admin/analytics/channels' },
      { name: '키워드', href: '/admin/analytics/keywords' },
      { name: '페이지', href: '/admin/analytics/pages' },
      { name: '퍼널', href: '/admin/analytics/funnels' },
    ],
  },
  {
    name: '추적',
    href: '/admin/tracking',
    icon: Shield,
    children: [
      { name: '스크립트', href: '/admin/tracking/scripts' },
      { name: '채널 규칙', href: '/admin/tracking/channels' },
      { name: '동의 관리', href: '/admin/tracking/consent' },
    ],
  },
  {
    name: '내부 링크',
    href: '/admin/links',
    icon: LinkIcon,
    children: [
      { name: '링크 그래프', href: '/admin/links/graph' },
      { name: '깨진 링크', href: '/admin/links/broken' },
    ],
  },
  {
    name: '외관',
    href: '/admin/appearance',
    icon: Palette,
    children: [
      { name: '테마', href: '/admin/appearance/theme' },
      { name: '네비게이션', href: '/admin/appearance/nav' },
      { name: '위젯', href: '/admin/appearance/widgets' },
    ],
  },
  {
    name: '통합',
    href: '/admin/integrations',
    icon: Settings,
    children: [
      { name: 'GSC', href: '/admin/integrations/gsc' },
      { name: 'GA4', href: '/admin/integrations/ga4' },
      { name: '네이버', href: '/admin/integrations/naver' },
      { name: '슬랙', href: '/admin/integrations/slack' },
    ],
  },
  {
    name: '작업 & 로그',
    href: '/admin/jobs',
    icon: Zap,
    children: [
      { name: '자동화', href: '/admin/jobs/automation' },
      { name: '색인', href: '/admin/jobs/index' },
      { name: '알림', href: '/admin/jobs/alerts' },
    ],
  },
  {
    name: '설정',
    href: '/admin/settings',
    icon: Settings,
    children: [
      { name: '테넛', href: '/admin/settings/tenant' },
      { name: 'ads.txt', href: '/admin/settings/ads' },
      { name: 'robots.txt', href: '/admin/settings/robots' },
      { name: '개인정보', href: '/admin/settings/privacy' },
    ],
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 모바일 사이드바 오버레이 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed && 'lg:w-16'
        )}
      >
        {/* 사이드바 헤더 */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/admin" className="flex items-center space-x-2">
            <Calculator className="h-6 w-6" />
            {!sidebarCollapsed && (
              <span className="font-bold">CMS Admin</span>
            )}
          </Link>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => (
              <li key={item.name}>
                <div className="space-y-1">
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                      isActive(item.href)
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground',
                      sidebarCollapsed && 'justify-center px-2'
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={cn('h-4 w-4', !sidebarCollapsed && 'mr-3')} />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>

                  {/* 서브메뉴 */}
                  {item.children && !sidebarCollapsed && (
                    <ul className="ml-6 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link
                            href={child.href}
                            className={cn(
                              'block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                              isActive(child.href)
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground'
                            )}
                            onClick={() => setSidebarOpen(false)}
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* 메인 콘텐츠 */}
      <div
        className={cn(
          'lg:pl-64 transition-all duration-300',
          sidebarCollapsed && 'lg:pl-16'
        )}
      >
        {/* 모바일 헤더 */}
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/admin" className="flex items-center space-x-2">
            <Calculator className="h-6 w-6" />
            <span className="font-bold">CMS Admin</span>
          </Link>
          <div className="w-10" /> {/* 균형 맞추기용 */}
        </div>

        {/* 페이지 콘텐츠 */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
