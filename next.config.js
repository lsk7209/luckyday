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

  // 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=600',
          },
        ],
      },
      {
        source: '/dream/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=7200',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 리다이렉트 설정
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/calculator/:slug',
        destination: '/utility/:slug',
        permanent: true,
      },
    ];
  },

  // 환경 변수 설정
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },

  // 보안 설정
  poweredByHeader: false,

  // 서버 외부 패키지 설정 (Next.js 16 호환)
  serverExternalPackages: ['@supabase/supabase-js'],
};

module.exports = nextConfig;
