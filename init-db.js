import sqlite3 from 'sqlite3';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = `${__dirname}/db/fluxfinance.db`;

// Create the database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Create tables
  createTables(db);
});

function createTables(db) {
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
      return;
    }
    console.log('Users table created or already exists.');

    // Create accounts table
    db.run(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        balance REAL DEFAULT 0,
        user_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating accounts table:', err.message);
        return;
      }
      console.log('Accounts table created or already exists.');

      // Create transactions table
      db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          description TEXT NOT NULL,
          amount REAL NOT NULL,
          date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          account_id INTEGER,
          category TEXT,
          FOREIGN KEY (account_id) REFERENCES accounts(id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating transactions table:', err.message);
          return;
        }
        console.log('Transactions table created or already exists.');

        // Create purchase invoices table
        db.run(`
          CREATE TABLE IF NOT EXISTS purchase_invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_number TEXT NOT NULL,
            vendor TEXT NOT NULL,
            issue_date DATE NOT NULL,
            due_date DATE NOT NULL,
            amount REAL NOT NULL,
            status TEXT NOT NULL,
            notes TEXT,
            user_id TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            console.error('Error creating purchase_invoices table:', err.message);
            return;
          }
          console.log('Purchase invoices table created or already exists.');

          // Insert demo data
          insertDemoData(db);
        });
      });
    });
  });
}

function insertDemoData(db) {
  // Check if demo user exists
  db.get('SELECT id FROM users WHERE email = ?', ['user@example.com'], (err, row) => {
    if (err) {
      console.error('Error checking for demo user:', err.message);
      return;
    }

    if (!row) {
      // Insert demo user
      db.run(
        'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
        ['user@example.com', 'password123', 'Demo User'],
        function(err) {
          if (err) {
            console.error('Error inserting demo user:', err.message);
            return;
          }

          const userId = this.lastID;
          console.log(`Demo user created with ID: ${userId}`);

          // Insert demo accounts
          const accounts = [
            { name: 'Checking Account', type: 'bank', balance: 2500.00, user_id: userId },
            { name: 'Savings Account', type: 'bank', balance: 10000.00, user_id: userId },
            { name: 'Credit Card', type: 'credit', balance: -450.75, user_id: userId }
          ];

          accounts.forEach(account => {
            db.run(
              'INSERT INTO accounts (name, type, balance, user_id) VALUES (?, ?, ?, ?)',
              [account.name, account.type, account.balance, account.user_id],
              function(err) {
                if (err) {
                  console.error('Error inserting demo account:', err.message);
                  return;
                }

                const accountId = this.lastID;
                console.log(`Demo account created with ID: ${accountId}`);

                // Insert demo transactions for this account
                if (account.name === 'Checking Account') {
                  const transactions = [
                    { description: 'Salary', amount: 3000.00, category: 'Income', days_ago: 15 },
                    { description: 'Grocery Shopping', amount: -125.30, category: 'Food', days_ago: 10 },
                    { description: 'Gas Station', amount: -45.00, category: 'Transportation', days_ago: 5 }
                  ];

                  transactions.forEach(tx => {
                    const date = new Date();
                    date.setDate(date.getDate() - tx.days_ago);

                    db.run(
                      'INSERT INTO transactions (description, amount, date, account_id, category) VALUES (?, ?, ?, ?, ?)',
                      [tx.description, tx.amount, date.toISOString(), accountId, tx.category],
                      function(err) {
                        if (err) {
                          console.error('Error inserting demo transaction:', err.message);
                        }
                      }
                    );
                  });
                }
              }
            );
          });

          // Insert demo purchase invoices
          const purchaseInvoices = [
            {
              invoice_number: 'INV-2025-001',
              vendor: 'Office Supplies Inc.',
              issue_date: '2025-04-15',
              due_date: '2025-05-15',
              amount: 245.50,
              status: 'Unpaid',
              notes: 'Monthly office supplies',
              user_id: userId
            },
            {
              invoice_number: 'INV-2025-002',
              vendor: 'Tech Solutions Ltd.',
              issue_date: '2025-04-10',
              due_date: '2025-05-10',
              amount: 1200.00,
              status: 'Paid',
              notes: 'Software subscription renewal',
              user_id: userId
            },
            {
              invoice_number: 'INV-2025-003',
              vendor: 'Marketing Experts Co.',
              issue_date: '2025-04-20',
              due_date: '2025-05-20',
              amount: 850.75,
              status: 'Unpaid',
              notes: 'Q2 marketing campaign',
              user_id: userId
            }
          ];

          purchaseInvoices.forEach(invoice => {
            db.run(
              `INSERT INTO purchase_invoices (
                invoice_number, vendor, issue_date, due_date,
                amount, status, notes, user_id
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                invoice.invoice_number,
                invoice.vendor,
                invoice.issue_date,
                invoice.due_date,
                invoice.amount,
                invoice.status,
                invoice.notes,
                invoice.user_id
              ],
              function(err) {
                if (err) {
                  console.error('Error inserting demo purchase invoice:', err.message);
                  return;
                }
                console.log(`Demo purchase invoice created with ID: ${this.lastID}`);
              }
            );
          });
        }
      );
    } else {
      console.log('Demo user already exists, skipping demo data insertion.');

      // Check if we have demo purchase invoices
      db.get('SELECT COUNT(*) as count FROM purchase_invoices', [], (err, row) => {
        if (err) {
          console.error('Error checking for demo purchase invoices:', err.message);
          return;
        }

        if (row.count === 0) {
          // Get the user ID
          db.get('SELECT id FROM users WHERE email = ?', ['user@example.com'], (err, userRow) => {
            if (err) {
              console.error('Error getting user ID:', err.message);
              return;
            }

            if (!userRow) {
              console.error('User not found');
              return;
            }

            // Insert demo purchase invoices for existing user
            const purchaseInvoices = [
              {
                invoice_number: 'INV-2025-001',
                vendor: 'Office Supplies Inc.',
                issue_date: '2025-04-15',
                due_date: '2025-05-15',
                amount: 245.50,
                status: 'Unpaid',
                notes: 'Monthly office supplies',
                user_id: userRow.id
              },
              {
                invoice_number: 'INV-2025-002',
                vendor: 'Tech Solutions Ltd.',
                issue_date: '2025-04-10',
                due_date: '2025-05-10',
                amount: 1200.00,
                status: 'Paid',
                notes: 'Software subscription renewal',
                user_id: userRow.id
              },
              {
                invoice_number: 'INV-2025-003',
                vendor: 'Marketing Experts Co.',
                issue_date: '2025-04-20',
                due_date: '2025-05-20',
                amount: 850.75,
                status: 'Unpaid',
                notes: 'Q2 marketing campaign',
                user_id: userRow.id
              }
            ];

            purchaseInvoices.forEach(invoice => {
              db.run(
              `INSERT INTO purchase_invoices (
                invoice_number, vendor, issue_date, due_date,
                amount, status, notes, user_id
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                invoice.invoice_number,
                invoice.vendor,
                invoice.issue_date,
                invoice.due_date,
                invoice.amount,
                invoice.status,
                invoice.notes,
                invoice.user_id
              ],
              function(err) {
                if (err) {
                  console.error('Error inserting demo purchase invoice:', err.message);
                  return;
                }
                console.log(`Demo purchase invoice created with ID: ${this.lastID}`);
              }
            );
          });
        });
        } else {
          console.log('Demo purchase invoices already exist, skipping insertion.');
        }
      });
    }
  });
}

// Close the database connection when done
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

console.log('Database initialization complete.');
