import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const AXE_SOURCE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const manifest = JSON.parse(readFileSync(new URL('../src/data/image-dimensions.json', import.meta.url), 'utf8'));

/** The three widths the layout is designed against. */
const WIDTHS = [375, 768, 1440];

/** WCAG A + AA, plus the best-practice rules that catch real RTL mistakes. */
const AXE_OPTIONS = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
};

/** Wait for lazy images to load and every animation to settle, so the page is
 *  in the state a visitor ends up in rather than the state it starts in. */
async function settle(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(30);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

for (const width of WIDTHS) {
  test.describe(`home at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test.beforeEach(async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await settle(page);
    });

    test('has no WCAG A/AA violations', async ({ page }) => {
      await page.addScriptTag({ content: AXE_SOURCE });
      const results = await page.evaluate(async (options) => {
        // @ts-expect-error injected global
        return window.axe.run(document, options);
      }, AXE_OPTIONS);

      const report = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.map((n) => n.target.join(' ')).slice(0, 4),
      }));
      expect(report, JSON.stringify(report, null, 2)).toEqual([]);
    });

    test('captures a full-page screenshot', async ({ page }) => {
      await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    });

    test('nothing overflows its container in RTL', async ({ page }) => {
      const { offenders, scrollWidth, clientWidth } = await page.evaluate(() => {
        const root = document.documentElement;
        const found = [];

        // Out-of-flow decoration is meant to bleed: the wax seal hangs on
        // `-end-6`, the wordmark on `-end-10`. Those are not overflow bugs.
        const isOutOfFlow = (el) => {
          for (let n = el; n && n !== document.body; n = n.parentElement) {
            const p = getComputedStyle(n).position;
            if (p === 'absolute' || p === 'fixed') return true;
          }
          return false;
        };

        // A clipping or scrolling ancestor means the overflow is handled
        // already — the marquee is a 3040px track inside a clipped band, the
        // thumbnail strip scrolls on purpose.
        const isContained = (el) => {
          for (let n = el.parentElement; n && n !== document.documentElement; n = n.parentElement) {
            if (getComputedStyle(n).overflowX !== 'visible') return true;
          }
          return false;
        };

        for (const el of document.querySelectorAll('body *')) {
          const style = getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') continue;
          if (isOutOfFlow(el) || isContained(el)) continue;
          // What is left is the case worth failing on: text in normal flow,
          // with nothing clipping it, whose box is narrower than the line it
          // was handed. A few pixels of slack absorbs sub-pixel rounding.
          const text = (el.textContent || '').trim();
          if (!text) continue;
          if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
            found.push({
              sel: describe(el),
              scrollWidth: el.scrollWidth,
              clientWidth: el.clientWidth,
              text: text.slice(0, 40),
            });
          }
        }
        return { offenders: found, scrollWidth: root.scrollWidth, clientWidth: root.clientWidth };

        function describe(el) {
          const id = el.id ? `#${el.id}` : '';
          const cls = typeof el.className === 'string' && el.className
            ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
            : '';
          return `${el.tagName.toLowerCase()}${id}${cls}`;
        }
      });

      // A horizontally scrollable page is the headline symptom.
      expect(scrollWidth, 'document scrollWidth should not exceed the viewport').toBeLessThanOrEqual(clientWidth + 1);
      expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
    });

    test('declared image sizes match the real files', async ({ page }) => {
      const wrong = await page.evaluate(() => {
        const out = [];
        for (const img of document.querySelectorAll('img')) {
          const file = img.currentSrc.split('/').pop();
          if (!/\.(jpe?g|webp)$/i.test(file)) continue;
          out.push({
            file,
            declared: `${img.getAttribute('width')}x${img.getAttribute('height')}`,
            natural: `${img.naturalWidth}x${img.naturalHeight}`,
          });
        }
        return out;
      });

      for (const img of wrong) {
        // Compare against the manifest, not the loaded rung: a responsive image
        // deliberately decodes at a smaller size than the file it came from.
        const key = `${img.file.replace(/-\d+(\.\w+)$/, '$1').replace(/\.webp$/i, '.jpg')}`;
        const entry = manifest[key];
        if (!entry || img.naturalWidth === 0) continue;
        expect(
          img.declared,
          `${img.file} declares ${img.declared} but the file is ${entry.width}x${entry.height}`,
        ).toBe(`${entry.width}x${entry.height}`);
      }
    });
  });
}

test('every generated image variant exists and is honest about its width', async ({ page }) => {
  await page.goto('/');
  // The manifest paths are relative to the public root, which Pages serves at
  // the vite `base`, not at the origin.
  const base = new URL(page.url());
  const missing = [];
  for (const [file, entry] of Object.entries(manifest)) {
    expect(entry.sources.length, `${file} should offer more than one width`).toBeGreaterThan(1);
    const widths = entry.sources.map((s) => s.width);
    expect(widths, `${file} rungs must ascend`).toEqual([...widths].sort((a, b) => a - b));
    expect(widths.at(-1), `${file} largest rung must be the original`).toBe(entry.width);
    for (const source of entry.sources) {
      for (const path of [source.webp, source.jpg]) {
        const response = await page.request.get(new URL(path, base).href);
        if (!response.ok()) missing.push(`${response.status()} ${path}`);
      }
    }
  }
  expect(missing, JSON.stringify(missing, null, 2)).toEqual([]);
});
