import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  //fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Increase retries in CI and locally for flakiness tolerance
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: 'html',
  // Global timeouts and headed execution
  timeout: 120000, // 2 minutes per test
  expect: {
    timeout: 10000, // 10s for expect assertions
  },
  use: {
    baseURL: process.env.SERVICENOW_URL || 'https://dev272960.service-now.com/',
    trace: 'on-first-retry',
    // Run browsers headed by default for better visibility during training/demo
    //headless: false,
    headless: !!process.env.CI,
    // Increase action and navigation timeouts
    actionTimeout: 30000,
    navigationTimeout: 60000,
    // Slow down actions a little for demo readability (optional)
    // slowMo: 50,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
