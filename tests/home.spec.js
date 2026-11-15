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

/** Wait for lazy images to load and every scroll reveal to fire, so the page is
 *  in the state a visitor ends up in rather than the state it starts in.
 *
 *  Scrolling is done with real wheel events, not `window.scrollTo`. Chromium
 *  does not reliably deliver IntersectionObserver callbacks when the scroll
 *  position is teleported without an input event, so a `scrollTo` sweep leaves
 *  the reveals unfired — and a section sitting at `opacity: 0` hides its own
 *  overflow from the checks below. The loop verifies it actually reached the
 *  bottom for the same reason: a stalled sweep would otherwise pass silently. */
async function settle(page) {
  // The home page arrives in a lazily-loaded route chunk, so on a cold load
  // there is a window where nothing below the shell exists at all. Wait for the
  // content to mount rather than guessing a timeout — measuring a half-mounted
  // page is how a reveal assertion ends up testing an empty document.
  await page.waitForSelector('#collection', { state: 'attached', timeout: 30_000 });

  // Loop until the bottom is actually reached rather than for a computed number
  // of steps: the document height changes as reveals settle, so a fixed step
  // count stops short by however much the page grew on the way down.
  const step = 300;
  for (let i = 0; i < 300; i += 1) {
    const atBottom = await page.evaluate(
      () => scrollY >= document.documentElement.scrollHeight - innerHeight - 2,
    );
    if (atBottom) break;
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1200);

  const { reached, max } = await page.evaluate(() => ({
    reached: scrollY,
    max: document.documentElement.scrollHeight - innerHeight,
  }));
  expect(reached, 'the settle sweep must reach the bottom of the page').toBeGreaterThanOrEqual(max - 4);
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

/* ------------------------------------------------------------------ *
 * Scroll reveal (the motion pass)
 *
 * The reveal rests in `.motion-hidden` (opacity 0, translateY(24px)) and is
 * swapped to `animate-reveal-up` by an IntersectionObserver. The contract
 * these tests hold:
 *
 *   1. With motion, every reveal fires as the page is scrolled — nothing is
 *      stranded at opacity 0.
 *   2. With `prefers-reduced-motion: reduce`, everything is visible
 *      IMMEDIATELY, without scrolling at all, and carries no offset.
 *
 * (2) is the one that hurts most: the reduced-motion block in index.css
 * clamps `animation-duration` to 0.01ms, so a reveal that waited on an
 * animation — or worse on `animationend` — would leave the page blank for
 * exactly the people who asked for less motion.
 * ------------------------------------------------------------------ */

const REVEAL_SELECTOR = '[data-reveal], .motion-hidden, [class*="animate-reveal-up"]';

/** Wait for the browser to paint. Any assertion about rendered pixels needs at
 *  least one frame: reading `opacity` in the same tick the content mounts
 *  samples the animation's first frame, not the settled element. */
const nextPaint = (page) =>
  page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

/** Geometry of every revealable element, independent of scroll position. */
const readReveals = (page) =>
  page.evaluate((selector) =>
    [...document.querySelectorAll(selector)].map((el) => {
      const cs = getComputedStyle(el);
      // `translateY(0)` resolves to a float residue like -7.1e-15, which is not
      // movement. Compare numerically rather than against the string `none`.
      let offsetY = 0;
      const m = cs.transform && cs.transform.match(/matrix\(([^)]+)\)/);
      if (m) offsetY = Math.abs(Number(m[1].split(',')[5]) || 0);
      return { opacity: Number(cs.opacity), offsetY, hidden: el.classList.contains('motion-hidden') };
    }),
    REVEAL_SELECTOR,
  );

for (const width of WIDTHS) {
  test.describe(`scroll reveal at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('every reveal fires while scrolling, with motion enabled', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#collection', { state: 'attached', timeout: 30_000 });

      const before = await readReveals(page);
      expect(before.length, 'the page should carry revealable elements').toBeGreaterThan(0);
      expect(
        before.some((r) => r.hidden),
        'before scrolling, at least one element should still be waiting to reveal',
      ).toBe(true);

      await settle(page);

      const after = await readReveals(page);
      const stranded = after.filter((r) => r.hidden || r.opacity < 0.99 || r.offsetY > 0.5);
      expect(
        stranded,
        `${stranded.length} of ${after.length} elements never revealed`,
      ).toEqual([]);
    });

    test('screenshots with motion enabled', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await settle(page);
      await page.screenshot({ path: `test-results/motion/home-${width}.png`, fullPage: true });
    });
  });

  test.describe(`reduced motion at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });

    test('the whole page is visible before any scrolling', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#collection', { state: 'attached', timeout: 30_000 });
      // Nothing else: reduced motion must be visible on arrival, with no scroll
      // and no waiting for choreography. One paint, then the assertion.
      await nextPaint(page);

      const reveals = await readReveals(page);
      expect(reveals.length, 'the page should carry revealable elements').toBeGreaterThan(0);

      const wrong = reveals.filter((r) => r.hidden || r.opacity < 0.99 || r.offsetY > 0.5);
      expect(
        wrong,
        `${wrong.length} of ${reveals.length} elements are not fully visible without scrolling ` +
          `under prefers-reduced-motion: ${JSON.stringify(wrong.slice(0, 5))}`,
      ).toEqual([]);
    });

    test('screenshots with reduced motion', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      // No scrolling: reduced motion must render everything on arrival, and a
      // scroll sweep here would hide a failure where it does not. What the sweep
      // DOES legitimately do is fetch the `loading="lazy"` images below the fold
      // — so decode them directly instead. Without this the shot shows grey
      // placeholders where the card imagery belongs, which reads as a layout
      // defect when it is only an unfetched bitmap.
      await page.waitForSelector('#collection', { state: 'attached', timeout: 30_000 });
      // `loading="lazy"` images off-screen are never requested, and `decode()`
      // on one of those never settles — so trigger the fetch first, then wait.
      // A full-page screenshot stitches the page together without scrolling it,
      // and `decoding="async"` images then rasterise as blank boxes — a capture
      // artefact that reads exactly like a missing image. Forcing the fetch and
      // a synchronous decode first is what makes the shot tell the truth.
      await page.evaluate(async () => {
        const imgs = [...document.images];
        imgs.forEach((i) => {
          i.loading = 'eager';
          i.decoding = 'sync';
        });
        await Promise.all(imgs.map((i) => i.decode().catch(() => {})));
      });
      await page.waitForFunction(
        () => [...document.images].every((i) => i.complete && i.naturalWidth > 0),
        null,
        { timeout: 25_000 },
      );
      await nextPaint(page);
      await page.screenshot({ path: `test-results/reduced/home-${width}.png`, fullPage: true });
    });

    test('no horizontal overflow in RTL at 375', async ({ page }) => {
      test.skip(width !== 375, 'the overflow check is pinned to the narrowest breakpoint');
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#collection', { state: 'attached', timeout: 30_000 });

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth, 'the document must not scroll horizontally').toBeLessThanOrEqual(clientWidth + 1);
    });
  });
}
