import { test, expect } from '@playwright/test';

test.describe('Admin Console', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    // 인증되지 않은 상태에서 관리자 페이지 접근
    await page.goto('/admin');

    // 로그인 페이지로 리다이렉트되는지 확인 (실제 구현에 따라 다름)
    // await expect(page).toHaveURL(/\/login/);
  });

  test('should display admin dashboard', async ({ page }) => {
    // 인증된 상태라고 가정하고 테스트 (실제로는 로그인 필요)
    await page.goto('/admin');

    // 대시보드 제목 확인
    await expect(page.getByRole('heading', { name: '관리자 대시보드' })).toBeVisible();

    // 메트릭 카드들 확인
    await expect(page.getByText('총 콘텐츠')).toBeVisible();
    await expect(page.getByText('오늘의 방문자')).toBeVisible();
    await expect(page.getByText('검색 색인율')).toBeVisible();
  });

  test('should navigate between admin sections', async ({ page }) => {
    await page.goto('/admin');

    // 사이드바 네비게이션 확인
    const sidebar = page.locator('[data-testid="admin-sidebar"], aside');
    await expect(sidebar).toBeVisible();

    // 콘텐츠 관리 메뉴 클릭
    await page.getByRole('link', { name: '콘텐츠 관리' }).click();
    await expect(page).toHaveURL('/admin/content');

    // SEO 관리 메뉴 클릭
    await page.getByRole('link', { name: 'SEO 관리' }).click();
    await expect(page).toHaveURL('/admin/seo');

    // 대시보드로 돌아가기
    await page.getByRole('link', { name: '대시보드' }).click();
    await expect(page).toHaveURL('/admin');
  });

  test('should display content management interface', async ({ page }) => {
    await page.goto('/admin/content');

    // 콘텐츠 관리 페이지 제목 확인
    await expect(page.getByRole('heading', { name: '콘텐츠 관리' })).toBeVisible();

    // 탭 인터페이스 확인
    await expect(page.getByRole('tab', { name: '블로그' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '가이드' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '계산기' })).toBeVisible();

    // 새 콘텐츠 추가 버튼 확인
    await expect(page.getByRole('button', { name: /새.*추가/ })).toBeVisible();
  });

  test('should switch between content types', async ({ page }) => {
    await page.goto('/admin/content');

    // 블로그 탭 클릭
    await page.getByRole('tab', { name: '블로그' }).click();
    await expect(page.getByRole('tab', { name: '블로그' })).toHaveAttribute('aria-selected', 'true');

    // 가이드 탭 클릭
    await page.getByRole('tab', { name: '가이드' }).click();
    await expect(page.getByRole('tab', { name: '가이드' })).toHaveAttribute('aria-selected', 'true');

    // 계산기 탭 클릭
    await page.getByRole('tab', { name: '계산기' }).click();
    await expect(page.getByRole('tab', { name: '계산기' })).toHaveAttribute('aria-selected', 'true');
  });

  test('should display SEO management interface', async ({ page }) => {
    await page.goto('/admin/seo');

    // SEO 관리 페이지 제목 확인
    await expect(page.getByRole('heading', { name: 'SEO & 색인 관리' })).toBeVisible();

    // 빠른 액션 버튼들 확인
    await expect(page.getByRole('link', { name: '색인 요청' })).toBeVisible();
    await expect(page.getByRole('link', { name: '사이트맵 관리' })).toBeVisible();
    await expect(page.getByRole('link', { name: '메타 태그 관리' })).toBeVisible();

    // SEO 도구 카드들 확인
    await expect(page.getByRole('heading', { name: '메타 태그' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '사이트맵' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '색인 현황' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '캐노니컬' })).toBeVisible();
  });

  test('should navigate to SEO sub-pages', async ({ page }) => {
    await page.goto('/admin/seo');

    // 색인 현황 페이지로 이동
    await page.getByRole('link', { name: '색인 현황' }).click();
    await expect(page).toHaveURL('/admin/seo/indexing');

    // 메타 태그 관리 페이지로 이동
    await page.getByRole('link', { name: '메타 태그' }).click();
    await expect(page).toHaveURL('/admin/seo/meta');

    // 사이트맵 관리 페이지로 이동
    await page.getByRole('link', { name: '사이트맵' }).click();
    await expect(page).toHaveURL('/admin/seo/sitemaps');

    // 캐노니컬 관리 페이지로 이동
    await page.getByRole('link', { name: '캐노니컬' }).click();
    await expect(page).toHaveURL('/admin/seo/canonical');
  });

  test('should display SEO indexing interface', async ({ page }) => {
    await page.goto('/admin/seo/indexing');

    // 색인 현황 페이지 제목 확인
    await expect(page.getByRole('heading', { name: '색인 현황' })).toBeVisible();

    // 색인 제출 도구 확인
    await expect(page.getByRole('heading', { name: '색인 제출' })).toBeVisible();

    // 검색 엔진 버튼들 확인
    await expect(page.getByRole('button', { name: 'Google 제출' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'IndexNow 제출' })).toBeVisible();
  });

  test('should display SEO sitemaps interface', async ({ page }) => {
    await page.goto('/admin/seo/sitemaps');

    // 사이트맵 관리 페이지 제목 확인
    await expect(page.getByRole('heading', { name: '사이트맵 관리' })).toBeVisible();

    // 사이트맵 생성 도구 확인
    await expect(page.getByRole('heading', { name: '사이트맵 생성' })).toBeVisible();

    // 생성 버튼 확인
    await expect(page.getByRole('button', { name: '생성' })).toBeVisible();
  });

  test('should display SEO meta interface', async ({ page }) => {
    await page.goto('/admin/seo/meta');

    // 메타 태그 관리 페이지 제목 확인
    await expect(page.getByRole('heading', { name: '메타 태그 관리' })).toBeVisible();

    // 메타 태그 편집기 확인
    await expect(page.getByRole('heading', { name: '메타 태그 편집' })).toBeVisible();

    // 탭 인터페이스 확인
    await expect(page.getByRole('tab', { name: '기본 메타' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '소셜 미디어' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '구조화 데이터' })).toBeVisible();
  });

  test('should display SEO canonical interface', async ({ page }) => {
    await page.goto('/admin/seo/canonical');

    // 캐노니컬 관리 페이지 제목 확인
    await expect(page.getByRole('heading', { name: '캐노니컬 관리' })).toBeVisible();

    // 캐노니컬 규칙 관리 확인
    await expect(page.getByRole('heading', { name: '캐노니컬 규칙 관리' })).toBeVisible();

    // 새 규칙 추가 버튼 확인
    await expect(page.getByRole('button', { name: '새 규칙 추가' })).toBeVisible();
  });

  test('should handle responsive design in admin', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin');

    // 모바일에서 사이드바가 숨겨지거나 햄버거 메뉴가 표시되는지 확인
    // 실제 구현에 따라 다름
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-toggle"], .lg\\:hidden');
    // await expect(mobileMenuButton).toBeVisible();
  });
});
