-- DreamScope Supabase 시드 데이터
-- 스키마 생성 후 실행하세요

-- =================================================================
-- 추가 꿈 심볼 데이터
-- =================================================================

-- 더 많은 꿈 심볼들
insert into dream_symbol (slug, name, category, summary, quick_answer, body_mdx, tags, popularity) values
('dog-dream', '개 꿈', 'animal', '개 꿈은 충성심, 우정, 보호의 상징입니다.',
 '개 꿈은 충성심과 우정을 나타내며, 친근한 개는 긍정적 관계, 공격적인 개는 갈등을 암시합니다.',
 '# 개 꿈 해몽\n\n개는 충성심과 우정의 상징입니다.\n\n## 개 행동별 의미\n- 친근한 개: 좋은 관계\n- 공격적인 개: 갈등 상황\n- 짖는 개: 경고 신호',
 array['개꿈', '해몽', '충성', '우정'], 450),

('cat-dream', '고양이 꿈', 'animal', '고양이 꿈은 독립성, 신비로움, 여성성을 상징합니다.',
 '고양이 꿈은 독립성과 신비로움을 나타내며, 검은 고양이는 행운, 하얀 고양이는 순수함을 상징합니다.',
 '# 고양이 꿈 해몽\n\n고양이는 독립성과 신비로움의 상징입니다.\n\n## 고양이 색상별 의미\n- 검은 고양이: 행운과 신비\n- 하얀 고양이: 순수와 평화\n- 회색 고양이: 균형과 중립',
 array['고양이꿈', '해몽', '독립', '신비'], 380),

('blood-dream', '피 꿈', 'body', '피 꿈은 생명의 힘, 에너지, 감정적 상처를 상징합니다.',
 '피 꿈은 생명의 힘과 에너지를 나타내며, 피를 흘리는 꿈은 감정적 상처나 생명의 힘을 암시합니다.',
 '# 피 꿈 해몽\n\n피는 생명의 근본적인 상징입니다.\n\n## 피 상황별 의미\n- 피 흘림: 감정적 상처\n- 피 기부: 희생과 베품\n- 피 응고: 치유 과정',
 array['피꿈', '해몽', '생명', '에너지'], 520),

('fire-dream', '불 꿈', 'element', '불 꿈은 열정, 파괴, 정화의 상징입니다.',
 '불 꿈은 열정과 변화를 나타내며, 불이 타오르는 꿈은 열정, 불이 꺼지는 꿈은 희망 상실을 암시합니다.',
 '# 불 꿈 해몽\n\n불은 열정과 변화를 상징합니다.\n\n## 불 상태별 의미\n- 밝게 타는 불: 열정과 에너지\n- 꺼지는 불: 희망 상실\n- 불이 번짐: 빠른 변화',
 array['불꿈', '해몽', '열정', '변화'], 610),

('mountain-dream', '산 꿈', 'place', '산 꿈은 목표, 도전, 영적 성장을 상징합니다.',
 '산 꿈은 목표 달성과 도전을 나타내며, 산을 오르는 꿈은 노력을, 정상에 오르는 꿈은 성취를 상징합니다.',
 '# 산 꿈 해몽\n\n산은 목표와 도전의 상징입니다.\n\n## 산 상황별 의미\n- 산 오르기: 노력과 성장\n- 산 정상: 목표 달성\n- 산에서 떨어짐: 좌절과 실패',
 array['산꿈', '해몽', '목표', '도전'], 390),

('baby-dream', '아기 꿈', 'person', '아기 꿈은 새로운 시작, 취약성, 창의성을 상징합니다.',
 '아기 꿈은 새로운 시작과 취약성을 나타내며, 귀여운 아기는 새로운 아이디어, 울거나 아픈 아기는 걱정을 암시합니다.',
 '# 아기 꿈 해몽\n\n아기는 새로운 시작의 상징입니다.\n\n## 아기 상태별 의미\n- 귀여운 아기: 새로운 아이디어\n- 우는 아기: 걱정과 불안\n- 아픈 아기: 취약성과 보호 필요',
 array['아기꿈', '해몽', '새로운시작', '취약성'], 480),

('exam-dream', '시험 꿈', 'scenario', '시험 꿈은 평가, 불안, 준비 상태를 상징합니다.',
 '시험 꿈은 현실의 평가 불안이나 준비 부족을 반영하며, 시험을 통과하는 꿈은 자신감, 떨어지는 꿈은 불안을 나타냅니다.',
 '# 시험 꿈 해몽\n\n시험 꿈은 평가와 불안의 상징입니다.\n\n## 시험 결과별 의미\n- 시험 통과: 자신감과 성공\n- 시험 떨어짐: 불안과 걱정\n- 시험 준비: 현실적 준비 상태',
 array['시험꿈', '해몽', '평가', '불안'], 720),

('lost-dream', '길 잃음 꿈', 'scenario', '길 잃음 꿈은 방향 상실감과 혼란을 상징합니다.',
 '길 잃음 꿈은 방향 상실과 혼란을 나타내며, 길을 찾는 꿈은 해결책 발견, 계속 헤매는 꿈은 지속적인 혼란을 암시합니다.',
 '# 길 잃음 꿈 해몽\n\n길 잃음은 방향 상실의 상징입니다.\n\n## 길 상황별 의미\n- 길을 찾음: 해결책 발견\n- 계속 헤맴: 지속적 혼란\n- 어두운 길: 불안정한 상황',
 array['길잃음꿈', '해몽', '방향상실', '혼란'], 560),

('meeting-dream', '만남 꿈', 'scenario', '만남 꿈은 새로운 관계나 재회를 상징합니다.',
 '만남 꿈은 새로운 관계 형성이나 과거 관계 재회를 나타내며, 기분 좋은 만남은 긍정적 관계, 불편한 만남은 갈등을 암시합니다.',
 '# 만남 꿈 해몽\n\n만남은 관계 형성의 상징입니다.\n\n## 만남 상황별 의미\n- 즐거운 만남: 긍정적 관계\n- 불편한 만남: 갈등 상황\n- 오랜만에 만남: 그리움과 재회',
 array['만남꿈', '해몽', '관계', '재회'], 420),

('car-dream', '자동차 꿈', 'object', '자동차 꿈은 삶의 방향과 통제력을 상징합니다.',
 '자동차 꿈은 삶의 방향과 통제력을 나타내며, 운전하는 꿈은 통제력, 사고 꿈은 위험, 주차하는 꿈은 휴식을 상징합니다.',
 '# 자동차 꿈 해몽\n\n자동차는 삶의 방향을 상징합니다.\n\n## 자동차 상황별 의미\n- 운전하기: 통제력과 방향\n- 사고 나기: 위험과 충돌\n- 주차하기: 휴식과 정지',
 array['자동차꿈', '해몽', '방향', '통제력'], 590);

-- =================================================================
-- 꿈 관계 데이터 (연관 꿈들)
-- =================================================================

-- 뱀 꿈과의 관계
insert into dream_relation (from_slug, to_slug, weight) values
('baem-snake-dream', 'dog-dream', 0.7),
('baem-snake-dream', 'cat-dream', 0.8),
('baem-snake-dream', 'blood-dream', 0.6),
('baem-snake-dream', 'fire-dream', 0.5),
('baem-snake-dream', 'death-dream', 0.7);

-- 이빨 꿈과의 관계
insert into dream_relation (from_slug, to_slug, weight) values
('tooth-loss-dream', 'blood-dream', 0.8),
('tooth-loss-dream', 'death-dream', 0.6),
('tooth-loss-dream', 'falling-dream', 0.7),
('tooth-loss-dream', 'exam-dream', 0.5);

-- 물 꿈과의 관계
insert into dream_relation (from_slug, to_slug, weight) values
('water-dream', 'blood-dream', 0.7),
('water-dream', 'fire-dream', 0.8),
('water-dream', 'falling-dream', 0.6),
('water-dream', 'lost-dream', 0.7);

-- =================================================================
-- 샘플 AI 세션 데이터
-- =================================================================

-- 샘플 AI 세션들
insert into ai_session (prompt, result) values
('{"keywords":["뱀","검은색"],"scenario":"chased","emotions":["fear"],"details":"검은 뱀이 쫓아와서 무서웠어요"}',
 '{"summary":"검은 뱀에게 쫓기는 꿈은 관계 긴장과 무의식적 두려움을 나타냅니다.","hypotheses":[{"label":"관계 긴장","score":0.75,"confidence":0.7,"evidence":["black snake","fear","chased"]}],"positive_signs":["변화 준비","새로운 시작"],"caution_points":["관계 갈등","불안 누적"],"related_slugs":["baem-snake-dream","chased-dream"],"disclaimer":"이 내용은 상징 해석 정보이며 의료·법률 자문이 아닙니다."}'),

('{"keywords":["이빨"],"scenario":"","emotions":["anxiety"],"details":"앞니가 빠져서 피가 나요"}',
 '{"summary":"이빨 빠지는 꿈은 불안과 변화에 대한 두려움을 반영합니다.","hypotheses":[{"label":"자기 불안","score":0.8,"confidence":0.75,"evidence":["tooth loss","blood","anxiety"]}],"positive_signs":["성장 기회","변화 준비"],"caution_points":["스트레스 관리","건강 주의"],"related_slugs":["tooth-loss-dream","blood-dream"],"disclaimer":"이 내용은 상징 해석 정보이며 의료·법률 자문이 아닙니다."}');

-- =================================================================
-- 샘플 검색 로그 데이터
-- =================================================================

-- 샘플 검색 로그들
insert into search_log (q, ua) values
('뱀 꿈', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('이빨 꿈 해몽', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
('물 꿈', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'),
('나는 꿈', 'Mozilla/5.0 (Android 11; Mobile) AppleWebKit/537.36'),
('쫓기는 꿈', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('돈 꿈', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36'),
('집 꿈', 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'),
('시험 꿈', 'Mozilla/5.0 (Android 10; Mobile) AppleWebKit/537.36'),
('길 잃음 꿈', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('결혼 꿈', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

-- =================================================================
-- 인기도 업데이트 (샘플 데이터 기반)
-- =================================================================

-- 검색 로그를 기반으로 인기도 업데이트
update dream_symbol
set popularity = popularity + (
  select count(*) * 10
  from search_log
  where q like '%' || dream_symbol.name || '%'
  or q like '%' || dream_symbol.slug || '%'
);
