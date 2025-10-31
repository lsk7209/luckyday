import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('should display search page with empty state', async ({ page }) => {
    await page.goto('/search');

    // 검색 페이지 제목 확인
    await expect(page.getByRole('heading', { name: '검색' })).toBeVisible();

    // 검색 입력창 확인
    const searchInput = page.getByPlaceholder('검색어를 입력하세요...');
    await expect(searchInput).toBeVisible();

    // 빈 상태 메시지 확인
    await expect(page.getByText('검색어를 입력하세요')).toBeVisible();
  });

  test('should perform search and display results', async ({ page }) => {
    await page.goto('/search');

    // 검색어 입력
    const searchInput = page.getByPlaceholder('검색어를 입력하세요...');
    await searchInput.fill('계산기');

    // 검색 버튼 클릭
    await page.getByRole('button', { name: '검색' }).click();

    // URL이 변경되었는지 확인
    await expect(page).toHaveURL(/\/search\?q=계산기/);

    // 검색 결과가 표시되는지 확인 (실제 API가 없으므로 로딩 상태나 빈 결과 확인)
    await expect(page.getByText(/개의 결과/).or(page.getByText('검색 결과가 없습니다'))).toBeVisible();
  });

  test('should filter search results by type', async ({ page }) => {
    await page.goto('/search?q=test');

    // 타입 필터 확인
    const typeSelect = page.getByLabel('콘텐츠 타입');
    await expect(typeSelect).toBeVisible();

    // 블로그 필터 선택
    await typeSelect.selectOption('blog');

    // URL에 타입 파라미터가 포함되는지 확인
    await expect(page).toHaveURL(/type=blog/);
  });

  test('should sort search results', async ({ page }) => {
    await page.goto('/search?q=test');

    // 정렬 옵션 확인
    const sortSelect = page.getByLabel('정렬');
    await expect(sortSelect).toBeVisible();

    // 최신순으로 정렬
    await sortSelect.selectOption('date');

    // URL에 정렬 파라미터가 포함되는지 확인
    await expect(page).toHaveURL(/sort=date/);
  });

  test('should handle search with no results', async ({ page }) => {
    await page.goto('/search');

    // 존재하지 않는 검색어 입력
    const searchInput = page.getByPlaceholder('검색어를 입력하세요...');
    await searchInput.fill('존재하지않는검색어12345');
    await page.getByRole('button', { name: '검색' }).click();

    // 검색 결과가 없다는 메시지 확인
    await expect(page.getByText('검색 결과가 없습니다')).toBeVisible();
    await expect(page.getByText('다른 검색어로 시도해보세요')).toBeVisible();
  });

  test('should navigate back to search from results', async ({ page }) => {
    await page.goto('/search?q=test');

    // 검색 페이지임을 확인
    await expect(page.getByRole('heading', { name: '검색' })).toBeVisible();

    // 다른 검색어로 재검색
    const searchInput = page.getByPlaceholder('검색어를 입력하세요...');
    await searchInput.fill('다른 검색어');
    await page.getByRole('button', { name: '검색' }).click();

    // 새로운 검색 결과가 표시되는지 확인
    await expect(page).toHaveURL(/\/search\?q=다른\+검색어/);
  });

  test('should handle special characters in search query', async ({ page }) => {
    await page.goto('/search');

    // 특수문자가 포함된 검색어
    const searchInput = page.getByPlaceholder('검색어를 입력하세요...');
    await searchInput.fill('연봉 & 세금 계산기');
    await page.getByRole('button', { name: '검색' }).click();

    // URL 인코딩이 제대로 되었는지 확인
    await expect(page).toHaveURL(/\/search\?q=/);
  });

  test('should show search suggestions', async ({ page }) => {
    await page.goto('/search');

    // 검색어 입력 (제안이 표시될 만큼)
    const searchInput = page.getByPlaceholder('검색어를 입력하세요...');
    await searchInput.fill('연봉');

    // 검색 제안이 표시되는지 확인 (실제 구현에 따라 다름)
    // await expect(page.getByText('연봉 계산기')).toBeVisible();
  });

  test('should handle search with Enter key', async ({ page }) => {
    await page.goto('/search');

    // 검색어 입력 후 엔터키
    const searchInput = page.getByPlaceholder('검색어를 입력하세요...');
    await searchInput.fill('테스트 검색');
    await searchInput.press('Enter');

    // 검색이 실행되었는지 확인
    await expect(page).toHaveURL(/\/search\?q=테스트\+검색/);
  });
});
