import { test, expect } from '@playwright/test';

test('Invoice modal has Save and Cancel buttons', async ({ page }) => {
  await page.goto('http://localhost:3000/invoices/purchase');
  // Open the modal
  const newInvoiceBtn = page.locator('#new-invoice-btn');
  await expect(newInvoiceBtn).toBeVisible();
  await newInvoiceBtn.click();
  
  // Wait for modal to be visible
  const modal = page.locator('#invoice-modal');
  await expect(modal).toBeVisible();

  // Check for Save and Cancel buttons
  const saveBtn = modal.locator('#save-btn');
  const cancelBtn = modal.locator('#cancel-btn');
  await expect(saveBtn).toBeVisible();
  await expect(cancelBtn).toBeVisible();
});
