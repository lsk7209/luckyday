/**
 * DreamScope - 꿈 해몽 관련 타입 정의
 */

export interface DreamSymbol {
  id: string;
  slug: string;
  name: string;
  category: string;
  summary: string;
  quick_answer: string;
  body_mdx: string;
  tags: string[];
  popularity: number;
  polarities: Record<string, any>;
  modifiers: Record<string, any>;
  last_updated: string;
  created_at?: string; // 옵셔널: 데이터베이스에서 제공될 수 있음
}

export interface DreamScenario {
  id: string;
  slug: string;
  name: string;
  summary: string;
  quick_answer: string;
  body_mdx: string;
  tags: string[];
  last_updated: string;
}

export interface DreamRelation {
  from_slug: string;
  to_slug: string;
  weight: number;
}

export interface SearchLog {
  id: number;
  q: string;
  ua?: string;
  ts: string;
}

export interface AiSession {
  id: string;
  prompt: any;
  result?: any;
  created_at: string;
}

export interface DreamInput {
  keywords: string[];
  scenario?: string;
  emotions?: string[];
  colors?: string[];
  numbers?: number[];
  relations?: { role: string; name?: string }[];
  details?: string;
}

export interface DreamHypothesis {
  label: string;
  score: number;
  confidence: number;
  evidence: string[];
}

export interface DreamInterpretation {
  summary: string;
  hypotheses: DreamHypothesis[];
  positive_signs: string[];
  caution_points: string[];
  related_slugs: string[];
  disclaimer: string;
}

export interface DreamCardProps {
  dream: DreamSymbol;
  href?: string;
}

export interface DreamPageProps {
  params: Promise<{ slug: string }>;
}

export interface SearchResult {
  slug: string;
  name: string;
  category: string;
  summary: string;
  popularity: number;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RelatedDream {
  slug: string;
  title: string;
  type: 'dream' | 'scenario';
  similarity: number;
  summary?: string;
}
