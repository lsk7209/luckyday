/**
 * Main Layout 컴포넌트
 * @description 전체 페이지의 기본 레이아웃 구조
 */
import { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  className?: string;
}

/**
 * MainLayout: 헤더와 푸터를 포함한 기본 레이아웃
 * @param children - 메인 콘텐츠
 * @param showFooter - 푸터 표시 여부 (기본값: true)
 * @param className - 추가 CSS 클래스
 */
export default function MainLayout({
  children,
  showFooter = true,
  className = '',
}: MainLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
