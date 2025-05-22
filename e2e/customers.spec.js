import { test, expect } from '@playwright/test';
import { login } from '../tests/utils/auth.js';

// Use the authenticated state for all tests in this file
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Customers Management', () => {
  test.beforeEach(async ({ page }) => {
    // Use the authenticated state
    await page.goto('/customers');
  });

  test('should display customers page with title and add button', async ({ page }) => {
    // Check if the page title is correct
    await expect(page).toHaveTitle('Customers - FluxFinance');
    
    // Check if the main heading is visible
    await expect(page.getByRole('heading', { name: 'Customers' })).toBeVisible();
    
    // Check if the add customer button is visible
    await expect(page.getByRole('button', { name: 'Add Customer' })).toBeVisible();
  });

  test('should show add customer form when add button is clicked', async ({ page }) => {
    // Click the add customer button
    await page.getByRole('button', { name: 'Add Customer' }).click();
    
    // Check if the form is visible
    await expect(page.getByRole('heading', { name: 'Add New Customer' })).toBeVisible();
    
    // Check if form fields are present
    await expect(page.getByLabel('Name *')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Phone')).toBeVisible();
    await expect(page.getByLabel('Address')).toBeVisible();
    
    // Check if form buttons are present
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save Customer' })).toBeVisible();
  });

  test('should be able to add a new customer', async ({ page }) => {
    // Generate unique customer data
    const customerName = `Test Customer ${Date.now()}`;
    const customerEmail = `test${Date.now()}@example.com`;
    const customerPhone = '12345678';
    const customerAddress = 'Test Address 123';
    
    // Open the add customer form
    await page.getByRole('button', { name: 'Add Customer' }).click();
    
    // Fill in the form
    await page.getByLabel('Name *').fill(customerName);
    await page.getByLabel('Email').fill(customerEmail);
    await page.getByLabel('Phone').fill(customerPhone);
    await page.getByLabel('Address').fill(customerAddress);
    
    // Submit the form
    await page.getByRole('button', { name: 'Save Customer' }).click();
    
    // Wait for the form to be hidden and the customer to be added to the table
    await expect(page.getByRole('heading', { name: 'Add New Customer' })).toBeHidden();
    
    // Check if the new customer appears in the table
    const customerRow = page.locator('tr', { hasText: customerName });
    await expect(customerRow).toBeVisible();
    await expect(customerRow).toContainText(customerEmail);
    await expect(customerRow).toContainText(customerPhone);
    await expect(customerRow).toContainText(customerAddress);
  });

  test('should show error when required fields are missing', async ({ page }) => {
    // Open the add customer form
    await page.getByRole('button', { name: 'Add Customer' }).click();
    
    // Try to submit the form without filling required fields
    await page.getByRole('button', { name: 'Save Customer' }).click();
    
    // Check that the form is still visible
    await expect(page.getByRole('heading', { name: 'Add New Customer' })).toBeVisible();
    
    // Check that the name field shows validation error
    const nameInput = page.getByLabel('Name *');
    await expect(nameInput).toHaveAttribute('required', '');
    await expect(nameInput).toHaveJSProperty('validity.valid', false);
  });

  test('should be able to cancel adding a new customer', async ({ page }) => {
    // Open the add customer form
    await page.getByRole('button', { name: 'Add Customer' }).click();
    
    // Fill in some data
    await page.getByLabel('Name *').fill('Test Cancel');
    
    // Click cancel
    await page.getByRole('button', { name: 'Cancel' }).click();
    
    // Check that the form is hidden
    await expect(page.getByRole('heading', { name: 'Add New Customer' })).toBeHidden();
    
    // Check that the add button is visible again
    await expect(page.getByRole('button', { name: 'Add Customer' })).toBeVisible();
    
    // Check that the form data was cleared
    await page.getByRole('button', { name: 'Add Customer' }).click();
    await expect(page.getByLabel('Name *')).toHaveValue('');
  });
});
