import { test, expect } from '@playwright/test';
import path from 'path';
import { signIn } from './auth.helpers';

const TEST_EMAIL = process.env.TEST_EMAIL!;
const TEST_PASSWORD = process.env.TEST_PASSWORD!;
const sampleImage = path.resolve(__dirname, '../fixtures/sample.jpg');

test.describe('Live Now flow', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'Provide TEST_EMAIL and TEST_PASSWORD env vars');
    await signIn(page, TEST_EMAIL, TEST_PASSWORD);
  });

  test('Post to Live Now and verify progress', async ({ page }) => {
    await page.getByRole('button', { name: /post something/i }).click();
    await page.getByRole('button', { name: /electronics/i }).click();
    await page.getByRole('button', { name: /^continue$/i }).click();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(sampleImage);
    await page.getByRole('button', { name: /^continue$/i }).click();

    await page.getByLabel(/title/i).fill('Flash Deal Headphones');
    await page.getByLabel(/description/i).fill('Quick live test');
    await page.getByLabel(/^price$/i).fill('25');
    await page.getByLabel(/location/i).fill('Library');
    await page.getByLabel(/show in live now feed/i).check();
    await page.getByLabel(/live duration/i).selectOption('15m');
    await page.getByRole('button', { name: /post item/i }).click();

    await expect(page.getByText('Posted!')).toBeVisible();

    // Go to Live Now
    await page.getByRole('button', { name: /see what's live/i }).click();
    const card = page.getByText('Flash Deal Headphones');
    await expect(card).toBeVisible();
  });
});


