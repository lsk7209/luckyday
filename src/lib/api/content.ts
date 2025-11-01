/**
 * 콘텐츠 API 서비스 (DEPRECATED)
 * 블로그, 가이드, 계산기 관련 API 호출
 *
 * ⚠️ Cloudflare Pages 정적 호스팅에서는 사용되지 않습니다.
 */

// import { apiClient } from '../api-client';
import { Content, BlogContent, GuideContent, UtilityContent } from '@/types/content';

// 타입 정의
export interface ContentListParams {
  type?: 'blog' | 'guide' | 'utility';
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  limit?: number;
  offset?: number;
  search?: string;
  tags?: string[];
}

export interface ContentListResponse {
  contents: Content[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface CreateContentRequest {
  type: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published';
}

export interface UpdateContentRequest {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  issues: string[];
  suggestions: string[];
}

// 콘텐츠 목록 조회 (더미 구현)
export async function getContentList(_params: ContentListParams = {}): Promise<ContentListResponse> {
  return Promise.resolve({
    contents: [],
    total: 0,
    limit: _params.limit || 20,
    offset: _params.offset || 0,
    hasMore: false,
  });
}

// 콘텐츠 상세 조회 (더미 구현)
export async function getContent(_id: number): Promise<Content> {
  throw new Error('Content API is not available in static hosting mode');
}

// 콘텐츠 슬러그로 조회 (더미 구현)
export async function getContentBySlug(_type: string, _slug: string): Promise<Content> {
  throw new Error('Content API is not available in static hosting mode');
}

// 콘텐츠 생성 (더미 구현)
export async function createContent(_data: CreateContentRequest): Promise<{ id: number }> {
  throw new Error('Content API is not available in static hosting mode');
}

// 콘텐츠 수정 (더미 구현)
export async function updateContent(_id: number, _data: UpdateContentRequest): Promise<void> {
  throw new Error('Content API is not available in static hosting mode');
}

// 콘텐츠 삭제 (더미 구현)
export async function deleteContent(_id: number): Promise<void> {
  throw new Error('Content API is not available in static hosting mode');
}

// 콘텐츠 게시 (더미 구현)
export async function publishContent(_id: number): Promise<void> {
  throw new Error('Content API is not available in static hosting mode');
}

// 콘텐츠 검증 (더미 구현)
export async function validateContent(_data: {
  content: Partial<Content>;
  type: string;
}): Promise<ValidationResult> {
  return Promise.resolve({
    valid: true,
    errors: [],
    warnings: [],
    issues: [],
    suggestions: [],
  });
}

// 블로그 포스트 목록 (더미 구현)
export async function getBlogPosts(params: Omit<ContentListParams, 'type'> = {}): Promise<ContentListResponse> {
  return getContentList({ ...params, type: 'blog' });
}

// 가이드 목록 (더미 구현)
export async function getGuides(params: Omit<ContentListParams, 'type'> = {}): Promise<ContentListResponse> {
  return getContentList({ ...params, type: 'guide' });
}

// 계산기 목록 (더미 구현)
export async function getUtilities(params: Omit<ContentListParams, 'type'> = {}): Promise<ContentListResponse> {
  return getContentList({ ...params, type: 'utility' });
}

// 관련 콘텐츠 조회 (더미 구현)
export async function getRelatedContent(_slug: string, _limit: number = 5): Promise<Content[]> {
  return Promise.resolve([]);
}