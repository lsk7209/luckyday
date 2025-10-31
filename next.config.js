/** @type {import('next').NextConfig} */
const nextConfig = {
  // 출력 설정
  output: 'standalone',

  // 실험적 기능
  experimental: {
    // App Router 최적화
    appDir: true,
    // 번들 분석
    webpackBuildWorker: true,
    // 서버 컴포넌트 최적화
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },

  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['dreamscope.pages.dev', 'images.unsplash.com'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 번들 최적화
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 번들 분석 (프로덕션에서만)
    if (!dev && !isServer) {
      config.plugins.push(
        new webpack.DefinePlugin({
          __BUILD_ID__: JSON.stringify(buildId),
        })
      );
    }

    // 번들 크기 제한
    if (!dev) {
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 512000, // 512KB
        maxAssetSize: 1024000,    // 1MB
      };
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

  // 리라이팅 설정
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // 컴프레션 설정
  compress: true,

  // 소스맵 설정 (프로덕션에서는 최소화)
  productionBrowserSourceMaps: false,

  // ESLint 설정
  eslint: {
    ignoreDuringBuilds: false,
  },

  // TypeScript 설정
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },

  // 환경 변수 설정
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || '1.0.0',
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },

  // PWA 설정
  // Note: 실제 PWA 설정은 next-pwa 패키지를 사용하는 것을 권장
  // 하지만 여기서는 기본적인 웹앱 매니페스트만 설정

  // 국제화 설정 (필요시 확장)
  i18n: {
    locales: ['ko'],
    defaultLocale: 'ko',
    localeDetection: false,
  },

  // 보안 설정
  poweredByHeader: false,

  // 모니터링 및 분석
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // 정적 파일 최적화
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',

  // 빌드 최적화
  swcMinify: true,

  // 번들 분석 (개발용)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config) => {
      if (process.env.NODE_ENV === 'production') {
        // 번들 분석기 추가 (선택사항)
        // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        // config.plugins.push(
        //   new BundleAnalyzerPlugin({
        //     analyzerMode: 'static',
        //     reportFilename: './analyze/client.html',
        //     openAnalyzer: false,
        //   })
        // );
      }
      return config;
    },
  }),
};

module.exports = nextConfig;
