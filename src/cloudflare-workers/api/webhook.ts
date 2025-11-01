/**
 * 웹훅 API 핸들러
 * 외부 서비스 연동 (Slack, Notion, Sheets 등)
 */

import { Env } from '../index';
import { createResponse, createErrorResponse } from './handler';

export async function handleWebhookAPI(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  if (request.method !== 'POST') {
    return createErrorResponse('Method not allowed', 405);
  }

  const url = new URL(request.url);
  const path = url.pathname;
  const event = path.split('/').pop();

  try {
    const body = await request.json();

    // 이벤트 타입별 처리
    switch (event) {
      case 'content-published':
        return handleContentPublishedWebhook(body, env);

      case 'seo-indexed':
        return handleSEOIndexedWebhook(body, env);

      case 'analytics-alert':
        return handleAnalyticsAlertWebhook(body, env);

      case 'error-occurred':
        return handleErrorOccurredWebhook(body, env);

      default:
        return createErrorResponse('Unknown webhook event', 400);
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return createErrorResponse('Webhook processing failed', 500);
  }
}

// 콘텐츠 게시 웹훅
async function handleContentPublishedWebhook(data: any, env: Env): Promise<Response> {
  const { contentId, title, type, slug } = data;

  try {
    // Slack 알림 (실제로는 Slack Webhook URL로 전송)
    const slackMessage = {
      text: `새 ${type === 'blog' ? '블로그' : type === 'guide' ? '가이드' : '계산기'}가 게시되었습니다!`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${title}*\n<${process.env.NEXT_PUBLIC_BASE_URL}/${type}/${slug}|게시물 보기>`
          }
        }
      ]
    };

    // TODO: 실제 Slack Webhook으로 전송
    console.log('Slack notification:', slackMessage);

    // Notion 데이터베이스 업데이트 (실제로는 Notion API 호출)
    const notionData = {
      title,
      type,
      slug,
      publishedAt: new Date().toISOString(),
      status: 'published'
    };

    // TODO: 실제 Notion API로 전송
    console.log('Notion update:', notionData);

    return createResponse({
      message: 'Content published notifications sent',
      notifications: ['slack', 'notion']
    });
  } catch (error) {
    console.error('Content published webhook error:', error);
    return createErrorResponse('Failed to send content published notifications', 500);
  }
}

// SEO 색인 웹훅
async function handleSEOIndexedWebhook(data: any, env: Env): Promise<Response> {
  const { urls, provider, status } = data;

  try {
    // 색인 결과 데이터베이스 업데이트
    for (const url of urls) {
      await env.DB.prepare(`
        INSERT INTO index_submissions (url, provider, status, indexed_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(url, provider) DO UPDATE SET
          status = excluded.status,
          indexed_at = excluded.indexed_at
      `).bind(url, provider, status, status === 'indexed' ? new Date().toISOString() : null).run();
    }

    // Slack 알림
    const slackMessage = {
      text: `SEO 색인 ${status === 'indexed' ? '완료' : '실패'} 알림`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${provider}에서 ${urls.length}개 URL의 색인이 ${status === 'indexed' ? '성공' : '실패'}했습니다.`
          }
        }
      ]
    };

    // TODO: 실제 Slack Webhook으로 전송
    console.log('SEO indexing notification:', slackMessage);

    return createResponse({
      message: 'SEO indexing notification sent',
      urlsProcessed: urls.length,
      provider,
      status
    });
  } catch (error) {
    console.error('SEO indexed webhook error:', error);
    return createErrorResponse('Failed to process SEO indexing notification', 500);
  }
}

// 분석 알림 웹훅
async function handleAnalyticsAlertWebhook(data: any, env: Env): Promise<Response> {
  const { alertType, message, metrics, threshold } = data;

  try {
    // 알림을 데이터베이스에 저장
    await env.DB.prepare(`
      INSERT INTO audit_logs (action, resource_type, resource_id, old_values)
      VALUES (?, 'analytics', 0, ?)
    `).bind(`analytics_alert_${alertType}`, JSON.stringify({ message, metrics, threshold })).run();

    // 이메일 알림 (실제로는 이메일 서비스로 전송)
    const emailData = {
      to: 'admin@cms-calculator.com',
      subject: `[CMS Alert] ${alertType}`,
      body: `
분석 알림: ${message}

메트릭: ${JSON.stringify(metrics, null, 2)}
임계값: ${threshold}

시간: ${new Date().toISOString()}
      `
    };

    // TODO: 실제 이메일 전송
    console.log('Analytics alert email:', emailData);

    return createResponse({
      message: 'Analytics alert processed',
      alertType,
      notified: true
    });
  } catch (error) {
    console.error('Analytics alert webhook error:', error);
    return createErrorResponse('Failed to process analytics alert', 500);
  }
}

// 에러 발생 웹훅
async function handleErrorOccurredWebhook(data: any, env: Env): Promise<Response> {
  const { error, context, severity = 'error' } = data;

  try {
    // 에러 로그 저장
    await env.DB.prepare(`
      INSERT INTO audit_logs (action, resource_type, resource_id, old_values)
      VALUES (?, 'error', 0, ?)
    `).bind(`error_${severity}`, JSON.stringify({ error, context, severity })).run();

    // 심각한 에러인 경우 Slack 알림
    if (severity === 'critical' || severity === 'error') {
      const slackMessage = {
        text: `🚨 ${severity.toUpperCase()} 에러 발생`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*에러:* ${error}\n*컨텍스트:* ${JSON.stringify(context)}`
            }
          }
        ]
      };

      // TODO: 실제 Slack Webhook으로 전송
      console.log('Error notification:', slackMessage);
    }

    return createResponse({
      message: 'Error logged and notifications sent',
      severity,
      logged: true,
      notified: severity === 'critical' || severity === 'error'
    });
  } catch (error) {
    console.error('Error webhook processing error:', error);
    return createErrorResponse('Failed to process error webhook', 500);
  }
}
