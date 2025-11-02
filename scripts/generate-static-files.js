/**
 * 정적 SEO 파일 생성 스크립트
 * output: 'export' 모드를 위한 robots.txt, sitemap.xml, feed.xml 생성
 */

const fs = require('fs');
const path = require('path');

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://luckyday.app';
const publicDir = path.join(process.cwd(), 'public');
const outDir = path.join(process.cwd(), 'out');

// public 디렉토리가 없으면 생성
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// robots.txt 생성
const robotsContent = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
Host: ${baseUrl.replace(/^https?:\/\//, '')}
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent);
console.log('✓ robots.txt 생성 완료');

// 기본 sitemap.xml 생성 (동적 콘텐츠는 별도 처리 필요)
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/dream</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/ai</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/feed.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
console.log('✓ sitemap.xml 생성 완료');

// 기본 feed.xml 생성
const feedContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[럭키데이 - AI 꿈 해몽]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[AI 기반 꿈 해몽 서비스 - 심리학·문화·상징학으로 꿈을解读. 200개 이상의 꿈 사전과 개인 맞춤 AI 분석으로 당신의 꿈을 정확하게 해석합니다.]]></description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/og-image.png</url>
      <title><![CDATA[럭키데이 - AI 꿈 해몽]]></title>
      <link>${baseUrl}</link>
    </image>
    <item>
      <title><![CDATA[럭키데이 - AI 꿈 해몽 서비스]]></title>
      <link>${baseUrl}</link>
      <guid isPermaLink="true">${baseUrl}</guid>
      <description><![CDATA[AI 기반 꿈 해몽 서비스로 당신의 꿈을 정확하게 해석하세요.]]></description>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>
  </channel>
</rss>
`;

fs.writeFileSync(path.join(publicDir, 'feed.xml'), feedContent);
console.log('✓ feed.xml 생성 완료');

console.log('\n모든 정적 SEO 파일 생성 완료!');

