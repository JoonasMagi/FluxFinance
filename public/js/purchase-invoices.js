document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('purchase-invoice-form');
  const formCard = document.getElementById('invoice-form-card');
  const messageDiv = document.getElementById('message');
  const newInvoiceBtn = document.getElementById('new-invoice-btn');

  // Modal elements
  const modal = document.getElementById('invoice-modal');
  const modalForm = document.getElementById('invoice-modal-form');
  const closeBtn = document.querySelector('.close');
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');

  // Calculation fields
  const priceInput = document.getElementById('invoice-price');
  const quantityInput = document.getElementById('invoice-quantity');
  const vatInput = document.getElementById('invoice-vat');
  const currencySelect = document.getElementById('invoice-currency');
  const subtotalField = document.getElementById('invoice-subtotal');
  const vatAmountField = document.getElementById('invoice-vat-amount');
  const totalField = document.getElementById('invoice-total');
  const subtotalCurrency = document.getElementById('subtotal-currency');
  const vatCurrency = document.getElementById('vat-currency');
  const totalCurrency = document.getElementById('total-currency');

  // Initially hide the form
  if (formCard) {
    formCard.style.display = 'none';
  }

  // New Invoice button click handler - now opens the modal
  if (newInvoiceBtn) {
    newInvoiceBtn.addEventListener('click', function() {
      if (modal) {
        modal.style.display = 'block';

        // Set default date to today
        const dateInput = document.getElementById('invoice-date');
        if (dateInput) {
          const today = new Date().toISOString().split('T')[0];
          dateInput.value = today;
        }

        // Generate a random invoice number
        const invoiceNumberInput = document.getElementById('invoice-number-modal');
        if (invoiceNumberInput) {
          const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          const year = new Date().getFullYear();
          invoiceNumberInput.value = `INV-${year}-${randomNum}`;
        }

        // Set default currency to EUR
        const currencySelect = document.getElementById('invoice-currency');
        if (currencySelect) {
          currencySelect.value = 'EUR';
        }

        // Set default payment method to bank transfer
        const paymentMethodSelect = document.getElementById('invoice-payment-method');
        if (paymentMethodSelect) {
          paymentMethodSelect.value = 'bank_transfer';
        }

        // Calculate initial totals
        calculateTotal();

        // Focus on the first input
        const firstInput = modalForm.querySelector('input');
        if (firstInput) {
          firstInput.focus();
        }
      }
    });
  }

  // Close modal when clicking the × button
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }

  // Close modal when clicking the Cancel button
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }

  // Close modal when clicking outside of it
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Function to calculate totals
  function calculateTotal() {
    const quantity = parseFloat(quantityInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const vatPercentage = parseFloat(vatInput.value) || 0;
    const currency = currencySelect.value;

    const subtotal = quantity * price;
    const vatAmount = subtotal * (vatPercentage / 100);
    const totalAmount = subtotal + vatAmount;

    subtotalField.value = subtotal.toFixed(2);
    vatAmountField.value = vatAmount.toFixed(2);
    totalField.value = totalAmount.toFixed(2);

    // Update currency symbols
    subtotalCurrency.textContent = currency;
    vatCurrency.textContent = currency;
    totalCurrency.textContent = currency;
  }

  // Add event listeners for automatic calculation
  if (priceInput) {
    priceInput.addEventListener('input', calculateTotal);
  }

  if (quantityInput) {
    quantityInput.addEventListener('input', calculateTotal);
  }

  if (vatInput) {
    vatInput.addEventListener('input', calculateTotal);
  }

  if (currencySelect) {
    currencySelect.addEventListener('change', calculateTotal);
  }

  // Handle modal form submission
  if (modalForm) {
    modalForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(modalForm);
      const modalData = {};

      for (const [key, value] of formData.entries()) {
        modalData[key] = value;
      }

      // Calculate total amount based on quantity, price, and VAT
      const quantity = parseFloat(modalData.quantity) || 0;
      const price = parseFloat(modalData.price) || 0;
      const vatPercentage = parseFloat(modalData.vatPercentage) || 0;

      const subtotal = quantity * price;
      const vatAmount = subtotal * (vatPercentage / 100);
      const totalAmount = subtotal + vatAmount;

      // Add calculated values to the data
      modalData.subtotal = subtotal.toFixed(2);
      modalData.vatAmount = vatAmount.toFixed(2);
      modalData.totalAmount = totalAmount.toFixed(2);

      console.log('Modal form data:', modalData);

      // Prepare data for the purchase invoice API
      const invoiceData = {
        invoiceNumber: modalData.invoiceNumber,
        vendor: 'Vendor from ' + modalData.description.substring(0, 20),
        issueDate: modalData.date,
        dueDate: modalData.date, // For simplicity, using the same date
        amount: totalAmount,
        status: 'Unpaid',
        notes: `Description: ${modalData.description}\nQuantity: ${modalData.quantity}\nPrice: ${modalData.price} ${modalData.currency}\nVAT: ${modalData.vatPercentage}%\nPayment Method: ${modalData.paymentMethod}`
      };

      // Send data to server
      fetch('/api/invoices/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          // Close the modal
          modal.style.display = 'none';

          // Clear the form
          modalForm.reset();

          // Show a success message
          messageDiv.textContent = data.message;
          messageDiv.className = 'message-success';

          if (data.invoice) {
            // If the server returned the new invoice, add it to the table immediately
            addInvoiceToTable(data.invoice);
          } else {
            // Otherwise, reload all invoices
            loadInvoices();
          }
        }
      })
      .catch(error => {
        console.error('Error:', error);

        // Show an error message
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.className = 'message-error';
      });
    });
  }

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const invoiceData = {};

      for (const [key, value] of formData.entries()) {
        invoiceData[key] = value;
      }

      // Send data to server
      fetch('/api/invoices/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          messageDiv.textContent = data.message;
          messageDiv.className = 'message-success';

          // Clear form
          form.reset();

          // Hide the form
          if (formCard) {
            formCard.style.display = 'none';
          }

          // Reload invoices
          loadInvoices();
        }
      })
      .catch(error => {
        console.error('Error:', error);
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.className = 'message-error';
      });
    });
  }

  // Function to add a single invoice to the table
  function addInvoiceToTable(invoice) {
    const tableBody = document.querySelector('#invoices-table tbody');

    if (!tableBody) return;

    // Check if there's a "No invoices found" message and remove it
    const noInvoicesRow = tableBody.querySelector('tr td[colspan="6"]');
    if (noInvoicesRow) {
      tableBody.innerHTML = '';
    }

    // Create a new row for the invoice
    const row = document.createElement('tr');
    row.setAttribute('data-id', invoice.id);

    // Add a highlight class to make it stand out
    row.classList.add('new-invoice-highlight');

    // Format dates
    const issueDate = new Date(invoice.issue_date).toLocaleDateString();
    const dueDate = new Date(invoice.due_date).toLocaleDateString();

    // Format amount
    const amount = parseFloat(invoice.amount).toFixed(2);

    row.innerHTML = `
      <td>${invoice.invoice_number}</td>
      <td>${invoice.vendor}</td>
      <td>${issueDate}</td>
      <td>${dueDate}</td>
      <td>$${amount}</td>
      <td>${invoice.status}</td>
    `;

    // Add the new row at the top of the table
    if (tableBody.firstChild) {
      tableBody.insertBefore(row, tableBody.firstChild);
    } else {
      tableBody.appendChild(row);
    }

    // Remove the highlight after a delay
    setTimeout(() => {
      row.classList.remove('new-invoice-highlight');
    }, 3000);
  }

  // Load invoices from server
  function loadInvoices() {
    const tableBody = document.querySelector('#invoices-table tbody');

    if (tableBody) {
      fetch('/api/invoices/api/purchase')
        .then(response => response.json())
        .then(invoices => {
          if (invoices.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No purchase invoices found</td></tr>';
            return;
          }

          tableBody.innerHTML = '';

          invoices.forEach(invoice => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', invoice.id);

            // Format dates
            const issueDate = new Date(invoice.issue_date).toLocaleDateString();
            const dueDate = new Date(invoice.due_date).toLocaleDateString();

            // Format amount
            const amount = parseFloat(invoice.amount).toFixed(2);

            row.innerHTML = `
              <td>${invoice.invoice_number}</td>
              <td>${invoice.vendor}</td>
              <td>${issueDate}</td>
              <td>${dueDate}</td>
              <td>$${amount}</td>
              <td>${invoice.status}</td>
            `;

            tableBody.appendChild(row);
          });
        })
        .catch(error => {
          console.error('Error loading invoices:', error);
          tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Error loading invoices</td></tr>';
        });
    }
  }

  // Initial load of invoices
  loadInvoices();
});
