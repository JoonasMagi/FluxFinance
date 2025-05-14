# FluxFinance

FluxFinance is a lightweight web-based accounting application built with Node.js, Express, SQLite, and Handlebars. It features a simple Vue-powered frontend (via CDN) and aims to provide efficient and fast financial management for small businesses.

## ✅ Features

- Lightweight accounting management
- Purchase invoice management with automatic calculations
- Handlebars templating for dynamic server-side views
- Vue-enhanced UI components using CDN
- Persistent data using SQLite
- Fast and modern backend powered by Node.js
- Comprehensive test suite with Jest

## 🛠 Tech Stack

- **Backend**: Node.js, Express, SQLite
- **Templating**: Handlebars
- **Frontend**: Vue.js (via CDN)
- **Testing**: Jest, Testing Library

## ⚙️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Create the Database Directory

Before initializing the database, create the `db` directory:

```bash
mkdir db
```

### 3. Initialize the Database

```bash
npm run init:db
```

This will create a new SQLite database with the required schema and populate it with demo data.

### 3. Run the Application

```bash
npm run start
```

Visit http://localhost:3000 in your browser.

### 4. Run Tests

```bash
npm test
```

## 📁 Project Structure

```
fluxfinance/
├── views/              # Handlebars templates
│   └── layouts/        # Layout templates
├── public/             # Static assets (CSS, JS, icons)
├── routes/             # Express route modules
├── tests/              # Test files
├── db/                 # SQLite DB and schema setup
├── app.js              # Main server entry point
├── init-db.js          # DB initialization script
├── jest.config.js      # Jest configuration
└── package.json        # Project dependencies
```

## 🔐 Authentication

For demo purposes, you can use the following credentials:
- **Email**: user@example.com
- **Password**: password123

## 📝 Purchase Invoices

The purchase invoice functionality allows accountants to:

- View a list of existing purchase invoices
- Add new purchase invoices with a user-friendly modal interface
- Track key invoice details:
  - Invoice number (auto-generated)
  - Date
  - Description
  - Quantity
  - Price
  - Currency (EUR, USD, GBP)
  - VAT percentage
  - Payment method
- Automatic calculation of:
  - Subtotal (price × quantity)
  - VAT amount (subtotal × VAT%)
  - Total amount (subtotal + VAT amount)
- User-friendly interface with:
  - Save button to submit the invoice and see it immediately in the table
  - Cancel button to discard changes and close the form
  - Visual feedback with a highlight effect for newly added invoices

To access this feature:
1. Sign in using the demo credentials
2. Navigate to "Purchase Invoices" in the main menu
3. Click the "New Invoice" button to create a new invoice
4. Fill in the required information
5. Click "Save" to submit or "Cancel" to discard

## 📃 License

MIT License © 2025 FluxFinance Team