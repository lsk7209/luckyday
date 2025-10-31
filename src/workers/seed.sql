-- CMS Calculator Database Seed Data

-- 샘플 사용자
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@cms-calculator.com', '$2b$10$dummy.hash.for.demo', '관리자', 'admin'),
('editor@cms-calculator.com', '$2b$10$dummy.hash.for.demo', '편집자', 'editor');

-- 샘플 콘텐츠
INSERT INTO content (
  type, slug, title, summary, seo_title, seo_description, body, status,
  tags, jsonld, faq, related, created_at, published_at
) VALUES
(
  'blog',
  'salary-negotiation-guide',
  '연봉 협상 시 고려해야 할 5가지 포인트',
  '연봉 협상을 성공적으로 이끌어내기 위한 전략과 실전 팁을 알아보세요.',
  '연봉 협상 가이드: 성공을 위한 5가지 핵심 포인트',
  '연봉 협상을 위한 완벽 가이드. 타이밍, 준비사항, 협상 전략 등 실무에 바로 적용 가능한 노하우를 소개합니다.',
  '# 연봉 협상 시 고려해야 할 5가지 포인트

연봉 협상은 커리어에서 가장 중요한 순간 중 하나입니다. 올바른 전략과 준비로 성공적인 결과를 이끌어낼 수 있습니다.

## 1. 타이밍을 정확히 파악하라

연봉 협상의 적절한 시기는 다음과 같습니다:
- 입사 전 채용 제안 시
- 연말이나 반기 평가 후
- 프로모션 시
- 회사 실적이 좋을 때

## 2. 충분한 준비를 하라

협상 전 반드시 준비해야 할 것들:
- 현재 업무 성과
- 시장 내 자신의 경쟁력
- 회사의 연봉 인상율

## 3. 구체적인 숫자를 제시하라

추상적인 표현 대신 구체적인 숫자를 사용하세요.

## 4. 상대방의 입장을 고려하라

협상은 양방향 커뮤니케이션입니다.

## 5. B Plan을 준비하라

협상이 결렬될 경우를 대비한 대안.',
  'published',
  '["연봉", "협상", "커리어"]',
  '{"@type": "BlogPosting", "headline": "연봉 협상 시 고려해야 할 5가지 포인트"}',
  '[{"question": "연봉 협상은 언제 하는 게 좋나요?", "answer": "입사 제안 시, 연말 평가 후, 프로모션 시가 적절합니다."}]',
  '[{"slug": "salary-calculator", "title": "연봉 계산기", "type": "utility"}]',
  datetime('now'),
  datetime('now')
),
(
  'utility',
  'salary-calculator',
  '연봉 계산기',
  '연봉, 월급, 시급을 서로 변환하고 세금을 계산해보세요',
  '연봉 계산기 - 월급, 시급 변환 및 세금 계산',
  '연봉을 월급으로, 월급을 시급으로 변환하고 세금을 계산하는 정확한 계산기. 연봉 협상 시 필수 도구입니다.',
  '연봉 계산기 설명...',
  'published',
  '["연봉", "월급", "시급", "세금"]',
  '{"@type": "SoftwareApplication", "name": "연봉 계산기"}',
  '[{"question": "연봉 계산은 정확한가요?", "answer": "국세청 기준에 따라 계산됩니다."}]',
  '[{"slug": "salary-negotiation-guide", "title": "연봉 협상 가이드", "type": "blog"}]',
  datetime('now'),
  datetime('now')
);

-- 샘플 계산기 데이터
INSERT INTO utilities (
  content_id, category, version, formula_key, inputs_json, outputs_json, sources
) VALUES (
  2,
  '금융',
  '2.1.0',
  'salary_conversion',
  '[{"key": "annualSalary", "label": "연봉", "type": "number", "required": false, "unit": "원"}, {"key": "monthlySalary", "label": "월급", "type": "number", "required": false, "unit": "원"}, {"key": "workHours", "label": "일일 근무시간", "type": "number", "required": false, "unit": "시간"}]',
  '[{"key": "calculatedAnnualSalary", "label": "연봉", "type": "number", "unit": "원"}, {"key": "monthlySalary", "label": "월급", "type": "number", "unit": "원"}, {"key": "estimatedTax", "label": "예상 세금", "type": "number", "unit": "원"}]',
  '[{"name": "국세청", "url": "https://www.nts.go.kr", "description": "근로소득세 계산 기준"}]'
);

-- 샘플 분석 이벤트
INSERT INTO analytics_events (
  session_id, event_type, page, user_agent, referrer, timestamp
) VALUES
('session_123', 'page_view', '/', 'Mozilla/5.0...', 'https://google.com', datetime('now')),
('session_123', 'page_view', '/utility/salary-calculator', 'Mozilla/5.0...', '/', datetime('now')),
('session_456', 'result_view', '/utility/salary-calculator', 'Mozilla/5.0...', '/', datetime('now'));

-- 샘플 작업 큐
INSERT INTO jobs (kind, payload, priority) VALUES
('sitemap_rebuild', '{"force": false}', 0),
('index_submit', '{"contentId": 1}', 1);

-- 샘플 트래킹 스크립트
INSERT INTO tracking_scripts (name, type, code, position, is_active) VALUES
('Google Analytics 4', 'ga4', '<!-- GA4 Script -->', 'head', 1),
('Meta Pixel', 'meta_pixel', '<!-- Meta Pixel Script -->', 'head', 0);
