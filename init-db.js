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
        
        // Insert demo data
        insertDemoData(db);
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
        }
      );
    } else {
      console.log('Demo user already exists, skipping demo data insertion.');
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
