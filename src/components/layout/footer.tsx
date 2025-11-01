/**
 * Footer 컴포넌트
 * @description DreamScope 사이트 푸터 및 링크 모음
 */
import Link from 'next/link';
import { Moon, Brain, BookOpen, FileText, Search, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    서비스: [
      { name: '꿈 사전', href: '/dream', icon: BookOpen },
      { name: 'AI 해몽', href: '/ai', icon: Brain },
      { name: '북마크', href: '/bookmarks', icon: Search },
    ],
    회사: [
      { name: '소개', href: '/about' },
      { name: '개인정보처리방침', href: '/privacy' },
      { name: '이용약관', href: '/terms' },
      { name: '문의하기', href: '/contact' },
    ],
    리소스: [
      { name: '꿈 심리학', href: '/psychology' },
      { name: '꿈 상징학', href: '/symbolism', icon: FileText },
      { name: '꿈 통계', href: '/statistics' },
    ],
  };

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Moon className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">DreamScope</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI 기반 꿈 해몽 서비스 - 심리학·문화·상징학으로 꿈을解读
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
              © {currentYear} DreamScope. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Powered by Next.js & Cloudflare</span>
              <span>•</span>
              <span>v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
