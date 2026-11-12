import { test, expect } from '@playwright/test';

const BASE = 'http://127.0.0.1:4173/diba-digital-postcards/';

/**
 * Skill 04 (ui-ux-pro-max) — Forms & Feedback.
 * The RSVP form used to report validation in a summary-only error block at the
 * top of the form. The rules require an inline error tied to the field it
 * belongs to, announced to assistive tech, with focus moved to the invalid
 * control.
 */
test.describe('RSVP validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '#wedding');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    await page.getByLabel('گشودن پاکت دعوت').click();
    await page.waitForTimeout(1400);
    await page.locator('button', { hasText: 'اعلام حضور' }).first().click();
    await page.locator('button', { hasText: 'ثبت نهایی پاسخ' }).first().waitFor({ timeout: 10000 });
  });

  test('empty submit shows an inline error wired to the field', async ({ page }) => {
    await page.locator('button', { hasText: 'ثبت نهایی پاسخ' }).first().click();

    const error = page.locator('#rsvp-name-error');
    await expect(error).toBeVisible();
    await expect(error).toHaveAttribute('role', 'alert');

    const name = page.locator('#rsvp-name');
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    await expect(name).toHaveAttribute('aria-describedby', 'rsvp-name-error');
    await expect(name).toBeFocused();
  });

  test('typing a name clears the error and submit succeeds', async ({ page }) => {
    await page.locator('button', { hasText: 'ثبت نهایی پاسخ' }).first().click();
    await expect(page.locator('#rsvp-name-error')).toBeVisible();

    await page.locator('#rsvp-name').fill('سارا محمدی');
    await page.locator('#rsvp-notes').click();
    await expect(page.locator('#rsvp-name-error')).toBeHidden();

    await page.locator('button', { hasText: 'ثبت نهایی پاسخ' }).first().click();
    await expect(page.locator('text=پاسخ شما ذخیره شد')).toBeVisible({ timeout: 5000 });
  });
});
