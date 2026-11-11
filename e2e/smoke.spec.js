import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173/diba-digital-postcards/';

test.describe('Diba Digital Postcards smoke', () => {
  test('home loads', async ({ page }) => {
    await page.goto(BASE + '#home');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('h1')).toContainText('خاطره');
  });

  test('route to wedding', async ({ page }) => {
    await page.goto(BASE + '#wedding');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    await page.getByLabel('گشودن پاکت دعوت').click();
    await page.waitForTimeout(1300);
    await expect(page.locator('text=امیرحسین')).toBeVisible({ timeout: 10000 });
  });

  test('route to memorial', async ({ page }) => {
    await page.goto(BASE + '#memorial');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    await page.getByLabel('گشودن پاکت یادبود').click();
    await page.waitForTimeout(1300);
    await expect(page.locator('text=حاج رضا')).toBeVisible({ timeout: 10000 });
  });

  test('customizer page', async ({ page }) => {
    await page.goto(BASE + '#customizer');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=شکل بدهید')).toBeVisible({ timeout: 10000 });
  });

  test('404', async ({ page }) => {
    await page.goto(BASE + '#nonexistent-route-xyz');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('text=۴۰۴')).toBeVisible({ timeout: 10000 });
  });

  test('theme toggle dark/light', async ({ page }) => {
    await page.goto(BASE + '#home');
    await page.waitForLoadState('domcontentloaded');
    const html = page.locator('html');
    await expect(html).toHaveClass(/light/);
    const toggle = page.getByLabel(/تغییر به حالت/).first();
    await toggle.click();
    await expect(html).toHaveClass(/dark/);
    await toggle.click();
    await expect(html).toHaveClass(/light/);
  });

  test('envelope open keyboard Enter', async ({ page }) => {
    await page.goto(BASE + '#wedding');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    const env = page.getByLabel('گشودن پاکت دعوت');
    await env.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1300);
    await expect(page.locator('text=امیرحسین')).toBeVisible({ timeout: 10000 });
  });

  test('Esc closes modal', async ({ page }) => {
    await page.goto(BASE + '#wedding');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    const env = page.getByLabel('گشودن پاکت دعوت');
    await env.click();
    await page.waitForTimeout(1300);
    await page.locator('button', { hasText: 'اعلام حضور' }).first().click();
    await expect(page.locator('text=اعلام حضور').first()).toBeVisible({ timeout: 10000 });
    await page.keyboard.press('Escape');
    await expect(page.locator('text=ثبت نهایی پاسخ')).toBeHidden({ timeout: 5000 });
  });
});