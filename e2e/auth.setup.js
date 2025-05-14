import { test as setup, expect } from '@playwright/test';

// This file will be used to set up authentication for all tests
setup('authenticate', async ({ page }) => {
  // Go to the homepage which shows the login form
  await page.goto('http://localhost:3000');
  
  // Verify the sign-in overlay is visible
  const overlay = page.locator('#signin-overlay');
  await expect(overlay).toBeVisible();
  
  // Fill in the login form
  await page.fill('#email', 'user@example.com');
  await page.fill('#password', 'password123');
  
  // Click the sign-in button
  await page.click('#signin-form button');
  
  // Wait for navigation or success indicator
  // This might be a redirect to dashboard or the overlay disappearing
  await expect(overlay).toBeHidden({ timeout: 10000 });
  
  // Store authentication state
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
