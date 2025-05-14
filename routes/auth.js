import express from 'express';
const router = express.Router();

// Hardcoded sign-in logic for demo/testing
router.post('/signin', (req, res) => {
  console.log('Sign-in attempt:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  if (email === 'user@example.com' && password === 'password123') {
    console.log('Sign-in successful for:', email);
    req.session.user = email;
    return res.status(200).json({ message: 'Signed in successfully' });
  } else {
    console.log('Sign-in failed: incorrect credentials');
    return res.status(401).json({ message: 'Email or password is incorrect' });
  }
});

// Endpoint to check session authentication status
router.get('/status', (req, res) => {
  console.log('Auth status check, session user:', req.session.user);
  
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
});

export default router;
