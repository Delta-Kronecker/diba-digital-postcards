import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:4173/diba-digital-postcards/';

test('keyboard opens envelope', async ({ page }) => {
  await page.goto(BASE + '#wedding');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
  const env = page.getByLabel('گشودن پاکت دعوت');
  await env.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1300);
  await expect(page.locator('text=امیرحسین')).toBeVisible({ timeout: 10000 });
});