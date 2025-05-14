import { test, expect } from '@playwright/test';

test('should submit the purchase invoice form with data', async ({ page }) => {
  // Go to the purchase invoices page
  await page.goto('http://localhost:3000/invoices/purchase');
  
  // Click the New Invoice button to open the modal
  await page.click('#new-invoice-btn');
  
  // Wait for the modal to be visible
  await expect(page.locator('#invoice-modal')).toBeVisible();
  
  // Generate a unique invoice number
  const invoiceNumber = `INV-001-${Date.now()}`;
  const vendor = 'Acme Corp';
  const issueDate = '2025-05-01';
  const dueDate = '2025-05-31';
  const amount = '1250.50';
  
  // Fill out the form
  await page.fill('#invoice-number-modal', invoiceNumber);
  await page.fill('#invoice-date', issueDate);
  await page.fill('#invoice-description', 'Test invoice from Playwright');
  await page.fill('#invoice-quantity', '1');
  await page.fill('#invoice-price', amount);
  await page.selectOption('#invoice-currency', 'EUR');
  await page.fill('#invoice-vat', '0'); // Set VAT to 0 to make amount calculation simpler
  await page.selectOption('#invoice-payment-method', 'bank_transfer');
  
  // Submit the form
  await page.click('#save-btn');
  
  // Wait for the modal to close
  await expect(page.locator('#invoice-modal')).not.toBeVisible();
  
  // Wait a moment for the table to update
  await page.waitForTimeout(1000);
  
  // Check if the invoice is displayed in the table
  const table = page.locator('#invoices-table');
  await expect(table).toBeVisible();
  
  // Check if the invoice number is in the table
  const invoiceCell = page.locator(`#invoices-table tbody tr td:has-text("${invoiceNumber}")`);
  await expect(invoiceCell).toBeVisible();
  
  // Check that the row exists and contains the expected data
  const row = page.locator('#invoices-table tbody tr').first();
  await expect(row).toBeVisible();
  
  // Check that the amount is displayed correctly
  const amountCell = row.locator('td').nth(4);
  const amountText = await amountCell.textContent();
  
  // Check that the amount contains the expected value (allowing for currency formatting)
  expect(amountText).toContain('1250.50');
});
