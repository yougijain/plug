import { test, expect, Page } from '@playwright/test';

/**
 * End-to-end coverage of the demo backend — the configuration the public
 * deployment runs in. Unlike the Supabase specs in this folder, these need no
 * credentials and no database, so they run anywhere.
 */

const enterDemo = async (page: Page) => {
  await page.goto('/');
  await page.getByRole('button', { name: /explore the demo/i }).click();
  await expect(page.getByRole('heading', { name: 'Plug', exact: true })).toBeVisible();
};

test.describe('Demo mode', () => {
  test('a visitor can enter without an account and see seeded listings', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /welcome to plug/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /explore the demo/i })).toBeVisible();

    await page.getByRole('button', { name: /explore the demo/i }).click();

    await expect(page.getByText(/demo mode/i).first()).toBeVisible();
    await expect(page.getByText('iPhone 13 Pro — 128GB, Graphite').first()).toBeVisible();
    await expect(page.getByText('Purdue vs. Indiana — 2 tickets, Section 8')).toBeVisible();
  });

  test('the featured card is derived from feed data, not hardcoded', async ({ page }) => {
    await enterDemo(page);

    const featured = page.getByText('🔥 Plug of the Day').locator('..').locator('..');
    // The priciest active listing in the seed is the iPhone at $520.
    await expect(featured.getByRole('heading')).toHaveText('iPhone 13 Pro — 128GB, Graphite');
    await expect(featured.getByText('$520')).toBeVisible();

    await featured.getByRole('button', { name: /view details/i }).click();
    await expect(page).toHaveURL(/\/post\/post-iphone-13-pro$/);
  });

  test('category filter and search narrow the feed', async ({ page }) => {
    await enterDemo(page);

    await page.getByRole('button', { name: /all categories/i }).click();
    await page.getByRole('button', { name: /books/i }).click();

    await expect(page.getByText('Stewart Calculus, 8th Ed. (MA 161/162)')).toBeVisible();
    await expect(page.getByText('iPhone 13 Pro — 128GB, Graphite')).toHaveCount(0);

    await page.getByRole('button', { name: /^books$/i }).click();
    await page.getByRole('button', { name: /all categories/i }).click();

    await page.getByPlaceholder(/search everything/i).fill('futon');
    await expect(page.getByText('Grey futon — folds flat, fits a dorm')).toBeVisible();
    await expect(page.getByText('Stewart Calculus, 8th Ed. (MA 161/162)')).toHaveCount(0);
  });

  test('a listing detail page can be deep-linked', async ({ page }) => {
    await enterDemo(page);
    await page.goto('/post/post-trek-bike');

    await expect(page.getByText('Trek FX 2 hybrid — tuned last month')).toBeVisible();
    await expect(page.getByText(/\$230/)).toBeVisible();
  });

  test('the live tab shows flash deals only', async ({ page }) => {
    await enterDemo(page);
    await page.goto('/live');

    await expect(page.getByText('Tonight: Elliott Hall show — 1 ticket')).toBeVisible();
    // A regular listing must not leak into the flash-deal feed.
    await expect(page.getByText('Dell 27" 1440p monitor + stand')).toHaveCount(0);
  });

  test('a visitor can create a listing and find it in the feed', async ({ page }) => {
    await enterDemo(page);

    await page.goto('/post');
    await page.getByRole('button', { name: /electronics/i }).click();
    await page.getByRole('button', { name: /^continue$/i }).click();
    await page.getByRole('button', { name: /^continue$/i }).click(); // photos are optional

    await page.getByLabel(/^title/i).fill('Mechanical keyboard, brown switches');
    await page.getByLabel(/^description/i).fill('Barely used, comes with the original cable.');
    await page.getByLabel(/^price$/i).fill('65');
    await page.getByLabel(/^location/i).fill('Purdue — Third Street Suites');

    await page.getByRole('button', { name: /post item/i }).click();

    await expect(page.getByText('Posted!')).toBeVisible();
    await expect(page.getByText('Mechanical keyboard, brown switches')).toBeVisible();
  });

  test('a conversation loads and accepts a reply', async ({ page }) => {
    await enterDemo(page);
    await page.goto('/messages');

    await page.getByText('iPhone 13 Pro — 128GB, Graphite').first().click();
    await expect(page.getByText(/that is as low as I can go/i)).toBeVisible();

    const draft = page.getByPlaceholder(/message/i);
    await draft.fill('Works for me — see you at the Union at 3.');
    await page.getByRole('button', { name: /send message/i }).click();

    await expect(page.getByText('Works for me — see you at the Union at 3.')).toBeVisible();
  });

  test('an unknown route falls back to the feed', async ({ page }) => {
    await enterDemo(page);
    await page.goto('/not-a-real-route');

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText('iPhone 13 Pro — 128GB, Graphite').first()).toBeVisible();
  });

  test('resetting demo data clears visitor-created listings', async ({ page }) => {
    await enterDemo(page);

    await page.goto('/post');
    await page.getByRole('button', { name: /books/i }).first().click();
    await page.getByRole('button', { name: /^continue$/i }).click();
    await page.getByRole('button', { name: /^continue$/i }).click();
    await page.getByLabel(/^title/i).fill('Throwaway listing');
    await page.getByLabel(/^description/i).fill('Should not survive a reset.');
    await page.getByLabel(/^location/i).fill('Library');
    await page.getByRole('button', { name: /post item/i }).click();
    await expect(page.getByText('Throwaway listing')).toBeVisible();

    await page.getByRole('button', { name: /reset/i }).click();

    // Reset keeps the visitor signed in and restores the seeded dataset.
    await expect(page.getByText('iPhone 13 Pro — 128GB, Graphite').first()).toBeVisible();
    await expect(page.getByText('Throwaway listing')).toHaveCount(0);
  });
});
