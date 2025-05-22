import { test as setup, expect } from '@playwright/test';
import { login } from '../tests/utils/auth.js';

// This setup will run before all tests
setup('authenticate', async ({ page }) => {
  await login(page);
  
  // Store authentication state
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
