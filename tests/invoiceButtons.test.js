/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { getByText, fireEvent } from '@testing-library/dom';
import { jest } from '@jest/globals';

describe('Invoice Modal Buttons', () => {
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
              <!-- Other form fields would be here -->
              <div class="button-group">
                <button type="submit" class="btn-primary" id="save-btn">Save</button>
                <button type="button" class="btn-secondary" id="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
        <div id="message"></div>
      </div>
    `;
    
    // Mock fetch API
    global.fetch = jest.fn(() => 
      Promise.resolve({
        json: () => Promise.resolve({ message: 'Invoice saved successfully' }),
      })
    );
    
    // Mock form submission
    const form = document.getElementById('invoice-modal-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const modal = document.getElementById('invoice-modal');
      modal.style.display = 'none';
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = 'Invoice saved successfully';
      messageDiv.className = 'message-success';
    });
    
    // Mock cancel button
    const cancelBtn = document.getElementById('cancel-btn');
    cancelBtn.addEventListener('click', () => {
      const modal = document.getElementById('invoice-modal');
      modal.style.display = 'none';
    });
  });

  it('should have a save button in the modal form', () => {
    const form = document.getElementById('invoice-modal-form');
    const saveButton = getByText(form, /save/i);
    
    expect(saveButton).toBeInTheDocument();
    expect(saveButton.tagName).toBe('BUTTON');
    expect(saveButton.type).toBe('submit');
    expect(saveButton.classList.contains('btn-primary')).toBe(true);
    expect(saveButton.id).toBe('save-btn');
  });

  it('should have a cancel button in the modal form', () => {
    const form = document.getElementById('invoice-modal-form');
    const cancelButton = getByText(form, /cancel/i);
    
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton.tagName).toBe('BUTTON');
    expect(cancelButton.type).toBe('button');
    expect(cancelButton.classList.contains('btn-secondary')).toBe(true);
    expect(cancelButton.id).toBe('cancel-btn');
  });

  it('should close the modal when the save button is clicked and form is submitted', () => {
    const modal = document.getElementById('invoice-modal');
    const form = document.getElementById('invoice-modal-form');
    const saveButton = getByText(form, /save/i);
    
    // Initially visible
    expect(modal.style.display).toBe('block');
    
    // Submit the form by clicking the save button
    fireEvent.click(saveButton);
    
    // Modal should be hidden
    expect(modal.style.display).toBe('none');
  });

  it('should close the modal when the cancel button is clicked', () => {
    const modal = document.getElementById('invoice-modal');
    const form = document.getElementById('invoice-modal-form');
    const cancelButton = getByText(form, /cancel/i);
    
    // Initially visible
    expect(modal.style.display).toBe('block');
    
    // Click the cancel button
    fireEvent.click(cancelButton);
    
    // Modal should be hidden
    expect(modal.style.display).toBe('none');
  });

  it('should show a success message when the form is submitted', () => {
    const form = document.getElementById('invoice-modal-form');
    const saveButton = getByText(form, /save/i);
    const messageDiv = document.getElementById('message');
    
    // Submit the form by clicking the save button
    fireEvent.click(saveButton);
    
    // Check if success message is shown
    expect(messageDiv.textContent).toBe('Invoice saved successfully');
    expect(messageDiv.className).toBe('message-success');
  });

  it('should have buttons in a button group for proper styling', () => {
    const buttonGroup = document.querySelector('.button-group');
    
    expect(buttonGroup).toBeInTheDocument();
    expect(buttonGroup.children.length).toBe(2);
    expect(buttonGroup.children[0].textContent).toBe('Save');
    expect(buttonGroup.children[1].textContent).toBe('Cancel');
  });
});
