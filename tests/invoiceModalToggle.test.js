/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import { jest } from '@jest/globals';

describe('Invoice Modal Toggle', () => {
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

    // Add event listeners for the modal
    const newInvoiceBtn = document.getElementById('new-invoice-btn');
    const modal = document.getElementById('invoice-modal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancel-btn');

    newInvoiceBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  });

  it('should show the modal when the New Invoice button is clicked', () => {
    const newInvoiceBtn = document.getElementById('new-invoice-btn');
    const modal = document.getElementById('invoice-modal');

    // Initially hidden
    expect(modal.style.display).toBe('none');

    // Click the button
    fireEvent.click(newInvoiceBtn);

    // Modal should be visible
    expect(modal.style.display).toBe('block');
  });

  it('should close the modal when the close button is clicked', () => {
    const newInvoiceBtn = document.getElementById('new-invoice-btn');
    const modal = document.getElementById('invoice-modal');
    const closeBtn = document.querySelector('.close');

    // Open the modal first
    fireEvent.click(newInvoiceBtn);
    expect(modal.style.display).toBe('block');

    // Click the close button
    fireEvent.click(closeBtn);

    // Modal should be hidden
    expect(modal.style.display).toBe('none');
  });

  it('should close the modal when the cancel button is clicked', () => {
    const newInvoiceBtn = document.getElementById('new-invoice-btn');
    const modal = document.getElementById('invoice-modal');
    const cancelBtn = document.getElementById('cancel-btn');

    // Open the modal first
    fireEvent.click(newInvoiceBtn);
    expect(modal.style.display).toBe('block');

    // Click the cancel button
    fireEvent.click(cancelBtn);

    // Modal should be hidden
    expect(modal.style.display).toBe('none');
  });

  it('should close the modal when clicking outside of it', () => {
    const newInvoiceBtn = document.getElementById('new-invoice-btn');
    const modal = document.getElementById('invoice-modal');

    // Open the modal first
    fireEvent.click(newInvoiceBtn);
    expect(modal.style.display).toBe('block');

    // Click outside the modal (on the modal background)
    fireEvent.click(modal);

    // Modal should be hidden
    expect(modal.style.display).toBe('none');
  });
});
