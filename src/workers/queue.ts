/**
 * Queue 작업 핸들러
 * Cloudflare Workers Queue Consumer
 */

import { Env } from './index';

// Queue 메시지 타입
export interface QueueMessage {
  id: string;
  kind: string;
  payload: any;
  priority?: number;
  delay?: number; // 밀리초
  maxRetries?: number;
}

// Queue 작업 타입
export interface QueueJob {
  kind: string;
  handler: (message: QueueMessage, env: Env) => Promise<void>;
  maxRetries: number;
  retryDelay: number; // 밀리초
}

// 등록된 Queue 작업들
export const queueJobs: Record<string, QueueJob> = {
  'index-submission': {
    kind: 'index-submission',
    handler: handleIndexSubmission,
    maxRetries: 3,
    retryDelay: 5 * 60 * 1000, // 5분
  },
  'email-notification': {
    kind: 'email-notification',
    handler: handleEmailNotification,
    maxRetries: 5,
    retryDelay: 10 * 60 * 1000, // 10분
  },
  'webhook-trigger': {
    kind: 'webhook-trigger',
    handler: handleWebhookTrigger,
    maxRetries: 3,
    retryDelay: 2 * 60 * 1000, // 2분
  },
  'analytics-export': {
    kind: 'analytics-export',
    handler: handleAnalyticsExport,
    maxRetries: 2,
    retryDelay: 15 * 60 * 1000, // 15분
  },
  'content-backup': {
    kind: 'content-backup',
    handler: handleContentBackup,
    maxRetries: 1,
    retryDelay: 60 * 60 * 1000, // 1시간
  },
};

// 메인 Queue 핸들러
export async function handleQueue(batch: MessageBatch, env: Env) {
  console.log(`📨 Processing queue batch: ${batch.messages.length} messages`);

  const results = [];

  for (const message of batch.messages) {
    try {
      const queueMessage: QueueMessage = message.body;
      console.log(`🔄 Processing queue message: ${queueMessage.id} (${queueMessage.kind})`);

      // 해당 작업 핸들러 찾기
      const job = queueJobs[queueMessage.kind];
      if (!job) {
        console.warn(`⚠️  Unknown queue job type: ${queueMessage.kind}`);
        results.push({ status: 'error', message: `Unknown job type: ${queueMessage.kind}` });
        continue;
      }

      // 작업 실행
      await job.handler(queueMessage, env);

      console.log(`✅ Queue message processed: ${queueMessage.id}`);
      results.push({ status: 'success', messageId: queueMessage.id });

    } catch (error) {
      console.error(`❌ Queue message failed: ${message.body.id}`, error);

      // 재시도 로직
      const queueMessage: QueueMessage = message.body;
      const job = queueJobs[queueMessage.kind];

      if (job && shouldRetry(message, job)) {
        // 재시도 큐에 다시 넣기
        await retryMessage(message, job, env);
        results.push({ status: 'retry', messageId: queueMessage.id });
      } else {
        // 최대 재시도 횟수 초과 또는 재시도 불가
        await handleFailedMessage(message, error, env);
        results.push({ status: 'failed', messageId: queueMessage.id, error: error.message });
      }
    }
  }

  console.log(`📊 Queue batch processed: ${results.length} messages`);
  return results;
}

// 색인 제출 작업
async function handleIndexSubmission(message: QueueMessage, env: Env) {
  const { urls, provider } = message.payload;

  console.log(`🔍 Submitting ${urls.length} URLs to ${provider}`);

  for (const url of urls) {
    try {
      await submitUrlToSearchEngine(env, url, provider);

      // 제출 기록 저장
      await env.DB.prepare(`
        INSERT INTO index_submissions (url, provider, status, submitted_at)
        VALUES (?, ?, 'submitted', CURRENT_TIMESTAMP)
      `).bind(url, provider).run();

    } catch (error) {
      console.error(`Failed to submit ${url} to ${provider}:`, error);

      // 실패 기록 저장
      await env.DB.prepare(`
        INSERT INTO index_submissions (url, provider, status, error_message, submitted_at)
        VALUES (?, ?, 'failed', ?, CURRENT_TIMESTAMP)
      `).bind(url, provider, error.message).run();

      throw error; // 재시도를 위해 에러 throw
    }
  }
}

// 이메일 알림 작업
async function handleEmailNotification(message: QueueMessage, env: Env) {
  const { to, subject, html, text } = message.payload;

  console.log(`📧 Sending email to: ${to}`);

  // Cloudflare Email Routing이나 외부 ESP 사용
  // 실제로는 SendGrid, Mailgun, AWS SES 등 연동

  const emailData = {
    to,
    subject,
    html,
    text,
    from: 'noreply@cms-calculator.com',
  };

  // 외부 이메일 서비스 API 호출
  const response = await fetch(env.EMAIL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.EMAIL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    throw new Error(`Email sending failed: ${response.status}`);
  }

  console.log(`✅ Email sent successfully to: ${to}`);
}

// 웹훅 트리거 작업
async function handleWebhookTrigger(message: QueueMessage, env: Env) {
  const { url, method = 'POST', headers = {}, body, secret } = message.payload;

  console.log(`🔗 Triggering webhook: ${method} ${url}`);

  const requestHeaders = {
    'Content-Type': 'application/json',
    'User-Agent': 'CMS-Calculator-Webhook/1.0',
    ...headers,
  };

  // 서명 추가 (선택사항)
  if (secret) {
    const timestamp = Date.now().toString();
    const signature = await generateWebhookSignature(body, secret, timestamp);
    requestHeaders['X-Webhook-Signature'] = signature;
    requestHeaders['X-Webhook-Timestamp'] = timestamp;
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
  }

  console.log(`✅ Webhook triggered successfully: ${url}`);
}

// 분석 데이터 내보내기 작업
async function handleAnalyticsExport(message: QueueMessage, env: Env) {
  const { format = 'json', dateRange, destination } = message.payload;

  console.log(`📊 Exporting analytics data (${format})`);

  let data;
  const { startDate, endDate } = dateRange;

  if (format === 'json') {
    // JSON 형식으로 데이터 추출
    const events = await env.DB.prepare(`
      SELECT * FROM analytics_events
      WHERE DATE(timestamp) BETWEEN ? AND ?
      ORDER BY timestamp DESC
    `).bind(startDate, endDate).all();

    data = JSON.stringify(events.results || []);
  } else if (format === 'csv') {
    // CSV 형식으로 데이터 추출
    const events = await env.DB.prepare(`
      SELECT
        timestamp,
        session_id,
        event_type,
        page,
        user_id,
        referrer
      FROM analytics_events
      WHERE DATE(timestamp) BETWEEN ? AND ?
      ORDER BY timestamp DESC
    `).bind(startDate, endDate).all();

    data = convertToCSV(events.results || []);
  }

  // 데이터를 목적지에 저장
  if (destination.type === 'r2') {
    const key = `analytics-export/${Date.now()}.${format}`;
    await env.STORAGE.put(key, data, {
      httpMetadata: {
        contentType: format === 'json' ? 'application/json' : 'text/csv',
      },
    });
  } else if (destination.type === 'webhook') {
    // 웹훅으로 데이터 전송
    await handleWebhookTrigger({
      id: `export-${Date.now()}`,
      kind: 'webhook-trigger',
      payload: {
        url: destination.url,
        method: 'POST',
        body: { data, format, dateRange },
      },
    }, env);
  }

  console.log(`✅ Analytics data exported successfully`);
}

// 콘텐츠 백업 작업
async function handleContentBackup(message: QueueMessage, env: Env) {
  const { type = 'full' } = message.payload;

  console.log(`💾 Creating ${type} content backup`);

  let data;

  if (type === 'full') {
    // 전체 콘텐츠 백업
    const content = await env.DB.prepare('SELECT * FROM content').all();
    const utilities = await env.DB.prepare('SELECT * FROM utilities').all();

    data = JSON.stringify({
      content: content.results,
      utilities: utilities.results,
      timestamp: new Date().toISOString(),
    });
  } else {
    // 증분 백업 (최근 24시간)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const content = await env.DB.prepare(`
      SELECT * FROM content
      WHERE updated_at > ?
    `).bind(yesterday.toISOString()).all();

    data = JSON.stringify({
      content: content.results,
      timestamp: new Date().toISOString(),
      type: 'incremental',
    });
  }

  // R2에 백업 저장
  const backupKey = `backups/${type}/${new Date().toISOString().split('T')[0]}/${Date.now()}.json`;
  await env.STORAGE.put(backupKey, data, {
    httpMetadata: {
      contentType: 'application/json',
    },
  });

  console.log(`✅ Content backup created: ${backupKey}`);
}

// 헬퍼 함수들
function shouldRetry(message: any, job: QueueJob): boolean {
  const retryCount = message.retryCount || 0;
  return retryCount < job.maxRetries;
}

async function retryMessage(message: any, job: QueueJob, env: Env) {
  const retryCount = (message.retryCount || 0) + 1;
  const delay = job.retryDelay * Math.pow(2, retryCount - 1); // 지수 백오프

  // 재시도 큐에 다시 넣기 (실제로는 Queue API 사용)
  console.log(`🔄 Retrying message ${message.body.id} in ${delay}ms (attempt ${retryCount})`);

  // 실제 구현에서는 queue.send() 등을 사용
  setTimeout(() => {
    // 재시도 로직
  }, delay);
}

async function handleFailedMessage(message: any, error: any, env: Env) {
  console.error(`💀 Message ${message.body.id} failed permanently:`, error);

  // 실패한 메시지를 별도 테이블에 저장
  await env.DB.prepare(`
    INSERT INTO failed_jobs (message_id, kind, payload, error, failed_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(
    message.body.id,
    message.body.kind,
    JSON.stringify(message.body.payload),
    error.message
  ).run();
}

async function submitUrlToSearchEngine(env: Env, url: string, provider: string) {
  // 실제 검색 엔진 제출 로직 (cron.ts와 유사)
  const endpoints = {
    google: 'https://www.google.com/ping?sitemap=',
    bing: 'https://www.bing.com/ping?sitemap=',
    indexnow: 'https://api.indexnow.org/indexnow',
  };

  if (provider === 'indexnow') {
    const response = await fetch(endpoints.indexnow, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'your-domain.com',
        key: env.INDEXNOW_KEY,
        keyLocation: 'https://your-domain.com/indexnow-key.txt',
        urlList: [url],
      }),
    });
    if (!response.ok) throw new Error(`IndexNow submission failed: ${response.status}`);
  } else {
    // 실제로는 각 URL을 개별적으로 ping
    const sitemapUrl = `${endpoints[provider as keyof typeof endpoints]}${url}`;
    const response = await fetch(sitemapUrl);
    if (!response.ok) throw new Error(`Ping failed: ${response.status}`);
  }
}

async function generateWebhookSignature(payload: any, secret: string, timestamp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${timestamp}.${JSON.stringify(payload)}`);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, data);
  return `v1=${btoa(String.fromCharCode(...new Uint8Array(signature)))}`;
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => JSON.stringify(row[header] || '')).join(',')
    )
  ];

  return csvRows.join('\n');
}
