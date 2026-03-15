import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'list',
  timeout: 120000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: 15000,
    navigationTimeout: 30000,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    }
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'npm run dev:api',
      port: 4000,
      cwd: '..',
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command: 'npm run dev:super',
      port: 3002,
      cwd: '..',
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command: 'npm run dev:admin',
      port: 3001,
      cwd: '..',
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command: 'npm run dev:storefront',
      port: 3000,
      cwd: '..',
      env: {
        NEXT_PUBLIC_API_URL: 'http://localhost:4000'
      },
      reuseExistingServer: false,
      timeout: 120000,
    }
  ],
});
