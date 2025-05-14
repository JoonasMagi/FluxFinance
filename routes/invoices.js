import express from 'express';
import sqlite3 from 'sqlite3';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = `${__dirname}/../db/fluxfinance.db`;

const router = express.Router();

// GET /invoices/purchase - Render purchase invoices page
router.get('/purchase', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/?next=/invoices/purchase');
  }

  // Connect to the database
  const db = new sqlite3.Database(dbPath);

  // Get all purchase invoices for the current user
  db.all(
    `SELECT * FROM purchase_invoices ORDER BY due_date ASC`,
    (err, invoices) => {
      if (err) {
        console.error('Error fetching purchase invoices:', err.message);
        db.close();
        return res.status(500).render('error', {
          message: 'Failed to load purchase invoices',
          error: { status: 500, stack: err.stack }
        });
      }

      db.close();
      res.render('purchase-invoices', {
        title: 'Purchase Invoices - FluxFinance',
        user: req.session.user,
        invoices: invoices || []
      });
    }
  );
});

// POST /api/invoices/purchase - Create a new purchase invoice
router.post('/api/purchase', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { invoiceNumber, vendor, issueDate, dueDate, amount } = req.body;

  // Validate required fields
  if (!invoiceNumber || !vendor || !issueDate || !dueDate || !amount) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Connect to the database
  const db = new sqlite3.Database(dbPath);

  // Insert the new invoice
  db.run(
    `INSERT INTO purchase_invoices (
      invoice_number, vendor, issue_date, due_date, amount, status, notes, user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      invoiceNumber,
      vendor,
      issueDate,
      dueDate,
      amount,
      'Unpaid', // Default status
      req.body.notes || '', // Notes field
      1 // User ID hardcoded to 1 for demo purposes
    ],
    function(err) {
      if (err) {
        db.close();
        console.error('Error creating purchase invoice:', err.message);
        return res.status(500).json({ message: 'Failed to create invoice' });
      }

      const invoiceId = this.lastID;

      // Get the newly created invoice to return it
      db.get(
        `SELECT * FROM purchase_invoices WHERE id = ?`,
        [invoiceId],
        (err, invoice) => {
          db.close();

          if (err) {
            console.error('Error fetching new invoice:', err.message);
            return res.status(201).json({
              message: 'Invoice created successfully, but could not fetch details',
              invoiceId: invoiceId
            });
          }

          res.status(201).json({
            message: 'Invoice created successfully',
            invoice: invoice
          });
        }
      );
    }
  );
});

// GET /api/invoices/purchase - Get all purchase invoices
router.get('/api/purchase', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Connect to the database
  const db = new sqlite3.Database(dbPath);

  // Get all purchase invoices for the current user
  db.all(
    `SELECT * FROM purchase_invoices ORDER BY due_date ASC`,
    (err, invoices) => {
      db.close();

      if (err) {
        console.error('Error fetching purchase invoices:', err.message);
        return res.status(500).json({ message: 'Failed to fetch invoices' });
      }

      res.json(invoices || []);
    }
  );
});

export default router;
