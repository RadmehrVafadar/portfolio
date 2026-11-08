import { test, expect } from '@playwright/test';

test('changelog serves its history, local screenshots, and year navigation', { tag: '@smoke' }, async ({ page, request }, testInfo) => {
  const errors = [];
  const externalRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (new URL(request.url()).origin !== new URL(testInfo.project.use.baseURL).origin) externalRequests.push(request.url());
  });
  await page.goto('/changelog/');
  await expect(page).toHaveTitle("Changelog | Rad's Arcade");
  await expect(page.getByRole('heading', { name: 'Changelog', exact: true })).toBeVisible();
  await expect(page.locator('article')).toHaveCount(9);
  const dates = await page.locator('article time').evaluateAll(nodes => nodes.map(node => node.dateTime));
  expect(dates).toEqual([...dates].sort().reverse());
  for (const link of await page.locator('article a[href*="/commit/"]').all()) {
    await expect(link).toHaveAttribute('href', /^https:\/\/github\.com\/RadmehrVafadar\/ArcadeEnv\/commit\/[a-f0-9]{40}$/);
  }
  for (const link of await page.locator('article a[href]:not([href^="https:"])').all()) {
    const href = await link.getAttribute('href');
    const response = await request.get(new URL(href, page.url()).href);
    expect(response.ok(), `Local article link: ${href}`).toBe(true);
  }
  const images = page.locator('article img');
  expect(await images.count()).toBeGreaterThanOrEqual(6);
  for (const image of await images.all()) {
    const src = await image.getAttribute('src');
    const response = await request.get(new URL(src, page.url()).href);
    expect(response.ok(), src).toBe(true);
    expect(response.headers()['content-type']).toMatch(/^image\//);
    await expect(image).toHaveAttribute('alt', /\S+/);
  }
  await page.getByRole('link', { name: '2024', exact: true }).click();
  await expect(page).toHaveURL(/#2024$/);
  await expect(page.getByRole('heading', { name: '2024', exact: true })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(await page.evaluate(async () => {
    const faces = await document.fonts.load('32px "Arcade Interlaced"');
    return faces.length > 0 && faces.every(face => face.status === 'loaded');
  })).toBe(true);
  expect(errors).toEqual([]);
  expect(externalRequests).toEqual([]);
  const home = await request.get('/');
  expect(await home.text()).toContain('href="/changelog/"');
});

test('changelog remains readable with keyboard navigation and enlarged text', async ({ page }) => {
  await page.goto('/changelog/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to changes' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
