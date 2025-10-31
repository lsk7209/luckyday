import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fontsource/pretendard/400.css";
import "@fontsource/pretendard/500.css";
import "@fontsource/pretendard/600.css";
import "@fontsource/pretendard/700.css";
import MainLayout from "@/components/layout/main-layout";
import { Providers } from "@/lib/providers";
import { ErrorBoundary } from "@/components/error-boundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CMS 솔루션 - 생활형 계산기 플랫폼",
  description: "워드프레스보다 빠르고, 자동으로 색인되는 생활형 계산기 CMS 솔루션",
  keywords: ["계산기", "CMS", "SEO", "자동색인", "블로그"],
  authors: [{ name: "CMS Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
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
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
