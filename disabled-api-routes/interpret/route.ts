/**
 * AI 해몽 API 엔드포인트
 * @description 꿈 입력을 받아 AI로 분석하여 해몽 결과 반환
 */
/**
 * AI 해몽 API 엔드포인트 (OpenAI 직접 호출)
 * @description OpenAI API를 직접 호출하고, 세션 저장은 Workers API로 전송
 */
import { NextRequest, NextResponse } from 'next/server';
import { interpretDream } from '@/lib/openai-client';
import { DreamInput } from '@/types/dream';

import { getWorkersApiUrl } from '@/lib/workers-api-url';

const WORKERS_API_URL = getWorkersApiUrl();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: DreamInput = {
      keywords: body.keywords || [],
      scenario: body.scenario,
      emotions: body.emotions || [],
      colors: body.colors || [],
      numbers: body.numbers || [],
      relations: body.relations || [],
      details: body.details
    };

    // 입력 검증
    if (!input.keywords || input.keywords.length === 0) {
      return NextResponse.json({
        success: false,
        error: '키워드를 최소 1개 이상 입력해주세요.'
      }, { status: 400 });
    }

    // AI 해몽 실행
    const result = await interpretDream(input);

    // AI 세션 저장 (Workers API로 비동기 전송)
    // TODO: Workers API에 AI 세션 저장 엔드포인트 추가 필요
    fetch(`${WORKERS_API_URL}/api/ai/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input, result })
    }).catch(error => console.error('AI session save error:', error));

    return NextResponse.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('AI Interpret API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '해몽 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        result: null
      },
      { status: 500 }
    );
  }
}

// OPTIONS 메서드 처리 (CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
