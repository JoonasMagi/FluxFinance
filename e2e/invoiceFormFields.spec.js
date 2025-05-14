import { test, expect } from '@playwright/test';

test('modal form has all required fields', async ({ page }) => {
  // Go to the purchase invoices page
  await page.goto('http://localhost:3000/invoices/purchase');
  
  // Open the modal
  const newInvoiceBtn = page.locator('#new-invoice-btn');
  await expect(newInvoiceBtn).toBeVisible();
  await newInvoiceBtn.click();
  
  // Check that the modal is visible
  const modal = page.locator('#invoice-modal');
  await expect(modal).toBeVisible();
  
  // Check that the form exists
  const form = modal.locator('form#invoice-modal-form');
  await expect(form).toBeVisible();
  
  // Check for invoice number field
  const invoiceNumber = form.locator('#invoice-number-modal');
  await expect(invoiceNumber).toBeVisible();
  
  // Check for date field
  const date = form.locator('#invoice-date');
  await expect(date).toBeVisible();
  
  // Check for description field
  const description = form.locator('#invoice-description');
  await expect(description).toBeVisible();
  
  // Check for quantity field
  const quantity = form.locator('#invoice-quantity');
  await expect(quantity).toBeVisible();
  
  // Check for price field
  const price = form.locator('#invoice-price');
  await expect(price).toBeVisible();
  
  // Check for currency field
  const currency = form.locator('#invoice-currency');
  await expect(currency).toBeVisible();
  
  // Check for VAT percentage field
  const vat = form.locator('#invoice-vat');
  await expect(vat).toBeVisible();
  
  // Check for save and cancel buttons
  const saveBtn = form.locator('#save-btn');
  const cancelBtn = form.locator('#cancel-btn');
  await expect(saveBtn).toBeVisible();
  await expect(cancelBtn).toBeVisible();
});
