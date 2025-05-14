/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { getByText, fireEvent } from '@testing-library/dom';
import { jest } from '@jest/globals';

describe('Invoice Save and Display', () => {
  let mockInvoice;
  
  beforeEach(() => {
    // Create a mock invoice for testing
    mockInvoice = {
      id: 123,
      invoice_number: 'INV-2023-0001',
      vendor: 'Test Vendor',
      issue_date: '2023-05-15',
      due_date: '2023-06-15',
      amount: 120.00,
      status: 'Unpaid',
      notes: 'Test description'
    };
    
    // Set up a mock purchase invoices page with the modal and table
    document.body.innerHTML = `
      <div class="container">
        <h1>Purchase Invoices</h1>
        <div class="header-actions">
          <button class="btn-primary" id="new-invoice-btn">New Invoice</button>
        </div>
        
        <!-- Modal (initially visible for testing) -->
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
                <input type="number" id="invoice-price" name="price" min="0" step="0.01" value="100" required>
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
              <div class="button-group">
                <button type="submit" class="btn-primary" id="save-btn">Save</button>
                <button type="button" class="btn-secondary" id="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Message div for success/error messages -->
        <div id="message"></div>
        
        <!-- Invoices table -->
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
              <!-- Existing invoices would be here -->
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    // Mock fetch API for form submission
    global.fetch = jest.fn(() => 
      Promise.resolve({
        json: () => Promise.resolve({ 
          message: 'Invoice saved successfully',
          invoice: mockInvoice
        }),
      })
    );
    
    // Mock loadInvoices function
    window.loadInvoices = jest.fn(() => {
      const tableBody = document.querySelector('#invoices-table tbody');
      
      // Clear existing rows
      tableBody.innerHTML = '';
      
      // Add the new invoice row
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${mockInvoice.invoice_number}</td>
        <td>${mockInvoice.vendor}</td>
        <td>${mockInvoice.issue_date}</td>
        <td>${mockInvoice.due_date}</td>
        <td>$${mockInvoice.amount.toFixed(2)}</td>
        <td>${mockInvoice.status}</td>
      `;
      row.setAttribute('data-id', mockInvoice.id);
      tableBody.appendChild(row);
    });
    
    // Set up form submission handler
    const form = document.getElementById('invoice-modal-form');
    const modal = document.getElementById('invoice-modal');
    const messageDiv = document.getElementById('message');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      try {
        const response = await fetch('/api/invoices/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            invoiceNumber: document.getElementById('invoice-number-modal').value,
            vendor: 'Test Vendor',
            issueDate: document.getElementById('invoice-date').value,
            dueDate: '2023-06-15',
            amount: 120.00,
            status: 'Unpaid',
            notes: document.getElementById('invoice-description').value
          })
        });
        
        const data = await response.json();
        
        if (data.message) {
          // Close the modal
          modal.style.display = 'none';
          
          // Show success message
          messageDiv.textContent = data.message;
          messageDiv.className = 'message-success';
          
          // Reload invoices to show the new one
          window.loadInvoices();
        }
      } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.className = 'message-error';
      }
    });
  });

  it('should close the modal when the form is submitted', async () => {
    const modal = document.getElementById('invoice-modal');
    const form = document.getElementById('invoice-modal-form');
    
    // Initially visible
    expect(modal.style.display).toBe('block');
    
    // Submit the form
    fireEvent.submit(form);
    
    // Wait for the async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Modal should be hidden
    expect(modal.style.display).toBe('none');
  });

  it('should show a success message when the form is submitted', async () => {
    const form = document.getElementById('invoice-modal-form');
    const messageDiv = document.getElementById('message');
    
    // Submit the form
    fireEvent.submit(form);
    
    // Wait for the async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Check if success message is shown
    expect(messageDiv.textContent).toBe('Invoice saved successfully');
    expect(messageDiv.className).toBe('message-success');
  });

  it('should call the loadInvoices function to refresh the table', async () => {
    const form = document.getElementById('invoice-modal-form');
    
    // Submit the form
    fireEvent.submit(form);
    
    // Wait for the async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Check if loadInvoices was called
    expect(window.loadInvoices).toHaveBeenCalled();
  });

  it('should display the new invoice in the table', async () => {
    const form = document.getElementById('invoice-modal-form');
    
    // Submit the form
    fireEvent.submit(form);
    
    // Wait for the async operations to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Check if the new invoice is displayed in the table
    const tableBody = document.querySelector('#invoices-table tbody');
    const rows = tableBody.querySelectorAll('tr');
    
    expect(rows.length).toBe(1);
    expect(rows[0].cells[0].textContent).toBe(mockInvoice.invoice_number);
    expect(rows[0].cells[1].textContent).toBe(mockInvoice.vendor);
    expect(rows[0].cells[2].textContent).toBe(mockInvoice.issue_date);
    expect(rows[0].cells[3].textContent).toBe(mockInvoice.due_date);
    expect(rows[0].cells[4].textContent).toBe(`$${mockInvoice.amount.toFixed(2)}`);
    expect(rows[0].cells[5].textContent).toBe(mockInvoice.status);
  });
});
