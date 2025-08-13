import { Page, expect } from '@playwright/test';

export async function signIn(page: Page, email: string, password: string) {
  await page.goto('/');
  // Expect some unauthenticated content; adjust selector to your Login page copy
  // Fallback: directly navigate to /login if gate doesn't render
  if (!(await page.getByRole('button', { name: /sign in/i }).isVisible().catch(() => false))) {
    await page.goto('/login');
  }

  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByRole('button', { name: /^sign in$/i }).click();

  // Home header after auth
  await expect(page.getByText(/plug into campus life/i)).toBeVisible();
}


