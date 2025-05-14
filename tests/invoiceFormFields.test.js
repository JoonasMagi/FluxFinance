/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { getByLabelText } from '@testing-library/dom';
import { jest } from '@jest/globals';

describe('Purchase Invoice Form Fields', () => {
  beforeEach(() => {
    // Set up a mock purchase invoice form
    document.body.innerHTML = `
      <div class="card" id="invoice-form-card">
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
          <button type="submit" class="btn-primary">Save Invoice</button>
        </form>
        <div id="message"></div>
      </div>
    `;
  });

  it('should have a form for adding new purchase invoices', () => {
    const form = document.getElementById('purchase-invoice-form');
    expect(form).toBeInTheDocument();
    expect(form.tagName).toBe('FORM');
  });

  it('should have an invoice number field', () => {
    const invoiceNumberInput = getByLabelText(document.body, /invoice number/i);
    expect(invoiceNumberInput).toBeInTheDocument();
    expect(invoiceNumberInput.tagName).toBe('INPUT');
    expect(invoiceNumberInput.type).toBe('text');
    expect(invoiceNumberInput.required).toBe(true);
  });

  it('should have a vendor field', () => {
    const vendorInput = getByLabelText(document.body, /vendor/i);
    expect(vendorInput).toBeInTheDocument();
    expect(vendorInput.tagName).toBe('INPUT');
    expect(vendorInput.type).toBe('text');
    expect(vendorInput.required).toBe(true);
  });

  it('should have an issue date field', () => {
    const issueDateInput = getByLabelText(document.body, /issue date/i);
    expect(issueDateInput).toBeInTheDocument();
    expect(issueDateInput.tagName).toBe('INPUT');
    expect(issueDateInput.type).toBe('date');
    expect(issueDateInput.required).toBe(true);
  });

  it('should have a due date field', () => {
    const dueDateInput = getByLabelText(document.body, /due date/i);
    expect(dueDateInput).toBeInTheDocument();
    expect(dueDateInput.tagName).toBe('INPUT');
    expect(dueDateInput.type).toBe('date');
    expect(dueDateInput.required).toBe(true);
  });

  it('should have an amount field', () => {
    const amountInput = getByLabelText(document.body, /amount/i);
    expect(amountInput).toBeInTheDocument();
    expect(amountInput.tagName).toBe('INPUT');
    expect(amountInput.type).toBe('number');
    expect(amountInput.step).toBe('0.01');
    expect(amountInput.required).toBe(true);
  });

  it('should have a submit button', () => {
    const form = document.getElementById('purchase-invoice-form');
    const submitButton = form.querySelector('button[type="submit"]');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton.textContent).toBe('Save Invoice');
    expect(submitButton.classList.contains('btn-primary')).toBe(true);
  });
});
