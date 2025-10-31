/**
 * AI 해몽 API 엔드포인트
 * @description 꿈 입력을 받아 AI로 분석하여 해몽 결과 반환
 */
import { NextRequest, NextResponse } from 'next/server';
import { interpretDream } from '@/lib/openai-client';
import { dreamDb } from '@/lib/supabase-client';
import { DreamInput } from '@/types/dream';

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

    // AI 세션 저장 (비동기로 실행)
    dreamDb.saveAiSession(input, result)
      .catch(error => console.error('AI session save error:', error));

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
