/**
 * 관리자 레이아웃
 * @description 관리자 콘솔 전용 레이아웃 적용
 */
import { Metadata } from 'next';
import AdminLayout from '@/components/layout/admin-layout';

export const metadata: Metadata = {
  title: '관리자 콘솔 - CMS Calculator',
  description: 'CMS 관리자 콘솔 - 콘텐츠, SEO, 분석, 설정 관리',
  robots: 'noindex, nofollow', // 관리자 페이지는 검색엔진에 노출하지 않음
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
