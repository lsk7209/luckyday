-- DreamScope Supabase 데이터베이스 스키마
-- 이 파일을 Supabase SQL 에디터에서 실행하세요

-- =================================================================
-- 기본 테이블들
-- =================================================================

-- 꿈 심볼 테이블
create table if not exists dream_symbol (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,          -- animal, emotion, place, object, action, color, number
  summary text not null,
  quick_answer text not null,
  body_mdx text not null,
  tags text[] not null default '{}',
  popularity int not null default 0,
  polarities jsonb default '{}'::jsonb,  -- 긍정/주의 신호
  modifiers jsonb default '{}'::jsonb,   -- 색상/감정별 가중치
  last_updated timestamptz default now(),
  created_at timestamptz default now()
);

-- 꿈 시나리오 테이블
create table if not exists dream_scenario (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  summary text not null,
  quick_answer text not null,
  body_mdx text not null,
  tags text[] not null default '{}',
  last_updated timestamptz default now(),
  created_at timestamptz default now()
);

-- 꿈 관계 테이블 (연관 꿈들)
create table if not exists dream_relation (
  from_slug text not null,
  to_slug text not null,
  weight real not null default 0.5,
  created_at timestamptz default now(),
  primary key (from_slug, to_slug)
);

-- 검색 로그 테이블
create table if not exists search_log (
  id bigserial primary key,
  q text not null,
  ua text,
  ip text,
  user_id uuid references auth.users(id),
  ts timestamptz default now()
);

-- AI 세션 테이블
create table if not exists ai_session (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  prompt jsonb not null,
  result jsonb,
  created_at timestamptz default now()
);

-- =================================================================
-- 인덱스 생성
-- =================================================================

-- 꿈 심볼 검색 인덱스
create index if not exists idx_dream_symbol_slug on dream_symbol(slug);
create index if not exists idx_dream_symbol_category on dream_symbol(category);
create index if not exists idx_dream_symbol_popularity on dream_symbol(popularity desc);
create index if not exists idx_dream_symbol_tags on dream_symbol using gin(tags);
create index if not exists idx_dream_symbol_search on dream_symbol using gin(to_tsvector('korean', name || ' ' || summary || ' ' || array_to_string(tags, ' ')));

-- 꿈 시나리오 검색 인덱스
create index if not exists idx_dream_scenario_slug on dream_scenario(slug);
create index if not exists idx_dream_scenario_tags on dream_scenario using gin(tags);

-- 꿈 관계 인덱스
create index if not exists idx_dream_relation_from on dream_relation(from_slug);
create index if not exists idx_dream_relation_weight on dream_relation(weight desc);

-- 검색 로그 인덱스
create index if not exists idx_search_log_ts on search_log(ts desc);
create index if not exists idx_search_log_q_ts on search_log(q, ts desc);

-- =================================================================
-- RLS (Row Level Security) 정책
-- =================================================================

-- 꿈 심볼: 모두 읽기 가능
alter table dream_symbol enable row level security;
create policy "Public read access for dream_symbol" on dream_symbol
  for select using (true);

-- 꿈 시나리오: 모두 읽기 가능
alter table dream_scenario enable row level security;
create policy "Public read access for dream_scenario" on dream_scenario
  for select using (true);

-- 꿈 관계: 모두 읽기 가능
alter table dream_relation enable row level security;
create policy "Public read access for dream_relation" on dream_relation
  for select using (true);

-- 검색 로그: 인증된 사용자만 쓰기 가능
alter table search_log enable row level security;
create policy "Authenticated users can insert search logs" on search_log
  for insert with check (auth.role() = 'authenticated');

-- AI 세션: 본인만 읽기/쓰기 가능
alter table ai_session enable row level security;
create policy "Users can read own ai sessions" on ai_session
  for select using (auth.uid() = user_id);
create policy "Users can insert own ai sessions" on ai_session
  for insert with check (auth.uid() = user_id);

-- =================================================================
-- 트리거 및 함수
-- =================================================================

-- 업데이트 시 last_updated 자동 갱신
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.last_updated = now();
  return new;
end;
$$ language plpgsql;

create trigger update_dream_symbol_updated_at
  before update on dream_symbol
  for each row execute function update_updated_at_column();

create trigger update_dream_scenario_updated_at
  before update on dream_scenario
  for each row execute function update_updated_at_column();

-- =================================================================
-- 뷰 생성
-- =================================================================

-- 인기 꿈 심볼 뷰
create or replace view popular_dream_symbols as
select
  slug,
  name,
  category,
  summary,
  popularity,
  last_updated
from dream_symbol
where popularity > 0
order by popularity desc;

-- 최근 업데이트된 꿈 심볼 뷰
create or replace view recent_dream_symbols as
select
  slug,
  name,
  category,
  summary,
  last_updated
from dream_symbol
order by last_updated desc;

-- =================================================================
-- 초기 데이터 삽입 (샘플)
-- =================================================================

-- 기본 꿈 심볼들
insert into dream_symbol (slug, name, category, summary, quick_answer, body_mdx, tags, popularity) values
('baem-snake-dream', '뱀 꿈', 'animal', '뱀 꿈은 변화와 갱신의 신호입니다. 꿈의 맥락에 따라 긍정적 또는 부정적 의미를 가질 수 있습니다.',
 '뱀 꿈은 대개 변화, 갱신, 회복의 의미로 해석됩니다. 검은 뱀이나 공격적인 상황에서는 관계 긴장을, 흰 뱀이나 평온한 상황에서는 긍정적 변화를 상징합니다.',
 '# 뱀 꿈 해몽\n\n뱀 꿈은 인류 역사상 가장 오래된 꿈 상징 중 하나입니다.\n\n## 긍정적 의미\n- 허물 벗기: 새로운 시작\n- 치유: 회복과 재생\n\n## 부정적 의미\n- 위험: 위협과 배신\n- 두려움: 불안과 스트레스',
 array['뱀꿈', '해몽', '변화', '갱신', '심리'], 1250),

('tooth-loss-dream', '이빨 꿈', 'body', '이빨 꿈은 변화, 불안, 자기표현의 신호입니다.',
 '이빨 꿈은 대개 불안이나 변화의 신호로, 잃어버리는 치아의 위치에 따라 가족, 일, 대인관계 문제를 반영합니다.',
 '# 이빨 꿈 해몽\n\n이빨 꿈은 가장 흔한 꿈 중 하나입니다.\n\n## 빠지는 치아별 의미\n- 앞니: 자신감 문제\n- 어금니: 가족 스트레스\n\n## 심리학적 의미\n- 스트레스 반응\n- 변화에 대한 두려움',
 array['이빨꿈', '해몽', '불안', '변화'], 980),

('water-dream', '물 꿈', 'element', '물 꿈은 감정 상태와 무의식을 반영합니다.',
 '물 꿈은 감정의 흐름을 상징하며, 맑은 물은 평온함,浑浊 물은 혼란스러운 감정을 나타냅니다.',
 '# 물 꿈 해몽\n\n물은 꿈에서 감정과 무의식을 상징합니다.\n\n## 물 상태별 의미\n- 맑은 물: 평온한 감정\n-浑浊 물: 혼란스러운 상황\n- 범람: 감정적 압도',
 array['물꿈', '해몽', '감정', '무의식'], 750),

('flying-dream', '나는 꿈', 'action', '나는 꿈은 자유와 해방감을 상징합니다.',
 '나는 꿈은 자유로움과 해방감을 나타내며, 높이 날수록 긍정적인 의미가 강합니다.',
 '# 나는 꿈 해몽\n\n나는 꿈은 자유와 해방의 상징입니다.\n\n## 높이별 의미\n- 높이 날기: 긍정적 자유\n- 추락: 불안과 두려움\n- 자유롭게 날기: 해방감',
 array['나는꿈', '해몽', '자유', '해방'], 680),

('chased-dream', '쫓기는 꿈', 'scenario', '쫓기는 꿈은 현실의 압박감을 반영합니다.',
 '쫓기는 꿈은 스트레스, 회피 경향, 압박감을 나타냅니다. 쫓는 사람이 누구인지가 중요합니다.',
 '# 쫓기는 꿈 해몽\n\n쫓기는 꿈은 가장 흔한 악몽 중 하나입니다.\n\n## 쫓는 자별 의미\n- 모르는 사람: 불특정 스트레스\n- 아는 사람: 관계 문제\n- 동물: 본능적 두려움',
 array['쫓기는꿈', '해몽', '스트레스', '압박'], 920),

('falling-dream', '추락 꿈', 'scenario', '추락 꿈은 불안과 통제 상실감을 나타냅니다.',
 '추락 꿈은 불안정한 상황, 통제 상실감, 자신감 저하를 반영합니다.',
 '# 추락 꿈 해몽\n\n추락 꿈은 불안정한 심리 상태를 보여줍니다.\n\n## 추락 상황별 의미\n- 높은 곳에서: 자신감 저하\n- 끝없이 떨어지기: 통제 상실\n- 안전하게 착지: 긍정적 변화',
 array['추락꿈', '해몽', '불안', '통제상실'], 780),

('money-dream', '돈 꿈', 'object', '돈 꿈은 가치, 풍요, 불안의 상징입니다.',
 '돈 꿈은 재정 상황, 가치관, 풍요로움을 반영합니다. 잃어버리는 꿈은 불안, 얻는 꿈은 긍정적입니다.',
 '# 돈 꿈 해몽\n\n돈 꿈은 경제적 상황과 가치관을 반영합니다.\n\n## 돈 관련 상황별 의미\n- 돈을 잃음: 불안과 걱정\n- 돈을 얻음: 긍정적 변화\n- 돈을 세는 꿈: 현실적 계산',
 array['돈꿈', '해몽', '재정', '가치'], 650),

('house-dream', '집 꿈', 'place', '집 꿈은 심리적 안정감과 가족을 상징합니다.',
 '집 꿈은 심리적 안정감, 가족 관계, 자아상을 반영합니다. 집의 상태가 중요합니다.',
 '# 집 꿈 해몽\n\n집은 꿈에서 심리적 안정을 상징합니다.\n\n## 집 상태별 의미\n- 깨끗한 집: 안정감\n- 부서진 집: 불안정\n- 새로운 집: 변화',
 array['집꿈', '해몽', '안정', '가족'], 720),

('death-dream', '죽음 꿈', 'scenario', '죽음 꿈은 변화와 재생의 신호입니다.',
 '죽음 꿈은 종종 변화와 재생의 긍정적 신호입니다. 두려워하지 마세요.',
 '# 죽음 꿈 해몽\n\n죽음 꿈은 변화와 재생을 상징합니다.\n\n## 죽음 상황별 의미\n- 자신이 죽음: 큰 변화\n- 타인이 죽음: 관계 변화\n- 부활: 재생과 회복',
 array['죽음꿈', '해몽', '변화', '재생'], 890),

('wedding-dream', '결혼 꿈', 'scenario', '결혼 꿈은 새로운 시작과 파트너십을 상징합니다.',
 '결혼 꿈은 새로운 시작, 파트너십, 통합을 나타냅니다.',
 '# 결혼 꿈 해몽\n\n결혼 꿈은 새로운 시작을 상징합니다.\n\n## 결혼 상황별 의미\n- 자신이 결혼: 새로운 시작\n- 다른 사람이 결혼: 축하와 기쁨\n- 결혼식 참석: 사회적 관계',
 array['결혼꿈', '해몽', '새로운시작', '파트너십'], 580);
