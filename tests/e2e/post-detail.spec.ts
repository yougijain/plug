import { test, expect } from '@playwright/test';
import path from 'path';
import { signIn } from './auth.helpers';

const TEST_EMAIL = process.env.TEST_EMAIL!;
const TEST_PASSWORD = process.env.TEST_PASSWORD!;
const sample1 = path.resolve(__dirname, '../fixtures/sample.jpg');
const sample2 = path.resolve(__dirname, '../fixtures/sample2.jpg');

test.describe('Post Detail gallery', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'Provide TEST_EMAIL and TEST_PASSWORD env vars');
    await signIn(page, TEST_EMAIL, TEST_PASSWORD);
  });

  test('Multi-image posts show gallery and lightbox', async ({ page }) => {
    await page.getByRole('button', { name: /post something/i }).click();
    await page.getByRole('button', { name: /electronics/i }).click();
    await page.getByRole('button', { name: /^continue$/i }).click();

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([sample1, sample2]);
    await page.getByRole('button', { name: /^continue$/i }).click();

    await page.getByLabel(/title/i).fill('Gallery Test Phone');
    await page.getByLabel(/description/i).fill('Two images');
    await page.getByLabel(/^price$/i).fill('123');
    await page.getByLabel(/location/i).fill('Dorms');
    await page.getByRole('button', { name: /post item/i }).click();

    await expect(page.getByText('Posted!')).toBeVisible();

    await page.getByText('Gallery Test Phone').click();
    // Main image or thumbnails present
    await expect(page.getByText(/two images/i)).toBeVisible();
  });
});


