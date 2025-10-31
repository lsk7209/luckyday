/**
 * OpenAI 클라이언트 설정 - DreamScope AI 해몽
 */
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface DreamHypothesis {
  label: string;
  score: number;
  confidence: number;
  evidence: string[];
}

export interface DreamInterpretationResult {
  summary: string;
  hypotheses: DreamHypothesis[];
  positive_signs: string[];
  caution_points: string[];
  related_slugs: string[];
  disclaimer: string;
}

/**
 * 꿈 입력을 바탕으로 AI 해몽 생성
 */
export async function interpretDream(input: {
  keywords: string[];
  scenario?: string;
  emotions?: string[];
  colors?: string[];
  numbers?: number[];
  relations?: { role: string; name?: string }[];
  details?: string;
}): Promise<DreamInterpretationResult> {
  try {
    // 가설 생성 로직 (간단한 규칙 기반)
    const hypotheses = generateHypotheses(input);

    // OpenAI로 요약문 생성
    const summary = await generateSummary(input, hypotheses);

    // 긍정/주의 신호 추출
    const { positiveSigns, cautionPoints } = extractSignals(input, hypotheses);

    // 관련 꿈 추천 (임시)
    const relatedSlugs = [
      'baem-snake-dream',
      'tooth-loss-dream',
      'blood-dream',
      'water-dream'
    ].slice(0, 3);

    return {
      summary,
      hypotheses,
      positive_signs: positiveSigns,
      caution_points: cautionPoints,
      related_slugs: relatedSlugs,
      disclaimer: "이 내용은 상징 해석 정보이며 의료·법률 자문이 아닙니다."
    };
  } catch (error) {
    console.error('AI 해몽 생성 실패:', error);
    throw new Error('해몽 생성에 실패했습니다.');
  }
}

/**
 * 가설 생성 (규칙 기반)
 */
function generateHypotheses(input: any): DreamHypothesis[] {
  const hypotheses: DreamHypothesis[] = [];
  const { keywords, emotions, colors, scenario } = input;

  // 뱀 관련 가설
  if (keywords.includes('뱀') || keywords.includes('snake')) {
    hypotheses.push({
      label: '변화·갱신',
      score: 0.74,
      confidence: 0.68,
      evidence: ['snake', 'shedding']
    });

    if (colors?.includes('검은색') || colors?.includes('black')) {
      hypotheses.push({
        label: '관계 긴장',
        score: 0.59,
        confidence: 0.62,
        evidence: ['black', 'fear', 'partner']
      });
    }
  }

  // 이빨 관련 가설
  if (keywords.includes('이빨') || keywords.includes('tooth')) {
    hypotheses.push({
      label: '자기점검·불안',
      score: 0.71,
      confidence: 0.65,
      evidence: ['tooth', 'loss', 'anxiety']
    });
  }

  // 피 관련 가설
  if (keywords.includes('피') || keywords.includes('blood')) {
    hypotheses.push({
      label: '생명의 힘·에너지',
      score: 0.69,
      confidence: 0.61,
      evidence: ['blood', 'life', 'energy']
    });
  }

  // 감정 기반 가설
  if (emotions?.includes('fear') || emotions?.includes('공포')) {
    hypotheses.push({
      label: '스트레스·압박',
      score: 0.63,
      confidence: 0.58,
      evidence: ['fear', 'stress', 'pressure']
    });
  }

  // 시나리오 기반 가설
  if (scenario === 'chased' || scenario === '쫓김') {
    hypotheses.push({
      label: '회피·도피',
      score: 0.67,
      confidence: 0.64,
      evidence: ['chased', 'avoidance', 'escape']
    });
  }

  // 기본 가설들로 채우기
  if (hypotheses.length < 2) {
    hypotheses.push({
      label: '개인 성장',
      score: 0.55,
      confidence: 0.52,
      evidence: ['growth', 'change', 'development']
    });
  }

  return hypotheses.slice(0, 4); // 최대 4개
}

/**
 * OpenAI로 요약문 생성
 */
async function generateSummary(input: any, hypotheses: DreamHypothesis[]): Promise<string> {
  const prompt = `너는 해몽 분석가다. 주어진 꿈 입력과 가설을 바탕으로 2-3문장으로 요약하라.
새로운 상징이나 예언을 생성하지 말고, 주어진 데이터만 근거로 서술하라.

입력:
- 키워드: ${input.keywords?.join(', ')}
- 시나리오: ${input.scenario || '없음'}
- 감정: ${input.emotions?.join(', ') || '없음'}
- 색상: ${input.colors?.join(', ') || '없음'}
- 관계: ${input.relations?.map(r => r.role).join(', ') || '없음'}
- 세부사항: ${input.details || '없음'}

가설:
${hypotheses.map(h => `- ${h.label} (신뢰도: ${(h.confidence * 100).toFixed(0)}%)`).join('\n')}

요약:`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '너는 꿈 해몽 전문가다. 주어진 정보만으로 사실적으로 요약하라.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content?.trim() || '해몽 분석이 어렵습니다.';
  } catch (error) {
    console.error('OpenAI 요약 생성 실패:', error);
    return '꿈의 의미를 분석하는 중입니다.';
  }
}

/**
 * 긍정/주의 신호 추출
 */
function extractSignals(input: any, hypotheses: DreamHypothesis[]): { positiveSigns: string[], cautionPoints: string[] } {
  const positiveSigns: string[] = [];
  const cautionPoints: string[] = [];

  // 색상 기반 신호
  if (input.colors?.includes('흰색') || input.colors?.includes('white')) {
    positiveSigns.push('순수함', '새로운 시작');
  }
  if (input.colors?.includes('검은색') || input.colors?.includes('black')) {
    cautionPoints.push('어두운 에너지', '부정적 감정');
  }
  if (input.colors?.includes('빨간색') || input.colors?.includes('red')) {
    positiveSigns.push('열정', '생명의 힘');
  }

  // 감정 기반 신호
  if (input.emotions?.includes('평온') || input.emotions?.includes('peaceful')) {
    positiveSigns.push('내면의 안정', '균형 잡힌 상태');
  }
  if (input.emotions?.includes('공포') || input.emotions?.includes('fear')) {
    cautionPoints.push('불안정한 상황', '스트레스 누적');
  }

  // 가설 기반 신호
  hypotheses.forEach(h => {
    if (h.label.includes('변화') || h.label.includes('성장')) {
      positiveSigns.push('개인 성장', '새로운 기회');
    }
    if (h.label.includes('긴장') || h.label.includes('불안')) {
      cautionPoints.push('관계 개선 필요', '스트레스 관리');
    }
  });

  return {
    positiveSigns: [...new Set(positiveSigns)].slice(0, 3),
    cautionPoints: [...new Set(cautionPoints)].slice(0, 3)
  };
}
