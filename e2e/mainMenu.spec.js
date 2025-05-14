import { test, expect } from '@playwright/test';

test('main menu contains a Purchase invoices tab', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const menu = await page.locator('nav#main-menu');
  await expect(menu).toBeVisible();
  const tab = menu.locator('text=Purchase invoices');
  await expect(tab).toBeVisible();
  const tagName = await tab.evaluate(node => node.tagName);
  expect(['A', 'BUTTON']).toContain(tagName);
});
