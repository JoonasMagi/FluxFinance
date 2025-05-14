import { test as setup } from '@playwright/test';

// These tests are now redundant since we're using auth.setup.js for authentication
// We'll keep them as placeholders but mark them as skipped

setup.skip('Sign-in form inputs have visible labels', async ({ page }) => {
  // This functionality is now tested in auth.setup.js
});

setup.skip('Sign-in form is keyboard navigable', async ({ page }) => {
  // This functionality is now tested in auth.setup.js
});
