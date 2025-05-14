import { test, expect } from '@playwright/test';

test('Invoice modal opens and closes with buttons', async ({ page }) => {
  await page.goto('http://localhost:3000/invoices/purchase');
  // First verify the modal is hidden
  const modal = page.locator('#invoice-modal');
  await expect(modal).toBeHidden();
  
  // Click the New Invoice button to open the modal
  const newInvoiceBtn = page.locator('#new-invoice-btn');
  await expect(newInvoiceBtn).toBeVisible();
  await newInvoiceBtn.click();
  
  // Verify modal is now visible
  await expect(modal).toBeVisible();
  
  // Click the close (×) button to close the modal
  const closeBtn = modal.locator('.close');
  await closeBtn.click();
  
  // Verify modal is hidden again
  await expect(modal).toBeHidden();
});
