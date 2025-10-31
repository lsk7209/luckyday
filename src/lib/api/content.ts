/**
 * 콘텐츠 API 서비스
 * 블로그, 가이드, 계산기 관련 API 호출
 */

import { apiClient } from '../api-client';
import { Content, BlogContent, GuideContent, UtilityContent } from '@/types/content';

// 타입 정의
export interface ContentListParams {
  type?: 'blog' | 'guide' | 'utility';
  status?: 'draft' | 'published' | 'archived';
  limit?: number;
  offset?: number;
  search?: string;
  tags?: string[];
}

export interface ContentListResponse {
  content: Content[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface CreateContentRequest {
  type: 'blog' | 'guide' | 'utility';
  slug: string;
  title: string;
  summary: string;
  seoTitle?: string;
  seoDescription?: string;
  body?: string;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
  faq?: Array<{ question: string; answer: string }>;
  related?: Array<{ slug: string; title: string; type: string }>;
  // 블로그 전용
  readingMinutes?: number;
  date?: Date;
  // 가이드 전용
  durationMinutes?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  steps?: Array<{ title: string; description: string; durationMinutes?: number }>;
  // 계산기 전용
  category?: string;
  version?: string;
  formulaKey?: string;
  inputs?: any[];
  outputs?: any[];
  sources?: Array<{ name: string; url: string; description?: string }>;
}

export interface UpdateContentRequest extends Partial<CreateContentRequest> {}

export interface ValidationResult {
  valid: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
}

// 콘텐츠 목록 조회
export async function getContentList(params: ContentListParams = {}): Promise<ContentListResponse> {
  const queryParams: Record<string, string> = {};

  if (params.type) queryParams.type = params.type;
  if (params.status) queryParams.status = params.status;
  if (params.limit) queryParams.limit = params.limit.toString();
  if (params.offset) queryParams.offset = params.offset.toString();
  if (params.search) queryParams.search = params.search;
  if (params.tags && params.tags.length > 0) queryParams.tags = params.tags.join(',');

  return apiClient.get<ContentListResponse>('/content', queryParams);
}

// 콘텐츠 상세 조회
export async function getContent(id: number): Promise<Content> {
  return apiClient.get<Content>(`/content/${id}`);
}

// 콘텐츠 슬러그로 조회
export async function getContentBySlug(type: string, slug: string): Promise<Content> {
  return apiClient.get<Content>(`/${type}/${slug}`);
}

// 콘텐츠 생성
export async function createContent(data: CreateContentRequest): Promise<{ id: number }> {
  return apiClient.post<{ id: number }>('/content', data);
}

// 콘텐츠 수정
export async function updateContent(id: number, data: UpdateContentRequest): Promise<void> {
  return apiClient.put<void>(`/content/${id}`, data);
}

// 콘텐츠 삭제
export async function deleteContent(id: number): Promise<void> {
  return apiClient.delete<void>(`/content/${id}`);
}

// 콘텐츠 게시
export async function publishContent(id: number): Promise<void> {
  return apiClient.post<void>(`/admin/content/${id}/publish`);
}

// 콘텐츠 검증
export async function validateContent(data: {
  content: Partial<Content>;
  type: string;
}): Promise<ValidationResult> {
  return apiClient.post<ValidationResult>('/admin/content/validate', data);
}

// 블로그 포스트 목록
export async function getBlogPosts(params: Omit<ContentListParams, 'type'> = {}): Promise<ContentListResponse> {
  return getContentList({ ...params, type: 'blog' });
}

// 가이드 목록
export async function getGuides(params: Omit<ContentListParams, 'type'> = {}): Promise<ContentListResponse> {
  return getContentList({ ...params, type: 'guide' });
}

// 계산기 목록
export async function getUtilities(params: Omit<ContentListParams, 'type'> = {}): Promise<ContentListResponse> {
  return getContentList({ ...params, type: 'utility' });
}

// 관련 콘텐츠 조회
export async function getRelatedContent(slug: string): Promise<Array<{
  slug: string;
  title: string;
  type: string;
  similarity: number;
}>> {
  return apiClient.get(`/related?slug=${encodeURIComponent(slug)}`);
}
