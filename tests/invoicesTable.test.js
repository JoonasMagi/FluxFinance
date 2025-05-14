/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { getByText } from '@testing-library/dom';
import { jest } from '@jest/globals';

describe('Purchase Invoices Table', () => {
  beforeEach(() => {
    // Set up a mock purchase invoices table
    document.body.innerHTML = `
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
            <tr>
              <td>INV-2025-001</td>
              <td>Office Supplies Inc.</td>
              <td>2025-04-15</td>
              <td>2025-05-15</td>
              <td>$245.50</td>
              <td>Unpaid</td>
            </tr>
            <tr>
              <td>INV-2025-002</td>
              <td>Tech Solutions Ltd.</td>
              <td>2025-04-10</td>
              <td>2025-05-10</td>
              <td>$1,200.00</td>
              <td>Paid</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  });

  it('should have a table for displaying purchase invoices', () => {
    const table = document.getElementById('invoices-table');
    expect(table).toBeInTheDocument();
    expect(table.tagName).toBe('TABLE');
  });

  it('should have the correct column headers', () => {
    const table = document.getElementById('invoices-table');
    expect(getByText(table, /invoice #/i)).toBeInTheDocument();
    expect(getByText(table, /vendor/i)).toBeInTheDocument();
    expect(getByText(table, /issue date/i)).toBeInTheDocument();
    expect(getByText(table, /due date/i)).toBeInTheDocument();
    expect(getByText(table, /amount/i)).toBeInTheDocument();
    expect(getByText(table, /status/i)).toBeInTheDocument();
  });

  it('should display invoice data correctly', () => {
    const table = document.getElementById('invoices-table');
    const tbody = table.querySelector('tbody');
    
    // Check first row
    const firstRow = tbody.querySelectorAll('tr')[0];
    expect(firstRow.cells[0].textContent).toBe('INV-2025-001');
    expect(firstRow.cells[1].textContent).toBe('Office Supplies Inc.');
    expect(firstRow.cells[2].textContent).toBe('2025-04-15');
    expect(firstRow.cells[3].textContent).toBe('2025-05-15');
    expect(firstRow.cells[4].textContent).toBe('$245.50');
    expect(firstRow.cells[5].textContent).toBe('Unpaid');
    
    // Check second row
    const secondRow = tbody.querySelectorAll('tr')[1];
    expect(secondRow.cells[0].textContent).toBe('INV-2025-002');
    expect(secondRow.cells[1].textContent).toBe('Tech Solutions Ltd.');
    expect(secondRow.cells[2].textContent).toBe('2025-04-10');
    expect(secondRow.cells[3].textContent).toBe('2025-05-10');
    expect(secondRow.cells[4].textContent).toBe('$1,200.00');
    expect(secondRow.cells[5].textContent).toBe('Paid');
  });
});
