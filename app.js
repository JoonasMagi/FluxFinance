import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import { engine } from 'express-handlebars';
import authRouter from './routes/auth.js';
import invoicesRouter from './routes/invoices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Handlebars
app.engine('handlebars', engine({
  helpers: {
    formatDate: function(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString();
    },
    formatAmount: function(amount) {
      if (amount === undefined || amount === null) return '';
      return parseFloat(amount).toFixed(2);
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Session setup
app.use(session({
  secret: 'fluxfinance_demo_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Authentication routes
app.use('/auth', authRouter);

// Invoices routes
app.use('/invoices', invoicesRouter);
app.use('/api/invoices', invoicesRouter);

// Dashboard route (protected)
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/?next=/dashboard');
  }
  res.render('dashboard', {
    user: req.session.user,
    title: 'Dashboard - FluxFinance'
  });
});

// Home route - serve static index.html
// app.get('/', (req, res) => {
//   res.render('home', {
//     title: 'FluxFinance - Lightweight Accounting'
//   });
// });

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
