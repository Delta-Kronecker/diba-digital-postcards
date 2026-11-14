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

/* The viewer's audio strip is the one block a phone width could not fit: its two
   cells had `min-width: auto`, and the player's play control and gain slider
   cannot shrink, so the pair pushed the sheet (and the document) 20–65 px past
   the viewport on every viewer route. `#home` never caught it — the strip only
   exists once the sheet opens. */
for (const width of [320, 375]) {
  test(`wedding viewer fits ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(BASE + '#wedding-amir-sara');
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button', { name: /گشودن پاکت/ }).first().click();
    await page.waitForTimeout(1400);
    await expect(page.locator('#audio-volume')).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(width + 1);
  });
}