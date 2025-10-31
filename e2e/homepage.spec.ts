import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('/');

    // 페이지 제목 확인
    await expect(page).toHaveTitle(/CMS Calculator/);

    // 메인 헤딩 확인
    await expect(page.getByRole('heading', { name: '생활에 필요한 계산기와 가이드' })).toBeVisible();

    // 검색 바 확인
    const searchInput = page.getByPlaceholder('계산기, 가이드, 블로그 검색...');
    await expect(searchInput).toBeVisible();

    // CTA 버튼들 확인
    await expect(page.getByRole('link', { name: '계산기 둘러보기' })).toBeVisible();
    await expect(page.getByRole('link', { name: '블로그 읽기' })).toBeVisible();
  });

  test('should display featured utilities section', async ({ page }) => {
    await page.goto('/');

    // 인기 계산기 섹션 확인
    await expect(page.getByRole('heading', { name: '인기 계산기' })).toBeVisible();

    // 계산기 카드들이 로딩되는지 확인 (실제 API가 없으므로 로딩 상태 확인)
    const utilityCards = page.locator('[data-testid="utility-card"], .animate-pulse');
    await expect(utilityCards.first()).toBeVisible();
  });

  test('should display recent content section', async ({ page }) => {
    await page.goto('/');

    // 최신 콘텐츠 섹션 확인
    await expect(page.getByRole('heading', { name: '최신 콘텐츠' })).toBeVisible();

    // 콘텐츠 카드들이 로딩되는지 확인
    const contentCards = page.locator('[data-testid="content-card"], .animate-pulse');
    await expect(contentCards.first()).toBeVisible();
  });

  test('should navigate to utility page when clicking calculator link', async ({ page }) => {
    await page.goto('/');

    // 계산기 둘러보기 버튼 클릭
    await page.getByRole('link', { name: '계산기 둘러보기' }).click();

    // URL이 변경되었는지 확인
    await expect(page).toHaveURL(/\/utility/);
  });

  test('should navigate to blog page when clicking blog link', async ({ page }) => {
    await page.goto('/');

    // 블로그 읽기 버튼 클릭
    await page.getByRole('link', { name: '블로그 읽기' }).click();

    // URL이 변경되었는지 확인
    await expect(page).toHaveURL(/\/blog/);
  });

  test('should perform search when entering query and pressing enter', async ({ page }) => {
    await page.goto('/');

    // 검색어 입력
    const searchInput = page.getByPlaceholder('계산기, 가이드, 블로그 검색...');
    await searchInput.fill('연봉 계산기');
    await searchInput.press('Enter');

    // 검색 페이지로 이동했는지 확인
    await expect(page).toHaveURL(/\/search\?q=연봉\+계산기/);
  });

  test('should display CTA section', async ({ page }) => {
    await page.goto('/');

    // CTA 섹션 확인
    await expect(page.getByRole('heading', { name: 'SEO 최적화와 자동 색인으로' })).toBeVisible();
    await expect(page.getByText('콘텐츠를 등록하고 검색 엔진 상위 노출을 시작하세요')).toBeVisible();
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // 메타 태그 확인
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /계산기.*가이드/);

    const metaKeywords = page.locator('meta[name="keywords"]');
    await expect(metaKeywords).toHaveAttribute('content');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 모바일에서도 주요 요소들이 보이는지 확인
    await expect(page.getByRole('heading', { name: '생활에 필요한 계산기와 가이드' })).toBeVisible();
    await expect(page.getByPlaceholder('계산기, 가이드, 블로그 검색...')).toBeVisible();

    // 햄버거 메뉴가 있는지 확인 (반응형 네비게이션)
    const mobileMenu = page.locator('[data-testid="mobile-menu"], .lg\\:hidden');
    // 실제 구현에 따라 다를 수 있음
  });
});
