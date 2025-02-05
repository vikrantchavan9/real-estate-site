const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const router = express.Router();
const passport = require('passport');

 // Register page
     router.get('/register', (req, res) => {
     res.render('register');
   });
   
   router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Check if the email already exists
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert new user
      await pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashedPassword]);
  
      console.log(`User Registered: Username=${name}, Email=${email}`);
  
      // Send JSON response to frontend
      return res.status(201).json({ message: 'User registered successfully' });
  
    } catch (err) {
      console.error('Error registering user:', err.message);
      return res.status(500).json({ error: 'Registration failed' });
    }
  });
  
   
   // Sign-in page
   router.get('/login', (req, res) => {
     res.render('login');
   });
   

  // Handle user login
  router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ user: req.user });  // Send user details back to frontend
  });
   
  router.get('/user', (req, res) => {
    // If the session does not contain a user, send an unauthorized response
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // If the session contains a user, send their details as a response
    return res.json({ user: req.session.user });
  });
  
   // Logout
   router.get('/logout', (req, res) => {
     req.session.destroy((err) => {
       if (err) return res.send('Error logging out');
       res.redirect('/');
     });
   });
   
   // Authentication middleware
 function isAuthenticated(req, res, next) {
     if (req.session.user) {
       next();
     } else {
       res.redirect('/login');
     }
   }


module.exports = router;