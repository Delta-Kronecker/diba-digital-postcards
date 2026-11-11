import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173/diba-digital-postcards/';

test('theme persists across reload', async ({ page }) => {
  await page.goto(BASE + '#home');
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('html')).toHaveClass(/light/);
  const toggle = page.getByLabel(/تغییر به حالت/).first();
  await toggle.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('html')).toHaveClass(/dark/);
});