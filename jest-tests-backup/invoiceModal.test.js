/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { getByText, getByLabelText, fireEvent } from '@testing-library/dom';
import { jest } from '@jest/globals';

describe('Invoice Modal', () => {
  beforeEach(() => {
    // Set up a mock purchase invoices page with the modal
    document.body.innerHTML = `
      <div class="container">
        <h1>Purchase Invoices</h1>
        <div class="header-actions">
          <button class="btn-primary" id="new-invoice-btn">New Invoice</button>
        </div>

        <!-- Modal (initially hidden) -->
        <div id="invoice-modal" class="modal" style="display: none;">
          <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Add New Invoice</h2>
            <form id="invoice-modal-form">
              <div class="form-group">
                <label for="invoice-number">Invoice Number</label>
                <input type="text" id="invoice-number" name="invoiceNumber" required>
              </div>
              <div class="form-group">
                <label for="invoice-date">Date</label>
                <input type="date" id="invoice-date" name="date" required>
              </div>
              <div class="form-group">
                <label for="invoice-description">Description</label>
                <textarea id="invoice-description" name="description" rows="4" required></textarea>
              </div>
              <div class="form-group">
                <label for="invoice-quantity">Quantity</label>
                <input type="number" id="invoice-quantity" name="quantity" min="1" step="1" required>
              </div>
              <div class="form-group">
                <label for="invoice-price">Price</label>
                <input type="number" id="invoice-price" name="price" min="0" step="0.01" required>
              </div>
              <div class="form-group">
                <label for="invoice-currency">Currency</label>
                <select id="invoice-currency" name="currency" required>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div class="form-group">
                <label for="invoice-vat">VAT Percentage</label>
                <input type="number" id="invoice-vat" name="vatPercentage" min="0" max="100" step="0.1" required>
              </div>
              <div class="form-group">
                <label for="invoice-payment-method">Payment Method</label>
                <select id="invoice-payment-method" name="paymentMethod" required>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button type="submit" class="btn-primary">Save</button>
              <button type="button" class="btn-secondary" id="cancel-btn">Cancel</button>
            </form>
          </div>
        </div>
      </div>
    `;

    // Mock fetch API
    global.fetch = jest.fn();
  });

  it('should have a modal element in the DOM', () => {
    const modal = document.getElementById('invoice-modal');
    expect(modal).toBeInTheDocument();
    expect(modal.classList.contains('modal')).toBe(true);
  });

  it('should initially hide the modal', () => {
    const modal = document.getElementById('invoice-modal');
    expect(modal.style.display).toBe('none');
  });

  it('should have an invoice number field in the modal form', () => {
    const invoiceNumberInput = getByLabelText(document.body, /invoice number/i);
    expect(invoiceNumberInput).toBeInTheDocument();
    expect(invoiceNumberInput.tagName).toBe('INPUT');
    expect(invoiceNumberInput.type).toBe('text');
    expect(invoiceNumberInput.required).toBe(true);
  });

  it('should have a date field in the modal form', () => {
    const dateInput = getByLabelText(document.body, /date/i);
    expect(dateInput).toBeInTheDocument();
    expect(dateInput.tagName).toBe('INPUT');
    expect(dateInput.type).toBe('date');
    expect(dateInput.required).toBe(true);
  });

  it('should have a description field in the modal form', () => {
    const descriptionInput = getByLabelText(document.body, /description/i);
    expect(descriptionInput).toBeInTheDocument();
    expect(descriptionInput.tagName).toBe('TEXTAREA');
    expect(descriptionInput.required).toBe(true);
  });

  it('should have a quantity field in the modal form', () => {
    const quantityInput = getByLabelText(document.body, /quantity/i);
    expect(quantityInput).toBeInTheDocument();
    expect(quantityInput.tagName).toBe('INPUT');
    expect(quantityInput.type).toBe('number');
    expect(quantityInput.min).toBe('1');
    expect(quantityInput.step).toBe('1');
    expect(quantityInput.required).toBe(true);
  });

  it('should have a price field in the modal form', () => {
    const priceInput = getByLabelText(document.body, /price/i);
    expect(priceInput).toBeInTheDocument();
    expect(priceInput.tagName).toBe('INPUT');
    expect(priceInput.type).toBe('number');
    expect(priceInput.min).toBe('0');
    expect(priceInput.step).toBe('0.01');
    expect(priceInput.required).toBe(true);
  });

  it('should have a currency field in the modal form', () => {
    const currencySelect = getByLabelText(document.body, /currency/i);
    expect(currencySelect).toBeInTheDocument();
    expect(currencySelect.tagName).toBe('SELECT');
    expect(currencySelect.required).toBe(true);

    // Check options
    const options = currencySelect.querySelectorAll('option');
    expect(options.length).toBe(3);
    expect(options[0].value).toBe('EUR');
    expect(options[1].value).toBe('USD');
    expect(options[2].value).toBe('GBP');
  });

  it('should have a VAT percentage field in the modal form', () => {
    const vatInput = getByLabelText(document.body, /vat percentage/i);
    expect(vatInput).toBeInTheDocument();
    expect(vatInput.tagName).toBe('INPUT');
    expect(vatInput.type).toBe('number');
    expect(vatInput.min).toBe('0');
    expect(vatInput.max).toBe('100');
    expect(vatInput.step).toBe('0.1');
    expect(vatInput.required).toBe(true);
  });

  it('should have a payment method field in the modal form', () => {
    const paymentMethodSelect = getByLabelText(document.body, /payment method/i);
    expect(paymentMethodSelect).toBeInTheDocument();
    expect(paymentMethodSelect.tagName).toBe('SELECT');
    expect(paymentMethodSelect.required).toBe(true);

    // Check options
    const options = paymentMethodSelect.querySelectorAll('option');
    expect(options.length).toBe(4);
    expect(options[0].value).toBe('bank_transfer');
    expect(options[1].value).toBe('credit_card');
    expect(options[2].value).toBe('cash');
    expect(options[3].value).toBe('other');
  });

  it('should have save and cancel buttons', () => {
    const form = document.getElementById('invoice-modal-form');
    const saveButton = getByText(form, /save/i);
    const cancelButton = getByText(form, /cancel/i);

    expect(saveButton).toBeInTheDocument();
    expect(saveButton.type).toBe('submit');
    expect(saveButton.classList.contains('btn-primary')).toBe(true);

    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton.type).toBe('button');
    expect(cancelButton.classList.contains('btn-secondary')).toBe(true);
  });
});
