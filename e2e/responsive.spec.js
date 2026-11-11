import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173/diba-digital-postcards/';

for (const width of [375, 768, 1280]) {
  test(`home responsive ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(BASE + '#home');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    await expect(page.locator('h1')).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(width + 1);
  });
}