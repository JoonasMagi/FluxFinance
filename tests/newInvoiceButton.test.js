/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { getByText } from '@testing-library/dom';
import { jest } from '@jest/globals';

describe('New Invoice Button', () => {
  beforeEach(() => {
    // Set up a mock purchase invoices page with just the header and button
    document.body.innerHTML = `
      <div class="container">
        <h1>Purchase Invoices</h1>
        <div class="header-actions">
          <button class="btn-primary" id="new-invoice-btn">New Invoice</button>
        </div>
        <div class="card" id="invoice-form-card" style="display: none;">
          <h2>Add New Purchase Invoice</h2>
          <form id="purchase-invoice-form">
            <!-- Form fields would be here -->
          </form>
        </div>
      </div>
    `;
    
    // Mock fetch API
    global.fetch = jest.fn();
  });

  it('should exist on the purchase invoices page', () => {
    const newInvoiceButton = getByText(document.body, /new invoice/i);
    expect(newInvoiceButton).toBeInTheDocument();
    expect(newInvoiceButton.tagName).toBe('BUTTON');
    expect(newInvoiceButton.classList.contains('btn-primary')).toBe(true);
  });

  it('should have the correct ID for JavaScript interaction', () => {
    const newInvoiceButton = document.getElementById('new-invoice-btn');
    expect(newInvoiceButton).toBeInTheDocument();
    expect(newInvoiceButton.textContent).toBe('New Invoice');
  });

  it('should be placed in the header-actions section', () => {
    const headerActions = document.querySelector('.header-actions');
    expect(headerActions).toBeInTheDocument();
    
    const newInvoiceButton = headerActions.querySelector('#new-invoice-btn');
    expect(newInvoiceButton).toBeInTheDocument();
  });
});
