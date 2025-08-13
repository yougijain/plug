import { test, expect } from '@playwright/test';
import path from 'path';
import { signIn } from './auth.helpers';

const TEST_EMAIL = process.env.TEST_EMAIL!;
const TEST_PASSWORD = process.env.TEST_PASSWORD!;
const sampleImage = path.resolve(__dirname, '../fixtures/sample.jpg');

test.describe('Posting flow', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!TEST_EMAIL || !TEST_PASSWORD, 'Provide TEST_EMAIL and TEST_PASSWORD env vars');
    await signIn(page, TEST_EMAIL, TEST_PASSWORD);
  });

  test('Create a normal post with image, see toast, not in Live Now', async ({ page }) => {
    // Navigate to Post page (adjust selector if needed)
    await page.getByRole('button', { name: /post something/i }).click();

    // Step 1: choose category
    await page.getByRole('button', { name: /electronics/i }).click();
    await page.getByRole('button', { name: /^continue$/i }).click();

    // Step 2: add image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(sampleImage);
    await page.getByRole('button', { name: /^continue$/i }).click();

    // Step 3: fill details
    await page.getByLabel(/title/i).fill('Playwright Phone');
    await page.getByLabel(/description/i).fill('Mint condition test device.');
    await page.getByLabel(/^price$/i).fill('69.999');
    await page.getByLabel(/^price$/i).blur();
    await expect(page.getByLabel(/^price$/i)).toHaveValue('70.00');
    await page.getByLabel(/location/i).fill('Campus Center');

    // Ensure live now is unchecked
    const liveCheckbox = page.locator('input[type="checkbox"][id="flash-deal"]');
    if (await liveCheckbox.isChecked()) await liveCheckbox.uncheck();

    // Post
    await page.getByRole('button', { name: /post item/i }).click();

    // Home toast
    await expect(page.getByText('Posted!')).toBeVisible();

    // Should not be on Live Now by default
    await page.getByRole('button', { name: /see what's live/i }).click();
    await expect(page.getByText('Playwright Phone')).toHaveCount(0);
  });
});


