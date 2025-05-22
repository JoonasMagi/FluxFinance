// Utility function to perform login
export async function login(page) {
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
  await expect(overlay).toBeHidden({ timeout: 10000 });
  
  // Wait for the dashboard to be visible
  await expect(page.locator('h1')).toContainText('Dashboard');
}
