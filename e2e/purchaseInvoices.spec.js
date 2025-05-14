import { test, expect } from '@playwright/test';

test('Purchase Invoices page has table and New Invoice button', async ({ page }) => {
  await page.goto('http://localhost:3000/invoices/purchase');
  
  // Check for the New Invoice button
  const newInvoiceBtn = page.locator('#new-invoice-btn');
  await expect(newInvoiceBtn).toBeVisible();
  
  // Check for the invoices table
  const table = page.locator('#invoices-table');
  await expect(table).toBeVisible();
  
  // Check for table headers
  await expect(table.locator('th:has-text("Invoice #")')).toBeVisible();
  await expect(table.locator('th:has-text("Vendor")')).toBeVisible();
});
