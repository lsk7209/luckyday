# 🌙 DreamScope (해몽 사이트) — Full PRD for Cursor AI

---

## 1️⃣ 프로젝트 개요

| 항목        | 내용                                                                                            |
| --------- | --------------------------------------------------------------------------------------------- |
| **프로젝트명** | DreamScope                                                                                    |
| **목표**    | 한국어 해몽 정보를 구조화하여 **검색 상위 노출 + AdSense 수익화 + 자동 확장(P-SEO)**                                    |
| **핵심 가치** | 꿈을 단순히 "예언"이 아니라 **심리·상징·문화·사례·AI 분석**으로 설명하는 "꿈 백과"                                          |
| **핵심 기술** | Next.js 14(App Router), Tailwind + shadcn/ui, Supabase, Cloudflare Functions + KV, OpenAI API |
| **KPI**   | SEO 상위노출률 / 색인율 / CTR / 평균 체류시간 / AdSense RPM                                                 |

---

## 2️⃣ IA (정보 구조·라우팅)

```
/app/(site)

/                      # 홈: 검색, 인기 키워드, AI 해몽 CTA

/dream                 # 꿈 사전 허브 (카테고리·가나다)

/dream/[slug]          # 개별 꿈 상세 (예: snake-dream)

/scenarios             # 상황별 꿈 모음 (쫓김, 추락 등)

/scenarios/[slug]

/ai                    # AI 해몽 폼 및 결과 페이지

/blog                  # 꿈 해석·심리·문화 블로그

/blog/[slug]

/guide                 # 사용법 및 디스클레이머

/about, /contact, /terms, /privacy

/api/interpret         # AI 해몽 API (POST)

/api/search            # 자동완성 API (GET)

/api/sitemap/*         # 사이트맵 (동적 생성)
```

---

## 3️⃣ 프론트엔드 PRD

### (1) 기술·UI 공통

* **환경:** Next.js 14 + TypeScript + Tailwind + shadcn/ui
* **폰트:** Pretendard
* **다크모드:** 지원
* **레이아웃:** `/app/(site)` 공용 Header/Footer
* **광고:** AdSense 자동광고 + CLS 방지 고정 높이
* **SEO:** Title/Meta 자동생성 + JSON-LD (Article, FAQPage, SearchAction)

---

### (2) 주요 페이지

#### 🏠 홈(/)

* Hero 검색박스 ("무엇을 꿈꾸셨나요?")
* 인기 키워드 카드(동물/감정/상황/색상)
* AI 해몽 CTA 카드
* 최신 해몽·블로그 카드 그리드
* Footer: 디스클레이머, sitemap 링크

#### 📘 해몽 사전(/dream)

* DreamCard: 아이콘 + 제목 + 요약
* 필터: 가나다순 / 인기순 / 카테고리별
* Pagination + Lazy loading

#### 📖 상세페이지(/dream/[slug])

* Hero: 제목 + 요약 + 110자 직답
* 본문: MDX (7섹션 이상)
* TOC, FAQAccordion, AdSlot, RelatedList
* JSON-LD: `Article + FAQPage + Breadcrumb`
* CTA: "AI 해몽으로 이어보기 → /ai"

#### 💬 AI 해몽(/ai)

* 입력 폼: 키워드, 감정, 색상, 숫자, 인물 관계, 최근 사건, 상세 서술
* `/api/interpret` 호출 → 결과 카드 표시
* 결과 구성:
  * 요약(2–3문장)
  * 가설 2–4개 (label, score, confidence, evidence)
  * 긍정/주의 신호
  * 관련 꿈 링크
  * 디스클레이머

#### 🧠 블로그(/blog)

* MDX 콘텐츠(심리학·문화·수면 해몽 등)
* FAQ·테이블·내부링크 구조 동일

---

## 4️⃣ 백엔드 PRD

### (1) 인프라

| 구성          | 기술                                           |
| ----------- | -------------------------------------------- |
| **Hosting** | Cloudflare Pages (정적)                        |
| **API**     | Cloudflare Functions                         |
| **DB**      | Supabase (Postgres)                          |
| **Cache**   | Cloudflare KV + ETag + SWR                   |
| **Secrets** | OPENAI_API_KEY / SUPABASE_URL / SUPABASE_KEY |

---

### (2) DB 스키마

```sql
create table dream_symbol (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,          -- animal, emotion, place...
  summary text not null,
  quick_answer text not null,
  body_mdx text not null,
  tags text[] not null default '{}',
  popularity int not null default 0,
  polarities jsonb default '{}'::jsonb,  -- 긍정/주의 신호
  modifiers jsonb default '{}'::jsonb,   -- 색상/감정별 가중치
  last_updated timestamptz default now()
);

create table dream_scenario (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  summary text not null,
  quick_answer text not null,
  body_mdx text not null,
  tags text[] not null default '{}',
  last_updated timestamptz default now()
);

create table dream_relation (
  from_slug text not null,
  to_slug text not null,
  weight real not null default 0.5,
  primary key (from_slug, to_slug)
);

create table search_log (
  id bigserial primary key,
  q text not null,
  ua text,
  ts timestamptz default now()
);

create table ai_session (
  id uuid primary key default gen_random_uuid(),
  prompt jsonb not null,
  result jsonb,
  created_at timestamptz default now()
);
```

---

### (3) API 설계

#### `/api/search?q=`

* 자동완성 (slug, name, category)
* 검색 로그 저장 (search_log)

#### `/api/interpret` (POST)

입력 예시:

```json
{
  "keywords":["뱀","검은색"],
  "scenario":"chased",
  "emotions":["fear"],
  "colors":["black"],
  "numbers":[3],
  "relations":[{"role":"partner"}],
  "details":"검은 뱀에게 쫓겼어요"
}
```

출력 예시:

```json
{
  "summary":"변화의 신호지만, 공포가 강하면 회피 경향을 나타냅니다.",
  "hypotheses":[
    {"label":"변화·갱신","score":0.74,"confidence":0.68,"evidence":["snake","shedding"]},
    {"label":"관계 긴장","score":0.59,"confidence":0.62,"evidence":["black","fear","partner"]}
  ],
  "positive_signs":["허물 벗음","밝은 색"],
  "caution_points":["반복된 공포","검은색","관계 갈등"],
  "related_slugs":["baem-snake-dream","tooth-loss-dream"],
  "disclaimer":"이 내용은 상징 해석 정보이며 의료·법률 자문이 아닙니다."
}
```

로직 요약:

1. 입력 정규화 → 키워드·색상·감정 매핑
2. DB에서 관련 심볼/시나리오 조회
3. 각 가설 score 계산
   ```
   score = prior + cooccur + modifier + scenario + recency - contradiction
   ```
4. 상위 2–4개 가설 선정
5. OpenAI API로 요약문 생성 (사실 생성 금지)
6. JSON 반환

#### `/api/sitemap/*`

* `sitemap-dreams.xml`, `sitemap-scenarios.xml`, `sitemap-blog.xml`
* lastmod 자동 업데이트, IndexNow/GSC ping

---

### (4) 크론 (Cloudflare)

| 시간(KST) | 작업                            |
| ------- | ----------------------------- |
| 03:10   | 인기 검색어 집계 → `popularity` 업데이트 |
| 03:20   | 사이트맵 재생성 + IndexNow/GSC 핑     |
| 03:30   | dream_relation 그래프 재계산        |

---

## 5️⃣ AI 해몽 로직 ("정확하진 않아도 가장 적합한 해석")

### (1) 입력 구조

```ts
type DreamInput = {
  keywords:string[];
  scenario?:string;
  emotions?:string[];
  colors?:string[];
  numbers?:number[];
  relations?:{role:string,name?:string}[];
  details?:string;
};
```

### (2) 가설 계산식

```
score = prior + cooccur_bonus + modifier_effects + scenario_pattern - contradiction_penalty
confidence = coverage + consistency - contradictions
```

### (3) LLM 프롬프트

```
System:
너는 해몽 분석가다. 주어진 데이터만 근거로 명확히 요약하라.
새로운 상징이나 예언을 생성하지 말고, 증거 기반으로 서술하라.

User:
- 입력: {scenario, keywords, emotions, colors, relations, details}
- 상위 가설 목록
- 긍정/주의 신호

요약: 2–3문장
가설: 2–4개 (근거와 함께)
주의 포인트와 관련 꿈을 리스트로 정리
```

---

## 6️⃣ SEO·AEO 정책

| 요소                 | 규칙                                                      |                     |
| ------------------ | ------------------------------------------------------- | ------------------- |
| Title              | `[핵심키워드] 꿈 해몽                                           | 의미·상황별 해석` (45–60자) |
| Meta               | 행동·결과·증거·CTA 포함 (110–155자)                              |                     |
| 요약+직답              | 상단 3문장 + 1문장(110자)                                      |                     |
| FAQ                | 3–5개 (JSON-LD 포함)                                       |                     |
| H2당 내부링크           | 1개 이상                                                   |                     |
| 첫 내부링크             | 본문 300자 이내                                              |                     |
| Schema             | `Article + FAQPage + Breadcrumb + WebSite/SearchAction` |                     |
| Canonical/hreflang | 자동 삽입                                                   |                     |
| Lighthouse SEO     | ≥ 92점                                                   |                     |
| CTR 개선             | 질문형 타이틀 ("이 꿈, 행운일까?")                                  |                     |

---

## 7️⃣ Programmatic SEO (자동 생성)

| 파일               | 설명                                          |
| ---------------- | ------------------------------------------- |
| `entities.json`  | 주요 키워드: 뱀, 피, 이빨, 아기, 불, 돈, 집, 물, 산 등       |
| `modifiers.json` | 감정·색상·상황 조합 ("검은 뱀꿈", "불타는 집꿈")             |
| `locale.json`    | ko-KR                                       |
| `rules.json`     | H2 ≥ 5, FAQ 3–5, 요약·직답 필수, Title/Meta 길이 체크 |

자동 명령 예시:

```
npm run scaffold:pseo -- --entity=snake --modifier=color-black --locale=ko-KR
```

---

## 8️⃣ 콘텐츠 구조 (풍부한 MDX 예시)

```md
---
title: "이빨 꿈 해몽 | 손실·성장·자기점검"
summary: "이빨 꿈은 변화와 자기점검의 신호입니다. 빠진 위치와 감정에 따라 의미가 달라집니다."
tags: ["이빨꿈","꿈해몽","심리해몽","자기점검"]
slug: "tooth-loss-dream"
date: "2025-10-31"
readingMinutes: 8
seoTitle: "이빨꿈 해몽 총정리 - 빠지는 위치별 의미와 심리"
seoDescription: "이빨꿈은 손실 또는 성장의 상징으로, 감정·상황에 따라 다른 의미를 가집니다."
---

## 요약
이빨꿈은 자기 회복 또는 불안의 신호입니다. [뱀꿈 해석](dream:baem-snake-dream)

## 빠진 위치별 의미
| 위치 | 의미 |
|------|------|
| 앞니 | 자신감·대외 이미지 |
| 어금니 | 가족·직장 스트레스 |
| 송곳니 | 경쟁·긴장·공격성 |

## 감정별 해석
| 감정 | 해석 |
|------|------|
| 평온 | 성장 준비 |
| 불안 | 자기 점검 필요 |
| 공포 | 건강 주의 |

## 심리학적 해석
억눌린 불안, 자기 이미지 손상과 관련.
👉 [꿈일기 작성법](blog:dream-journal-guide)

## 문화권별 의미
한국: 가족 건강, 재물
서양: 상실·불안
불교: 덧없는 무상함

## 자주 묻는 질문
**Q1. 이빨 빠지는 꿈은 나쁜가요?**
A. 감정이 불안했다면 건강·스트레스 신호일 수 있습니다.

**Q2. 피가 함께 났다면요?**
A. 변화의 과정이지만 에너지 소모 주의.

## 관련 꿈
[피꿈 해석](dream:blood-dream) / [죽음꿈](dream:death-dream)
```

---

## 9️⃣ UX·시각 구성

| 컴포넌트                   | 기능                     |
| ---------------------- | ---------------------- |
| **TOC**                | 스크롤스파이, 모바일 접힘         |
| **FAQAccordion**       | 클릭형 AEO 노출             |
| **ReadingProgressBar** | 페이지 상단 읽기 진행           |
| **RelatedList**        | dream_relation 기반 3–5개 |
| **AdSlot**             | 본문 2/3, FAQ 위, 하단      |
| **ShareButtons**       | 카카오·트위터·URL 복사         |

---

## 🔟 품질 게이트

| 체크                     | 조건 |
| ---------------------- | -- |
| Title/Meta 길이          | OK |
| 요약+직답                  | OK |
| H2 ≥ 5                 | OK |
| 단락 ≥ 8                 | OK |
| FAQ 3–5                | OK |
| 내부링크 ≥ 6               | OK |
| JSON-LD                | OK |
| SEO 점수 ≥ 92            | OK |
| CLS ≤ 0.1 / LCP ≤ 2.5s | OK |

---

## 11️⃣ 자동화·운영

* `/functions/cron-refresh.js` → 사이트맵·인기검색어·IndexNow
* `/admin/content` → MDX CRUD + 검증(Lighthouse+SEO Lint)
* `/api/feedback` → "유용함/불만족" 수집 → 내부링크 그래프 업데이트

---

## 12️⃣ Cursor 명령 예시

```
당신은 Next.js 14(App Router)+TypeScript+Tailwind+shadcn/ui 엔지니어입니다.

이 PRD에 따라 프로젝트를 생성하세요.

- Pretendard 폰트, 다크모드, 반응형
- 라우트: /, /dream, /dream/[slug], /ai, /api/interpret
- 컴포넌트: SearchBox, TOC, FAQAccordion, RelatedList, AdSlot, Breadcrumb
- SEO: Title/Meta 자동, JSON-LD 삽입(Article+FAQPage+Breadcrumb)
- Lighthouse SEO ≥92, CLS ≤0.1
- Supabase DB 스키마는 본문 명세대로 생성
- /api/interpret는 OpenAI API를 이용해 프롬프트 기반 결과 생성
- DreamCard, DreamPage, AiResultPage 컴포넌트 구현
```

---

## ✅ 결론

**이 PRD는 해몽 사이트의 "개발, 콘텐츠, SEO, AI 해석, 자동화"를 완전히 통합한 최고 사양입니다.**

* 🧠 AI 해몽: 점수화 + 요약형 로직
* 🔍 SEO·AEO: 완전 대응
* 📚 콘텐츠: 풍부한 MDX 구조
* ⚙️ 자동화: Programmatic SEO + Cron
* 💰 수익화: AdSense 자동광고
* 🔐 정책: 디스클레이머·안전 필터
