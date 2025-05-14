// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', // Only look for Playwright tests in the e2e directory
  timeout: 30000, // Increase timeout to 30 seconds

  // Create a reusable authentication state
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/test-results.json' }],
  ],

  // Set up projects for different test scenarios
  projects: [
    // Setup project that will create the authentication state
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
    },

    // Test project that uses the authenticated state
    {
      name: 'authenticated',
      testMatch: /.*\.spec\.js/,
      dependencies: ['setup'],
      use: {
        // Use the authenticated state
        storageState: 'playwright/.auth/user.json',
      },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 5000,
  },
});
