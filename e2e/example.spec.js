import { test, expect } from '@playwright/test';

test('authenticated homepage has correct title', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/FluxFinance/);
  
  // Since we're authenticated, the sign-in overlay should be hidden
  const overlay = page.locator('#signin-overlay');
  await expect(overlay).toBeHidden();
  
  // We should see the main content
  const appContent = page.locator('#app');
  await expect(appContent).toBeVisible();
});
