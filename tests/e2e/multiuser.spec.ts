import { test, expect } from '@playwright/test';
import path from 'path';

const A_EMAIL = process.env.TEST_EMAIL!;
const A_PASSWORD = process.env.TEST_PASSWORD!;
const B_EMAIL = process.env.TEST_EMAIL_2!;
const B_PASSWORD = process.env.TEST_PASSWORD_2!;
const sampleImage = path.resolve(__dirname, '../fixtures/sample.jpg');

test.describe('Multi-user isolation', () => {
  test('User A posts, User B sees it in Home (not in Live when normal)', async ({ browser, baseURL }) => {
    test.skip(!(A_EMAIL && A_PASSWORD && B_EMAIL && B_PASSWORD), 'Set TEST_EMAIL/TEST_PASSWORD and TEST_EMAIL_2/TEST_PASSWORD_2');

    // Create two isolated contexts
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    // Sign in as A
    await pageA.goto(baseURL!);
    await pageA.getByRole('button', { name: /sign in/i }).click();
    await pageA.getByLabel(/email/i).fill(A_EMAIL);
    await pageA.getByLabel(/^password$/i).fill(A_PASSWORD);
    await pageA.getByRole('button', { name: /^sign in$/i }).click();
    await expect(pageA.getByText(/plug into campus life/i)).toBeVisible();

    // Sign in as B
    await pageB.goto(baseURL!);
    await pageB.getByRole('button', { name: /sign in/i }).click();
    await pageB.getByLabel(/email/i).fill(B_EMAIL);
    await pageB.getByLabel(/^password$/i).fill(B_PASSWORD);
    await pageB.getByRole('button', { name: /^sign in$/i }).click();
    await expect(pageB.getByText(/plug into campus life/i)).toBeVisible();

    // A creates a normal post
    await pageA.getByRole('button', { name: /post something/i }).click();
    await pageA.getByRole('button', { name: /electronics/i }).click();
    await pageA.getByRole('button', { name: /^continue$/i }).click();
    const fileInputA = pageA.locator('input[type="file"]');
    await fileInputA.setInputFiles(sampleImage);
    await pageA.getByRole('button', { name: /^continue$/i }).click();
    const title = `MultiUser Test ${Date.now()}`;
    await pageA.getByLabel(/title/i).fill(title);
    await pageA.getByLabel(/description/i).fill('Desc');
    await pageA.getByLabel(/^price$/i).fill('10');
    await pageA.getByLabel(/location/i).fill('Campus');
    await pageA.getByRole('button', { name: /post item/i }).click();
    await expect(pageA.getByText('Posted!')).toBeVisible();

    // B sees it on Home (not Live)
    await expect(pageB.getByText(title)).toBeVisible({ timeout: 10000 });
    await pageB.getByRole('button', { name: /see what's live/i }).click();
    await expect(pageB.getByText(title)).toHaveCount(0);

    await contextA.close();
    await contextB.close();
  });
});


