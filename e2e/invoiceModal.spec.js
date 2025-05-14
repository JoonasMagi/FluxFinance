import { test, expect } from '@playwright/test';

test('Invoice modal can be opened and has all fields', async ({ page }) => {
  await page.goto('http://localhost:3000/invoices/purchase');
  
  // Click the New Invoice button to open the modal
  const newInvoiceBtn = page.locator('#new-invoice-btn');
  await expect(newInvoiceBtn).toBeVisible();
  await newInvoiceBtn.click();
  
  // Check that the modal is visible
  const modal = page.locator('#invoice-modal');
  await expect(modal).toBeVisible();
  
  // Check for all the required fields using the correct IDs
  await expect(modal.locator('input#invoice-number-modal')).toBeVisible();
  await expect(modal.locator('input#invoice-date')).toBeVisible();
  await expect(modal.locator('textarea#invoice-description')).toBeVisible();
  await expect(modal.locator('input#invoice-quantity')).toBeVisible();
  await expect(modal.locator('input#invoice-price')).toBeVisible();
  await expect(modal.locator('select#invoice-currency')).toBeVisible();
  await expect(modal.locator('input#invoice-vat')).toBeVisible();
});
