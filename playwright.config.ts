import { defineConfig, devices } from '@playwright/test';

/**
 * E2E configuration.
 *
 * - By default the suite boots the dev server and runs against it.
 * - Set E2E_BASE_URL to run the same specs against a deployed build
 *   (e.g. `E2E_BASE_URL=https://plug.vercel.app npx playwright test`); no
 *   local server is started in that case.
 * - Set PLAYWRIGHT_CHROMIUM_PATH when Chromium is provided by the environment
 *   rather than by `npx playwright install`.
 */

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const usesLocalServer = !process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60000,
  retries: 0,
  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},
  },
  ...(usesLocalServer
    ? {
        webServer: {
          command: 'npm start',
          url: baseURL,
          reuseExistingServer: true,
          timeout: 120000,
        },
      }
    : {}),
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
