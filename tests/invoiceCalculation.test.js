/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/dom';
import { jest } from '@jest/globals';

describe('Invoice Calculation', () => {
  beforeEach(() => {
    // Set up a mock purchase invoices page with the modal
    document.body.innerHTML = `
      <div class="container">
        <h1>Purchase Invoices</h1>
        <div class="header-actions">
          <button class="btn-primary" id="new-invoice-btn">New Invoice</button>
        </div>
        
        <!-- Modal (initially hidden) -->
        <div id="invoice-modal" class="modal" style="display: block;">
          <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Add New Invoice</h2>
            <form id="invoice-modal-form">
              <div class="form-group">
                <label for="invoice-number-modal">Invoice Number</label>
                <input type="text" id="invoice-number-modal" name="invoiceNumber" value="INV-2023-0001" required>
              </div>
              <div class="form-group">
                <label for="invoice-date">Date</label>
                <input type="date" id="invoice-date" name="date" value="2023-05-15" required>
              </div>
              <div class="form-group">
                <label for="invoice-description">Description</label>
                <textarea id="invoice-description" name="description" rows="4" required>Test description</textarea>
              </div>
              <div class="form-group">
                <label for="invoice-quantity">Quantity</label>
                <input type="number" id="invoice-quantity" name="quantity" min="1" step="1" value="1" required>
              </div>
              <div class="form-group">
                <label for="invoice-price">Price</label>
                <input type="number" id="invoice-price" name="price" min="0" step="0.01" value="0" required>
              </div>
              <div class="form-group">
                <label for="invoice-currency">Currency</label>
                <select id="invoice-currency" name="currency" required>
                  <option value="EUR" selected>EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div class="form-group">
                <label for="invoice-vat">VAT Percentage</label>
                <input type="number" id="invoice-vat" name="vatPercentage" min="0" max="100" step="0.1" value="20" required>
              </div>
              <div class="form-group">
                <label for="invoice-payment-method">Payment Method</label>
                <select id="invoice-payment-method" name="paymentMethod" required>
                  <option value="bank_transfer" selected>Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label for="invoice-subtotal">Subtotal</label>
                <input type="text" id="invoice-subtotal" name="subtotal" readonly value="0.00">
              </div>
              <div class="form-group">
                <label for="invoice-vat-amount">VAT Amount</label>
                <input type="text" id="invoice-vat-amount" name="vatAmount" readonly value="0.00">
              </div>
              <div class="form-group">
                <label for="invoice-total">Total Amount</label>
                <input type="text" id="invoice-total" name="totalAmount" readonly value="0.00">
              </div>
              <button type="submit" class="btn-primary">Save</button>
              <button type="button" class="btn-secondary" id="cancel-btn">Cancel</button>
            </form>
          </div>
        </div>
      </div>
    `;
    
    // Add the calculation function
    window.calculateTotal = function() {
      const quantity = parseFloat(document.getElementById('invoice-quantity').value) || 0;
      const price = parseFloat(document.getElementById('invoice-price').value) || 0;
      const vatPercentage = parseFloat(document.getElementById('invoice-vat').value) || 0;
      
      const subtotal = quantity * price;
      const vatAmount = subtotal * (vatPercentage / 100);
      const totalAmount = subtotal + vatAmount;
      
      document.getElementById('invoice-subtotal').value = subtotal.toFixed(2);
      document.getElementById('invoice-vat-amount').value = vatAmount.toFixed(2);
      document.getElementById('invoice-total').value = totalAmount.toFixed(2);
    };
    
    // Add event listeners for the calculation
    const priceInput = document.getElementById('invoice-price');
    const quantityInput = document.getElementById('invoice-quantity');
    const vatInput = document.getElementById('invoice-vat');
    
    priceInput.addEventListener('input', window.calculateTotal);
    quantityInput.addEventListener('input', window.calculateTotal);
    vatInput.addEventListener('input', window.calculateTotal);
  });

  it('should have fields for subtotal, VAT amount, and total amount', () => {
    const subtotalField = document.getElementById('invoice-subtotal');
    const vatAmountField = document.getElementById('invoice-vat-amount');
    const totalField = document.getElementById('invoice-total');
    
    expect(subtotalField).toBeInTheDocument();
    expect(vatAmountField).toBeInTheDocument();
    expect(totalField).toBeInTheDocument();
    
    expect(subtotalField.readOnly).toBe(true);
    expect(vatAmountField.readOnly).toBe(true);
    expect(totalField.readOnly).toBe(true);
  });

  it('should calculate subtotal when price is entered', () => {
    const priceInput = document.getElementById('invoice-price');
    const subtotalField = document.getElementById('invoice-subtotal');
    
    // Initial value
    expect(subtotalField.value).toBe('0.00');
    
    // Change price to 100
    fireEvent.input(priceInput, { target: { value: '100' } });
    
    // Subtotal should be 100 (price * quantity = 100 * 1)
    expect(subtotalField.value).toBe('100.00');
  });

  it('should calculate VAT amount when price is entered', () => {
    const priceInput = document.getElementById('invoice-price');
    const vatAmountField = document.getElementById('invoice-vat-amount');
    
    // Initial value
    expect(vatAmountField.value).toBe('0.00');
    
    // Change price to 100
    fireEvent.input(priceInput, { target: { value: '100' } });
    
    // VAT amount should be 20 (subtotal * VAT% = 100 * 20%)
    expect(vatAmountField.value).toBe('20.00');
  });

  it('should calculate total amount when price is entered', () => {
    const priceInput = document.getElementById('invoice-price');
    const totalField = document.getElementById('invoice-total');
    
    // Initial value
    expect(totalField.value).toBe('0.00');
    
    // Change price to 100
    fireEvent.input(priceInput, { target: { value: '100' } });
    
    // Total should be 120 (subtotal + VAT amount = 100 + 20)
    expect(totalField.value).toBe('120.00');
  });

  it('should recalculate when quantity is changed', () => {
    const priceInput = document.getElementById('invoice-price');
    const quantityInput = document.getElementById('invoice-quantity');
    const subtotalField = document.getElementById('invoice-subtotal');
    const vatAmountField = document.getElementById('invoice-vat-amount');
    const totalField = document.getElementById('invoice-total');
    
    // Set price to 100
    fireEvent.input(priceInput, { target: { value: '100' } });
    
    // Change quantity to 2
    fireEvent.input(quantityInput, { target: { value: '2' } });
    
    // Subtotal should be 200 (price * quantity = 100 * 2)
    expect(subtotalField.value).toBe('200.00');
    
    // VAT amount should be 40 (subtotal * VAT% = 200 * 20%)
    expect(vatAmountField.value).toBe('40.00');
    
    // Total should be 240 (subtotal + VAT amount = 200 + 40)
    expect(totalField.value).toBe('240.00');
  });

  it('should recalculate when VAT percentage is changed', () => {
    const priceInput = document.getElementById('invoice-price');
    const vatInput = document.getElementById('invoice-vat');
    const vatAmountField = document.getElementById('invoice-vat-amount');
    const totalField = document.getElementById('invoice-total');
    
    // Set price to 100
    fireEvent.input(priceInput, { target: { value: '100' } });
    
    // Change VAT percentage to 10
    fireEvent.input(vatInput, { target: { value: '10' } });
    
    // VAT amount should be 10 (subtotal * VAT% = 100 * 10%)
    expect(vatAmountField.value).toBe('10.00');
    
    // Total should be 110 (subtotal + VAT amount = 100 + 10)
    expect(totalField.value).toBe('110.00');
  });
});
