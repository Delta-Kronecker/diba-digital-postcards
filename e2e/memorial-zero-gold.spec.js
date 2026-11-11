import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173/diba-digital-postcards/';

// Every gold tone used anywhere in the studio palette, expressed as RGB.
// Memorial routes must never resolve to one of these.
const GOLD_RGB = [
  [154, 122, 68], // --color-gold (light)
  [201, 176, 138], // --color-gold-soft (light)
  [116, 88, 43], // --color-gold-deep (light)
  [198, 164, 104], // --color-gold (dark)
  [217, 194, 155], // --color-gold-soft (dark)
  [168, 133, 76], // --color-gold-deep (dark)
  [176, 139, 82], // legacy accent
  [180, 154, 112], // legacy accent
];

test('memorial has zero gold', async ({ page }) => {
  await page.goto(BASE + '#memorial');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);
  const env = page.getByLabel('گشودن پاکت یادبود');
  await env.click();
  await page.waitForTimeout(1300);

  const goldFound = await page.evaluate((goldRgb) => {
    const parse = (value) => {
      if (!value || value === 'none' || value === 'transparent') return null;
      const match = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
      if (!match) return null;
      return [Math.round(Number(match[1])), Math.round(Number(match[2])), Math.round(Number(match[3]))];
    };

    const isGold = (rgb) =>
      rgb &&
      goldRgb.some(
        ([r, g, b]) => Math.abs(rgb[0] - r) <= 2 && Math.abs(rgb[1] - g) <= 2 && Math.abs(rgb[2] - b) <= 2
      );

    const props = ['color', 'backgroundColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor'];

    return Array.from(document.querySelectorAll('*')).some((el) => {
      const style = getComputedStyle(el);
      return props.some((prop) => isGold(parse(style[prop])));
    });
  }, GOLD_RGB);

  expect(goldFound).toBe(false);
});
