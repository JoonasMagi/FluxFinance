import { test, expect } from '@playwright/test';

test('capture page structure', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // Take a screenshot to see what's on the page
  await page.screenshot({ path: 'homepage.png' });
  
  // Log the page title
  console.log('Page title:', await page.title());
  
  // Log all visible elements to understand the structure
  const elements = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*'))
      .filter(el => el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE')
      .map(el => ({
        tag: el.tagName,
        id: el.id,
        classes: Array.from(el.classList),
        text: el.innerText.substring(0, 50)
      }));
  });
  console.log('Page elements:', JSON.stringify(elements, null, 2));
});
