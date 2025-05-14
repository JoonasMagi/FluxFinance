import { test as setup } from '@playwright/test';

// This test is now redundant since we're using auth.setup.js for authentication
// We'll keep it as a placeholder but mark it as skipped
setup.skip('allows submission when both email and password are entered', async ({ page }) => {
  // This functionality is now tested in auth.setup.js
});
