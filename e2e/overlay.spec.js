import { test as setup, expect } from '@playwright/test';

// Create a special test that doesn't use the authenticated state
setup.use({ storageState: { cookies: [], origins: [] } });

setup('Sign-in overlay is visible for unauthenticated users', async ({ page }) => {
  // Navigate to the homepage without authentication
  await page.goto('http://localhost:3000');
  
  // The sign-in overlay should be visible for unauthenticated users
  const overlay = page.locator('#signin-overlay');
  await expect(overlay).toBeVisible();
  
  // Check for the sign-in title
  const title = page.locator('#signin-title');
  await expect(title).toHaveText('Sign in to continue');
});
