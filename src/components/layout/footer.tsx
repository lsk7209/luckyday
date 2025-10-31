/**
 * Footer 컴포넌트
 * @description 사이트 푸터 및 링크 모음
 */
import Link from 'next/link';
import { Calculator, BookOpen, FileText, Search, Github, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    서비스: [
      { name: '계산기', href: '/utility', icon: Calculator },
      { name: '가이드', href: '/guide', icon: BookOpen },
      { name: '블로그', href: '/blog', icon: FileText },
      { name: '통합 검색', href: '/search', icon: Search },
    ],
    회사: [
      { name: '소개', href: '/about' },
      { name: '개인정보처리방침', href: '/privacy' },
      { name: '이용약관', href: '/terms' },
      { name: '문의하기', href: '/contact' },
    ],
    개발자: [
      { name: 'API 문서', href: '/api-docs' },
      { name: '개발자 가이드', href: '/developer' },
      { name: 'GitHub', href: 'https://github.com', icon: Github, external: true },
    ],
  };

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-6 w-6" />
              <span className="font-bold text-lg">CMS Calculator</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              워드프레스보다 빠르고, 자동으로 색인되는 생활형 계산기 CMS 솔루션
            </p>
            <div className="flex space-x-2">
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="font-semibold">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                    >
                      {link.icon && <link.icon className="h-3 w-3" />}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} CMS Calculator. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Powered by Next.js & Cloudflare</span>
              <span>•</span>
              <span>v5.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
