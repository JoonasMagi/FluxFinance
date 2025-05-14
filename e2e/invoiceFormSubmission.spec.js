import { test, expect } from '@playwright/test';

test('should submit the form with invoice data', async ({ page }) => {
  // Go to the purchase invoices page
  await page.goto('http://localhost:3000/invoices/purchase');

  // Click the New Invoice button to open the modal
  await page.click('#new-invoice-btn');

  // Wait for the modal to be visible
  await expect(page.locator('#invoice-modal')).toBeVisible();

  // Generate a unique invoice number
  const invoiceNumber = `INV-TEST-${Date.now()}`;

  // Fill out the form
  await page.fill('#invoice-number-modal', invoiceNumber);
  await page.fill('#invoice-date', '2025-05-01');
  await page.fill('#invoice-description', 'Test invoice from Playwright');
  await page.fill('#invoice-quantity', '2');
  await page.fill('#invoice-price', '625.25');
  await page.selectOption('#invoice-currency', 'EUR');
  await page.fill('#invoice-vat', '20');
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
  // This might need to be adjusted based on your actual table structure
  const invoiceCell = page.locator(`#invoices-table tbody tr td:has-text("${invoiceNumber}")`);
  await expect(invoiceCell).toBeVisible();

  // Check if the calculated values are correct
  // The subtotal should be 2 * 625.25 = 1250.50
  // The VAT amount should be 1250.50 * 0.2 = 250.10
  // The total amount should be 1250.50 + 250.10 = 1500.60

  // We can't directly check the values in the table since they might be formatted differently
  // But we can check that the row exists and contains the expected data
  const row = page.locator('#invoices-table tbody tr').first();
  await expect(row).toBeVisible();

  // Check that the amount is displayed correctly
  // This assumes the amount is in the 5th column (index 4)
  const amountCell = row.locator('td').nth(4);

  // The amount might be formatted as currency, so we check that it contains the expected value
  // rather than checking for an exact match
  const amountText = await amountCell.textContent();

  // Check that the amount contains the expected value (allowing for currency formatting)
  // This is a simplified check - you might need to adjust it based on your actual formatting
  expect(amountText).toContain('1500.60');
});
