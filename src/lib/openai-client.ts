/**
 * OpenAI 클라이언트 설정 - DreamScope AI 해몽
 * 
 * ⚠️ 주의: 클라이언트 사이드에서 사용 시 API 키가 노출될 수 있습니다.
 * 보안을 위해 Workers API를 통해 호출하는 것을 권장합니다.
 */
import OpenAI from 'openai';

// 클라이언트 사이드에서 환경 변수는 NEXT_PUBLIC_ 접두사가 필요합니다
// 하지만 보안상 API 키를 클라이언트에 노출하면 안 되므로
// 이 함수는 Workers API를 통해 호출해야 합니다
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '',
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
 * 가설 생성 (규칙 기반, 고도화)
 * 한국 전통 해몽, 심리학, 상징학을 종합한 가설 생성
 */
function generateHypotheses(input: any): DreamHypothesis[] {
  const hypotheses: DreamHypothesis[] = [];
  const { keywords, emotions, colors, numbers, relations, scenario, details } = input;

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
 * OpenAI로 요약문 생성 (고도화된 프롬프트)
 */
async function generateSummary(input: any, hypotheses: DreamHypothesis[]): Promise<string> {
  const prompt = `당신은 한국의 꿈 해몽 전문가입니다. 전통 해몽, 심리학, 상징학을 종합하여 정확하고 유용한 해몽을 제공합니다.

## 꿈 정보
- 주요 키워드: ${input.keywords?.join(', ') || '없음'}
- 시나리오: ${input.scenario || '없음'}
- 감정: ${input.emotions?.join(', ') || '없음'}
- 색상: ${input.colors?.join(', ') || '없음'}
- 숫자: ${input.numbers?.join(', ') || '없음'}
- 관계: ${input.relations?.map((r: { role: string; name?: string }) => `${r.role}${r.name ? '(' + r.name + ')' : ''}`).join(', ') || '없음'}
- 세부사항: ${input.details || '없음'}

## 분석된 가설
${hypotheses.map(h => `- ${h.label} (신뢰도: ${(h.confidence * 100).toFixed(0)}%, 증거: ${h.evidence.join(', ')})`).join('\n')}

## 해몽 작성 지침
1. 주어진 정보만을 근거로 작성하세요
2. 새로운 상징이나 예언을 만들지 마세요
3. 한국 문화와 전통 해몽을 고려하세요
4. 심리학적 관점을 포함하세요
5. 긍정적 측면과 주의할 점을 균형있게 제시하세요
6. 3-4문장으로 명확하고 구체적으로 작성하세요
7. 일반적이고 모호한 표현보다 구체적인 해석을 제공하세요

## 해몽 작성:`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `당신은 한국의 꿈 해몽 전문가입니다. 다음 원칙을 따르세요:
1. 정확성: 주어진 정보만으로 해석하세요
2. 문화적 맥락: 한국 전통 해몽 문화를 이해하고 반영하세요
3. 심리학적 근거: 프로이트, 융, 현대 심리학 관점을 고려하세요
4. 실용성: 사용자가 실제로 활용할 수 있는 구체적 조언을 제공하세요
5. 균형: 긍정적 측면과 주의할 점을 모두 제시하세요
6. 존중: 꿈 해몽의 한계를 명시하고 과학적 주장은 하지 마세요`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content?.trim() || '해몽 분석이 어렵습니다. 좀 더 구체적인 정보를 제공해주시면 더 정확한 해몽을 드릴 수 있습니다.';
  } catch (error) {
    console.error('OpenAI 요약 생성 실패:', error);
    // 폴백: 기본 해석 제공
    const fallbackSummary = hypotheses.length > 0
      ? `${hypotheses[0].label} 관련 꿈으로 보입니다. ${input.keywords?.join(', ') || '주요 요소'}가 꿈에서 나타났으며, ${input.emotions?.length > 0 ? input.emotions.join(', ') + ' 감정' : '특정 감정'}이 주요 요소입니다. 꿈의 맥락과 현재 생활 상황을 함께 고려해보세요.`
      : '꿈의 의미를 분석하는 중입니다.';
    return fallbackSummary;
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
