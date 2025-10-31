/**
 * CORS 설정 및 핸들러
 */

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

export function handleOptions(request: Request): Response {
  // 허용된 오리진 확인 (프로덕션에서는 특정 도메인만 허용)
  const origin = request.headers.get('Origin');

  const allowedOrigins = [
    'http://localhost:3000',
    'https://your-domain.com', // 실제 도메인으로 변경 필요
  ];

  const responseHeaders = {
    ...corsHeaders,
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? origin : allowedOrigins[0],
  };

  return new Response(null, {
    status: 200,
    headers: responseHeaders,
  });
}

export function addCorsHeaders(response: Response, request: Request): Response {
  const origin = request.headers.get('Origin');

  const allowedOrigins = [
    'http://localhost:3000',
    'https://your-domain.com', // 실제 도메인으로 변경 필요
  ];

  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', allowedOrigins.includes(origin || '') ? origin! : allowedOrigins[0]);
  newHeaders.set('Access-Control-Allow-Methods', corsHeaders['Access-Control-Allow-Methods']);
  newHeaders.set('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers']);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
