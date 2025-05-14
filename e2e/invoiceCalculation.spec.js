import { test, expect } from '@playwright/test';

test('calculates invoice total correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/invoices/purchase');
  
  // Open the modal first
  const newInvoiceBtn = page.locator('#new-invoice-btn');
  await newInvoiceBtn.click();
  
  // Fill in form fields in the modal
  await page.fill('#invoice-quantity', '2');
  await page.fill('#invoice-price', '50');
  
  // Wait for calculation to update (your UI likely updates dynamically)
  await page.waitForTimeout(500);
  
  // Check the subtotal (2 * 50 = 100)
  const subtotal = page.locator('#invoice-subtotal');
  await expect(subtotal).toHaveValue('100.00');
  
  // Check the VAT amount (100 * 0.2 = 20) with default 20% VAT
  const vatAmount = page.locator('#invoice-vat-amount');
  await expect(vatAmount).toHaveValue('20.00');
  
  // Check the total (100 + 20 = 120)
  const total = page.locator('#invoice-total');
  await expect(total).toHaveValue('120.00');
});
