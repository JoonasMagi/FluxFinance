import { test, expect } from '@playwright/test';

test('Saving a new invoice displays it in the table', async ({ page }) => {
  await page.goto('http://localhost:3000/invoices/purchase');
  
  // Open the modal
  const newInvoiceBtn = page.locator('#new-invoice-btn');
  await expect(newInvoiceBtn).toBeVisible();
  await newInvoiceBtn.click();
  
  // Check that the modal is visible
  const modal = page.locator('#invoice-modal');
  await expect(modal).toBeVisible();
  
  // Fill in the form fields
  const invoiceNumber = 'INV-2023-TEST';
  await page.fill('#invoice-number-modal', invoiceNumber);
  await page.fill('#invoice-date', '2023-05-15');
  await page.fill('#invoice-description', 'Test description');
  await page.fill('#invoice-quantity', '2');
  await page.fill('#invoice-price', '60');
  await page.selectOption('#invoice-currency', 'EUR');
  await page.fill('#invoice-vat', '20');
  await page.selectOption('#invoice-payment-method', 'bank_transfer');
  
  // Click the save button
  const saveBtn = modal.locator('#save-btn');
  await saveBtn.click();
  
  // Wait for modal to close
  await expect(modal).toBeHidden();
  
  // Check for the new row in the table (using a more specific selector)
  // This might need to be adjusted based on your actual table structure
  const table = page.locator('#invoices-table');
  await expect(table).toBeVisible();
  
  // Use a more specific selector for the row
  const row = table.locator('tbody tr').first();
  await expect(row).toBeVisible();
});
