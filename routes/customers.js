import express from 'express';
import { db } from '../init-db.js';

const router = express.Router();

// Get all customers
router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/?next=/customers');
  }
  
  const sql = 'SELECT * FROM customers ORDER BY name';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching customers:', err);
      return res.status(500).send('Error fetching customers');
    }
    res.render('customers/list', {
      title: 'Customers - FluxFinance',
      customers: rows
    });
  });
});

// Add new customer
router.post('/', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const { name, email, phone, address } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }

  const sql = 'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)';
  db.run(sql, [name, email, phone, address], function(err) {
    if (err) {
      console.error('Error adding customer:', err);
      return res.status(500).json({ success: false, message: 'Error adding customer' });
    }
    
    res.status(201).json({
      success: true,
      customer: {
        id: this.lastID,
        name,
        email,
        phone,
        address
      }
    });
  });
});

export default router;
