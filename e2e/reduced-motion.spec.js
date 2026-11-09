import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:4173/diba-digital-postcards/';

test('reduced motion removes transforms', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(BASE + '#wedding');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
  const transform = await page.evaluate(() => getComputedStyle(document.querySelector('[role="button"]') || document.body).transform);
  // Should not contain 3D transforms like rotateX when reduced
  expect(transform === 'none' || !transform.includes('matrix3d')).toBeTruthy();
  await context.close();
});