import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fontsource/pretendard/400.css";
import "@fontsource/pretendard/500.css";
import "@fontsource/pretendard/600.css";
import "@fontsource/pretendard/700.css";
import MainLayout from "@/components/layout/main-layout";
import { Providers } from "@/lib/providers";
import { ErrorBoundary } from "@/components/error-boundary";
import { PWAInstallPrompt } from "@/components/pwa";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DreamScope - AI 꿈 해몽",
    template: "%s | DreamScope"
  },
  description: "AI 기반 꿈 해몽 서비스 - 심리학·문화·상징학으로 꿈을解读. 5,000개 이상의 꿈 사전과 개인 맞춤 AI 분석으로 당신의 꿈을 정확하게 해석합니다.",
  keywords: ["꿈해몽", "꿈풀이", "AI해몽", "심리학", "상징학", "꿈사전", "꿈해석", "꿈분석"],
  authors: [{ name: "DreamScope Team" }],
  creator: "DreamScope",
  publisher: "DreamScope",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dreamscope.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://dreamscope.app',
    title: 'DreamScope - AI 꿈 해몽',
    description: 'AI 기반 꿈 해몽 서비스 - 심리학·문화·상징학으로 꿈을解读',
    siteName: 'DreamScope',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DreamScope - AI 꿈 해몽',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DreamScope - AI 꿈 해몽',
    description: 'AI 기반 꿈 해몽 서비스 - 심리학·문화·상징학으로 꿈을解读',
    images: ['/og-image.png'],
    creator: '@dreamscope_app',
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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#000000' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DreamScope',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'DreamScope',
    'application-name': 'DreamScope',
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
      <body
        className={`${inter.variable} font-pretendard antialiased`}
        style={{ fontFamily: 'Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
      >
        <ErrorBoundary>
          <Providers>
            <MainLayout>
              {children}
            </MainLayout>
            <PWAInstallPrompt />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
