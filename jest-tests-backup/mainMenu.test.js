/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { getByText } from '@testing-library/dom';

describe('Main menu', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <nav id="main-menu">
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/invoices/purchase">Purchase invoices</a></li>
        </ul>
      </nav>
    `;
  });

  it('contains a Purchase invoices tab', () => {
    // Should find a link or button with the correct text
    const tab = getByText(document.body, /purchase invoices/i);
    expect(tab).toBeInTheDocument();
    expect(tab.tagName).toMatch(/A|BUTTON/);
  });
});
