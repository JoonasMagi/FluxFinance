import { test, expect } from '@playwright/test';

test('should have a table for displaying purchase invoices', async ({ page }) => {
  await page.goto('http://localhost:3000/invoices/purchase');
  
  // Check that the table exists
  const table = page.locator('#invoices-table');
  await expect(table).toBeVisible();
  
  // Verify table headers are present
  await expect(table.locator('th:has-text("Invoice #")')).toBeVisible();
  await expect(table.locator('th:has-text("Vendor")')).toBeVisible();
  await expect(table.locator('th:has-text("Issue Date")')).toBeVisible();
  await expect(table.locator('th:has-text("Due Date")')).toBeVisible();
  await expect(table.locator('th:has-text("Amount")')).toBeVisible();
  await expect(table.locator('th:has-text("Status")')).toBeVisible();
});
