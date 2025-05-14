// @ts-check
import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './e2e', // Only look for Playwright tests in the e2e directory
  timeout: 30000, // Increase timeout to 30 seconds
  
  // Create a reusable authentication state
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  
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
});
