# 🧭 CMS 솔루션 개발 PRD — v5.0 완전판 (Cursor AI 제공용)

> "워드프레스보다 빠르고, 자동으로 색인되는 생활형 계산기 CMS"

> **목표:** 검색 상위 노출 × 자동색인 × 자동갱신 × 자동광고 호환

---

## 0️⃣ 개요

* **유형:** 범용 CMS 솔루션 (계산기 + 블로그 + 가이드)

* **목표:** SEO/AEO/GEO 완전 대응, 자동 색인·자동 리프레시·자동 내부링크,

  GA4·GSC·AdSense 자동 연동, Cloudflare 기반 초경량 구조

* **핵심 가치:**

  * 검색 노출 중심 구조화

  * 100% 자동 색인(GSC·IndexNow)

  * 콘텐츠 리프레시/링크/FAQ 자동화

  * 광고·통계·성능 균형 설계

---

## 1️⃣ 기술 스택

* **프론트:** Next.js 14(App Router) + TypeScript + Tailwind + shadcn/ui

* **백엔드:** Cloudflare Workers + D1(DB) + KV + R2

* **배포:** Cloudflare Pages

* **DB:** Cloudflare D1(SQLite)

* **통합:** GA4, GSC API, IndexNow, Naver Ads, Meta Pixel

* **폰트:** Pretendard Variable (swap)

* **이미지·이모지 금지**, **반응형 + 다크모드**

---

## 2️⃣ IA·라우팅

```

/                   홈

/utility            계산기 목록

/utility/[slug]     계산기 상세

/guide              가이드 목록

/guide/[slug]       가이드 상세

/blog               블로그 목록

/blog/[slug]        블로그 상세

/search             통합 검색

/(admin)/**         관리자 콘솔

/(plain)/**         임베드·랜딩용

```

---

## 3️⃣ 콘텐츠 구조

| 타입      | 필드                                                                                                    | JSON-LD                       |

| ------- | ----------------------------------------------------------------------------------------------------- | ----------------------------- |

| Blog    | title, summary, slug, date, tags[], readingMinutes, seoTitle, seoDescription, faq[], related[]        | BlogPosting + FAQPage         |

| Guide   | title, summary, slug, steps[], level, durationMinutes, seoTitle, seoDescription, faq[]                | HowTo + FAQPage               |

| Utility | title, summary, slug, category, version, inputs[], outputs[], formulaKey, sources[], faq[], related[] | SoftwareApplication + FAQPage |

**공통 규칙:**

* 상단 3문장 요약 + 1문장 직답(≤110자)

* 본문 300자 내 첫 내부링크 1개

* H2당 내부링크 ≥1

* FAQ 3–5개

* 관련글 2–5개

* TOC(H2/H3) 자동

---

## 4️⃣ 프론트엔드 요구사항

* **SEO/AEO 구조화**: H태그·Schema·FAQPage·ItemList

* **자동광고 호환**: sticky/ad-modal 금지, CLS≤0.1

* **TOC·FAQ·Related** 컴포넌트 구현

* **Result Block:** 숫자→의미→주의 순 해설

* **CTA 블록:** 문맥 중간 자동삽입

* **성능:** 폴드 JS ≤90KB / LCP ≤2.5s / INP ≤200ms

* **접근성:** contrast≥4.5, aria-label·caption 적용

* **폰트:** Pretendard / 행간1.7 / 폭70자

---

## 5️⃣ SEO·AEO 설계

* Title: 45–60자 / Meta: 110–155자

* canonical / hreflang / robots / sitemap 분할

* JSON-LD(FAQPage, HowTo, SoftwareApplication, ItemList) 필수

* **FAQ 자동 제안**: 문단 요약 기반

* **내부링크 자동 제안**: 유사도 기반

* **noindex 처리:** 파생/필터 페이지

* **Discover 대응:** 중복 0%, 제목 과장 금지

---

## 6️⃣ 관리자 콘솔 구조

```

Dashboard

Content (Blog / Guide / Utility)

SEO & Indexing (Meta / Sitemaps / Coverage / Canonical)

Programmatic SEO (Entities / Modifiers / Locale / Rules)

Analytics (Overview / Channels / Keywords / Pages / Funnels)

Tracking (Scripts / Channel Rules / Consent)

Internal Links (Graph / Broken)

Appearance (Theme / Nav / Widgets)

Integrations (GSC / GA4 / Naver / Slack)

Jobs & Logs (Automation / Index / Alerts)

Settings (Tenant / ads.txt / robots / privacy)

```

---

## 7️⃣ 자동화 기능 요약

| 기능                   | 설명                          | 주기   |

| -------------------- | --------------------------- | ---- |

| **콘텐츠 리프레시 큐**       | 게시 후 90일 → 자동 갱신 후보 등록      | 1일   |

| **자동 내부링크 추천**       | 신규 글과 기존 문서 유사도 기반          | 즉시   |

| **FAQ 자동 제안**        | 문단 요약→3~5개 생성               | 작성 시 |

| **404/링크 복구**        | 깨진 링크 자동 리디렉션 후보 제안         | 1일   |

| **Programmatic SEO** | 엔티티+모디파이어+로케일 기반 자동 생성      | 크론   |

| **GSC 색인 전송**        | 게시/수정 시 ping + API 제출       | 실시간  |

| **IndexNow**         | Bing·Naver 병행 색인 자동화        | 실시간  |

| **Webhook 트리거**      | Slack, Notion, Sheets 자동 알림 | 실시간  |

---

## 8️⃣ 자동 색인 (Search Console 연동)

### 8.1 GSC API 연동

* OAuth2 서비스계정 (`webmasters.sitemaps.submit`)

* Ping + API 병행 (`https://www.google.com/ping?sitemap=`)

* 실패 시 재시도(3회), Audit 기록

* Admin > SEO & Indexing > Sitemaps 에 상태 표시

### 8.2 IndexNow 병행

* Bing·Naver 자동 색인

* 큐 기반 재시도 / 상태 모니터링

### 8.3 Index Coverage 모니터링

* GSC 색인 결과(`Indexed/Excluded/Error`) 수집

* "색인 제외 페이지" 자동 리포트

* canonical/noindex 수정 제안

---

## 9️⃣ 통계·추적 시스템

### 9.1 1st-party Analytics

* 수집: session, referrer, UTM, keyword, event

* events: `page_view, result_view, form_submit, faq_toggle, related_click, scroll_depth`

* 저장: `sessions`, `events`, `pages_daily`, `channels_daily`

### 9.2 GSC 연동

* `query, page, clicks, impressions, ctr, position`

* 키워드↔랜딩 페이지 매핑

* Top Queries / CTR / Position 트렌드

### 9.3 채널 그룹핑

* Organic / Paid / Social / Referral / Direct / Email

* 규칙 기반(utm/referrer regex)

### 9.4 대시보드 구성

* Overview: Users, Sessions, Views, CTR

* Channels: 유입별 점유율

* Keywords: GSC 기반 검색어

* Pages: 성과별 비교(뷰/이탈/체류)

* Funnel: page_view → result_view → related_click

---

## 🔟 광고/추적 스크립트 관리

* **Tracking → Scripts**

  * GA4, Meta Pixel, Naver Ads, Kakao 지원

  * 위치: head/body/footer

  * Consent Mode 연동 (광고 쿠키 비동의 시 차단)

  * CSP 자동 갱신 / 감사 로그

* **광고 정책:**

  * AdSense 자동광고만 허용

  * 수동 광고 슬롯, 오버레이 금지

  * CLS·LCP 영향 없는 구조

---

## 11️⃣ 백엔드 핵심 API 요약

| 엔드포인트                             | 설명              |

| --------------------------------- | --------------- |

| `GET /api/search?q=&type=&tag=`   | 통합 검색           |

| `GET /api/related?slug=`          | 관련글             |

| `POST /api/admin/content`         | 작성              |

| `PUT /api/admin/content/:id`      | 수정              |

| `POST /api/admin/publish/:id`     | 게시              |

| `POST /api/admin/validate`        | 구조화·링크·FAQ 검증   |

| `POST /api/admin/gsc/submit`      | Ping + API      |

| `POST /api/admin/pseo/scaffold`   | Programmatic 생성 |

| `GET /api/admin/analytics/export` | CSV 내보내기        |

| `POST /api/webhook/:event`        | 외부 알림           |

---

## 12️⃣ 데이터 모델 요약

* **content** (id, type, slug, title, body, tags, jsonld, status, updated_at)

* **utilities** (inputs_json, outputs_json, formula_key, version, sources)

* **faq / related / tags**

* **analytics** (sessions, events, pages_daily, search_daily)

* **jobs** (kind, payload, status, attempts)

* **tracking_scripts**

* **sitemap_submissions**

* **channel_rules**

* **audit / alerts**

---

## 13️⃣ 자동화 Cron & Queue

| 이름                | 설명              | 주기       |

| ----------------- | --------------- | -------- |

| sitemap_rebuild   | 사이트맵 갱신         | 1시간      |

| index_submit      | GSC/IndexNow 전송 | 실시간      |

| refresh_content   | 90일 리프레시 큐      | 매일       |

| gsc_fetch         | 색인/키워드 데이터 수집   | 매일 03:00 |

| broken_links_scan | 링크헬스 점검         | 매일       |

| analytics_rollup  | 트래픽 집계          | 1시간      |

| alert_monitor     | 오류/이탈 감시        | 10분      |

---

## 14️⃣ 운영 KPI

| 항목             | 목표    |

| -------------- | ----- |

| Lighthouse SEO | ≥ 92  |

| CQI 품질지수       | ≥ 75  |

| FAQ 포함률        | 100%  |

| 색인 반영(24h)     | 100%  |

| 평균 CTR         | ≥ 5%  |

| 이탈률            | ≤ 35% |

| 스크롤 깊이         | ≥ 70% |

---

## 15️⃣ 보안·정책

* HTTPS + CSP + COOP + COEP + HSTS

* Rate Limit: 60rpm

* RBAC: viewer < author < editor < admin

* Audit log: 모든 게시·수정 기록

* Consent Mode v2

* IP 가명화 / 위치 미수집

* 백업: DB/R2 7일·30일 자동

* 로그: 180일 보관

---

## 16️⃣ 테스트·CI

* Frontmatter / FAQ / Meta / 링크헬스 Lint

* 게시 전 자동 검증 (CQI ≥ 70)

* E2E: 작성 → 검증 → 게시 → 색인 → 캐시 갱신

* Lighthouse SEO ≥ 92, 성능 ≥ 90

---

## 17️⃣ 수용 기준

1. 게시/수정 시 자동 색인(GSC·IndexNow)이 수행된다.

2. Analytics에서 유입경로·키워드·채널별 성과 확인 가능.

3. 콘텐츠 리프레시·FAQ·내부링크 자동화 정상 작동.

4. 스크립트/색인/통계/광고 Consent 통합 관리 가능.

5. 모든 페이지의 구조화데이터 오류 없음.

6. 성능·가독성·자동광고 기준 충족.

---

## 18️⃣ 선택 확장(후순위)

* Affiliate 모듈 (쿠팡, Amazon 등)

* 다국어 i18n (locale 기반 라우팅)

* OpenAPI Export (`/openapi.json`)

* AI 초안/FAQ 자동 생성(GPT API 연동)

---

## ✅ 결론

이 CMS는

> **"검색 → 색인 → 분석 → 리프레시"**

> 모든 과정을 자동으로 수행하는

> **SEO·AEO 통합 솔루션**이며,

> 클라우드 기반으로 가볍고 확장 가능하며

> **AdSense 자동광고 + GSC 색인 자동 전송 + 내장 Analytics**까지 완전 포함된 구조입니다.

---
