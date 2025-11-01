/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 배포용 출력 설정
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,

  // 실험적 기능 (Next.js 16 호환)
  experimental: {
    // 번들 분석
    webpackBuildWorker: true,
  },

  // Turbopack 설정 (개발용)
  turbopack: {},

  // 이미지 최적화 (Next.js 16 호환)
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dreamscope.pages.dev',
      },
      {
        protocol: 'https',
        hostname: 'your-domain.com', // 실제 도메인으로 변경 필요
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 번들 최적화 (개발용)
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 번들 분석 (프로덕션에서만)
    if (!dev && !isServer) {
      config.plugins.push(
        new webpack.DefinePlugin({
          __BUILD_ID__: JSON.stringify(buildId),
        })
      );
    }

    return config;
  },

  // 헤더 및 리다이렉트 설정은 public/_headers 및 public/_redirects 파일로 이동됨
  // output: 'export' 모드에서는 headers()와 redirects() 함수가 작동하지 않음

  // 환경 변수 설정
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },

  // 보안 설정
  poweredByHeader: false,
};

module.exports = nextConfig;
