import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/main-layout";
import { Providers } from "@/lib/providers";
import { ErrorBoundary } from "@/components/error-boundary";
// import { PWAInstallPrompt } from "@/components/pwa"; // 앱 설치 메시지 제거

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "꿈해몽 AI | 꿈 해석 의미 찾기",
    template: "%s | 꿈해몽 AI"
  },
  description: "꿈해몽 AI로 꿈의 의미를 정확하게 해석하세요. 200개 이상의 꿈 사전과 AI 분석으로 뱀 꿈, 이빨 꿈 등 다양한 꿈 해몽을 제공합니다.",
  keywords: ["꿈해몽", "꿈해석", "꿈의의미", "꿈풀이", "AI꿈해몽", "꿈사전", "뱀꿈", "이빨꿈", "꿈분석"],
  authors: [{ name: "럭키데이" }],
  creator: "럭키데이",
  publisher: "럭키데이",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://luckyday.app'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://luckyday.app',
    title: '럭키데이 - AI 꿈 해몽',
    description: 'AI 기반 꿈 해몽 서비스 - 심리학·문화·상징학으로 꿈을解读',
    siteName: '럭키데이',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '럭키데이 - AI 꿈 해몽',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '럭키데이 - AI 꿈 해몽',
    description: 'AI 기반 꿈 해몽 서비스 - 심리학·문화·상징학으로 꿈을解读',
    images: ['/og-image.png'],
    creator: '@luckyday_app',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#000000' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '럭키데이',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': '럭키데이',
    'application-name': '럭키데이',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3050601904412736"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css"
        />
      </head>
      <body
        className={`${inter.variable} font-pretendard antialiased`}
        style={{ fontFamily: 'Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
      >
        <ErrorBoundary>
          <Providers>
            <MainLayout>
              {children}
            </MainLayout>
            {/* <PWAInstallPrompt /> 앱 설치 메시지 제거 */}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
