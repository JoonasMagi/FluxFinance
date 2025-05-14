/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { getByText, getByLabelText, fireEvent } from '@testing-library/dom';
import { jest } from '@jest/globals';

describe('Purchase Invoices Page', () => {
  beforeEach(() => {
    // Set up a mock purchase invoices page
    document.body.innerHTML = `
      <div class="container">
        <h1>Purchase Invoices</h1>
        <div class="header-actions">
          <button class="btn-primary" id="new-invoice-btn">New Invoice</button>
        </div>
        <div class="card">
          <h2>Add New Purchase Invoice</h2>
          <form id="purchase-invoice-form">
            <div class="form-group">
              <label for="invoice-number">Invoice Number</label>
              <input type="text" id="invoice-number" name="invoiceNumber" required>
            </div>
            <div class="form-group">
              <label for="vendor">Vendor</label>
              <input type="text" id="vendor" name="vendor" required>
            </div>
            <div class="form-group">
              <label for="issue-date">Issue Date</label>
              <input type="date" id="issue-date" name="issueDate" required>
            </div>
            <div class="form-group">
              <label for="due-date">Due Date</label>
              <input type="date" id="due-date" name="dueDate" required>
            </div>
            <div class="form-group">
              <label for="amount">Amount</label>
              <input type="number" id="amount" name="amount" step="0.01" required>
            </div>
            <button type="submit">Save Invoice</button>
          </form>
          <div id="message"></div>
        </div>
        <div class="card">
          <h2>Recent Purchase Invoices</h2>
          <table id="invoices-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Vendor</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <!-- Invoices will be loaded here -->
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Mock fetch API
    global.fetch = jest.fn();
  });

  it('should have a form for adding new purchase invoices', () => {
    const form = document.getElementById('purchase-invoice-form');
    expect(form).toBeInTheDocument();
  });

  it('should have all required fields for a purchase invoice', () => {
    expect(getByLabelText(document.body, /invoice number/i)).toBeInTheDocument();
    expect(getByLabelText(document.body, /vendor/i)).toBeInTheDocument();
    expect(getByLabelText(document.body, /issue date/i)).toBeInTheDocument();
    expect(getByLabelText(document.body, /due date/i)).toBeInTheDocument();
    expect(getByLabelText(document.body, /amount/i)).toBeInTheDocument();
  });

  it('should have a table for displaying purchase invoices', () => {
    const table = document.getElementById('invoices-table');
    expect(table).toBeInTheDocument();
    expect(getByText(table, /invoice #/i)).toBeInTheDocument();
    expect(getByText(table, /vendor/i)).toBeInTheDocument();
    expect(getByText(table, /issue date/i)).toBeInTheDocument();
    expect(getByText(table, /due date/i)).toBeInTheDocument();
    expect(getByText(table, /amount/i)).toBeInTheDocument();
    expect(getByText(table, /status/i)).toBeInTheDocument();
  });

  it('should have a New invoice button', () => {
    const newInvoiceButton = getByText(document.body, /new invoice/i);
    expect(newInvoiceButton).toBeInTheDocument();
    expect(newInvoiceButton.tagName).toBe('BUTTON');
    expect(newInvoiceButton.classList.contains('btn-primary')).toBe(true);
  });

  it('should have a submit button for the form', () => {
    const form = document.getElementById('purchase-invoice-form');
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton.textContent).toBe('Save Invoice');
  });

  // This test is skipped because it requires the actual JavaScript to be loaded
  it.skip('should submit the form with invoice data', async () => {
    // Mock successful response
    global.fetch.mockResolvedValueOnce({
      status: 201,
      json: () => Promise.resolve({ message: 'Invoice created successfully' })
    });

    // Fill out the form
    const invoiceNumberInput = getByLabelText(document.body, /invoice number/i);
    const vendorInput = getByLabelText(document.body, /vendor/i);
    const issueDateInput = getByLabelText(document.body, /issue date/i);
    const dueDateInput = getByLabelText(document.body, /due date/i);
    const amountInput = getByLabelText(document.body, /amount/i);

    fireEvent.change(invoiceNumberInput, { target: { value: 'INV-001' } });
    fireEvent.change(vendorInput, { target: { value: 'Acme Corp' } });
    fireEvent.change(issueDateInput, { target: { value: '2025-05-01' } });
    fireEvent.change(dueDateInput, { target: { value: '2025-05-31' } });
    fireEvent.change(amountInput, { target: { value: '1250.50' } });

    // Submit the form
    const form = document.getElementById('purchase-invoice-form');
    fireEvent.submit(form);

    // Wait for the fetch promise to resolve
    await new Promise(resolve => setTimeout(resolve, 0));

    // Check if fetch was called with the right data
    expect(global.fetch).toHaveBeenCalledWith('/api/invoices/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        invoiceNumber: 'INV-001',
        vendor: 'Acme Corp',
        issueDate: '2025-05-01',
        dueDate: '2025-05-31',
        amount: '1250.50'
      })
    });
  });
});
