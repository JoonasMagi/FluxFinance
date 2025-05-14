import { test, expect } from '@playwright/test';

test('New Invoice button exists and is in header-actions', async ({ page }) => {
  await page.goto('http://localhost:3000/invoices/purchase');
  
  // Check that the button exists
  const newInvoiceButton = page.locator('#new-invoice-btn');
  await expect(newInvoiceButton).toBeVisible();
  
  // Check button text and class
  await expect(newInvoiceButton).toHaveText(/new invoice/i);
  await expect(newInvoiceButton).toHaveClass(/btn-primary/);

  // Verify it's inside the header-actions container
  const headerActions = page.locator('.header-actions');
  await expect(headerActions).toBeVisible();
  await expect(headerActions.locator('#new-invoice-btn')).toBeVisible();
  
  // Test button functionality - clicking should open the modal
  await newInvoiceButton.click();
  const modal = page.locator('#invoice-modal');
  await expect(modal).toBeVisible();
});
