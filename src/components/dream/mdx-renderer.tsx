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
  // MDX를 HTML로 변환하는 함수
  const parseMDX = (mdx: string): string => {
    let html = mdx;

    // 헤딩 변환
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-8 mb-4 text-foreground">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-6 text-foreground border-b pb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-12 mb-8 text-foreground">$1</h1>');

    // 강조 및 기울임
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-foreground">$1</strong>');
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

    // 링크 변환
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary hover:underline">$1</a>');

    // 단락 변환
    const lines = html.split('\n');
    let result: string[] = [];
    let currentParagraph: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      
      // 헤딩, 리스트, 표는 그대로 유지
      if (trimmed.match(/^<h[1-6]|<ul|<li|<table|<tr|<\/ul|<\/table/)) {
        if (currentParagraph.length > 0) {
          result.push(`<p class="mb-4 leading-relaxed text-foreground">${currentParagraph.join(' ')}</p>`);
          currentParagraph = [];
        }
        result.push(trimmed);
      } else if (trimmed.length > 0 && !trimmed.match(/^<|^$/)) {
        currentParagraph.push(trimmed);
      } else {
        if (currentParagraph.length > 0) {
          result.push(`<p class="mb-4 leading-relaxed text-foreground">${currentParagraph.join(' ')}</p>`);
          currentParagraph = [];
        }
      }
    });

    if (currentParagraph.length > 0) {
      result.push(`<p class="mb-4 leading-relaxed text-foreground">${currentParagraph.join(' ')}</p>`);
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

