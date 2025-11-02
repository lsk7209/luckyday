/**
 * MDX 렌더러 컴포넌트
 * @description 꿈 해몽 MDX 콘텐츠를 구조화되고 가독성 높게 렌더링
 */
import React from 'react';

interface MDXRendererProps {
  content: string;
  className?: string;
}

/**
 * MDX 콘텐츠를 구조화된 HTML로 렌더링
 * @param content - MDX 형식의 콘텐츠
 * @param className - 추가 CSS 클래스
 */
export default function MDXRenderer({ content, className = '' }: MDXRendererProps) {
  // ID 생성 함수 (헤딩용)
  const generateId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  // MDX를 HTML로 변환하는 함수
  const parseMDX = (mdx: string): string => {
    let html = mdx;

    // 헤딩 변환 (H1은 페이지에 이미 있으므로 MDX에서는 H2부터 시작)
    // H2는 주요 섹션, H3는 하위 섹션
    // 먼저 모든 헤딩을 찾아서 처리 (H1, H2, H3)
    const lines = html.split('\n');
    let processedLines: string[] = [];
    let inSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const h1Match = line.match(/^# ([^#].*)$/);
      const h2Match = line.match(/^## (.*)$/);
      const h3Match = line.match(/^### (.*)$/);
      
      if (h1Match || h2Match) {
        // 이전 섹션 닫기
        if (inSection) {
          processedLines.push('</section>');
        }
        // 새 섹션 시작
        const headingText = h1Match ? h1Match[1] : h2Match![1];
        const id = generateId(headingText);
        processedLines.push(`<section class="mb-8 scroll-mt-24" id="${id}">`);
        processedLines.push(`<h2 class="text-2xl font-bold text-slate-900 dark:text-slate-50">${headingText}</h2>`);
        inSection = true;
      } else if (h3Match) {
        // H3는 섹션 내부에
        const headingText = h3Match[1];
        const id = generateId(headingText);
        processedLines.push(`<h3 class="text-xl font-semibold mt-8 mb-4 text-slate-900 dark:text-slate-50" id="${id}">${headingText}</h3>`);
      } else {
        processedLines.push(line);
      }
    }
    
    // 마지막 섹션 닫기
    if (inSection) {
      processedLines.push('</section>');
    }
    
    html = processedLines.join('\n');

    // 강조 및 기울임
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-slate-900 dark:text-slate-50">$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');

    // 리스트 변환
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>');
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-6 mb-2">$1</li>');

    // 리스트 그룹화 (연속된 li를 ul로 감싸기)
    html = html.replace(/(<li[^>]*>.*?<\/li>\s*)+/gim, (match) => {
      return `<ul class="list-disc space-y-2 my-4 ml-6">${match}</ul>`;
    });

    // 표 변환 (간단한 형식)
    html = html.replace(/\| (.*?) \| (.*?) \|/gim, '<tr><td class="px-4 py-2 border">$1</td><td class="px-4 py-2 border">$2</td></tr>');
    html = html.replace(/(<tr>.*?<\/tr>\s*)+/gim, (match) => {
      return `<table class="w-full border-collapse border my-4">${match}</table>`;
    });

    // 링크 변환 (내부/외부 링크 구분)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, (match, linkText, url) => {
      const isExternal = url.startsWith('http') && !url.includes('luckyday.app');
      const isInternalDream = url.startsWith('dream:');
      
      if (isInternalDream) {
        // 내부 꿈 링크: dream:slug 형식을 /dream/slug로 변환
        const slug = url.replace('dream:', '');
        return `<a href="/dream/${slug}" class="text-primary hover:underline font-medium" title="${linkText} 꿈해몽 보기">${linkText}</a>`;
      } else if (isExternal) {
        // 외부 링크: rel="nofollow noopener" 추가 (SEO: 전문성 부여)
        return `<a href="${url}" class="text-primary hover:underline" target="_blank" rel="nofollow noopener noreferrer" title="${linkText} (외부 링크)">${linkText} <span class="text-xs">↗</span></a>`;
      } else {
        // 내부 링크
        return `<a href="${url}" class="text-primary hover:underline">${linkText}</a>`;
      }
    });
    
    // 이미지 링크 변환 (Alt 텍스트 추가)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, (match, altText, imageUrl) => {
      const alt = altText || '꿈해몽 관련 이미지';
      return `<img src="${imageUrl}" alt="${alt}" class="rounded-lg my-4 max-w-full h-auto" loading="lazy" />`;
    });

    // 단락 변환 (이미 헤딩은 변환됨)
    const lines = html.split('\n');
    let result: string[] = [];
    let currentParagraph: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      
      // 섹션 시작/종료, HTML 태그는 그대로 유지
      if (trimmed.match(/^<section|^<\/section|^<h[1-6]|<ul|<li|<table|<tr|<\/ul|<\/table|^<p|^<strong|^<em|^<a|^<img/)) {
        if (currentParagraph.length > 0) {
          result.push(`<p class="mb-4 leading-relaxed text-slate-900 dark:text-slate-50">${currentParagraph.join(' ')}</p>`);
          currentParagraph = [];
        }
        result.push(trimmed);
      } else if (trimmed.length > 0 && !trimmed.match(/^<|^$/)) {
        currentParagraph.push(trimmed);
      } else {
        if (currentParagraph.length > 0) {
          result.push(`<p class="mb-4 leading-relaxed text-slate-900 dark:text-slate-50">${currentParagraph.join(' ')}</p>`);
          currentParagraph = [];
        }
      }
    });

    if (currentParagraph.length > 0) {
      result.push(`<p class="mb-4 leading-relaxed text-slate-900 dark:text-slate-50">${currentParagraph.join(' ')}</p>`);
    }

    return result.join('\n');
  };

  const htmlContent = parseMDX(content);

  return (
    <div
      className={`prose prose-lg max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

