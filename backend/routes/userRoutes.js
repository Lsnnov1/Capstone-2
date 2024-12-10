const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();
const logger = require('../logger')
const authenticateToken = require('../middleware/authenticateToken')


// User registration route
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    logger.error('Error: Email and password are required');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if user already exists
    logger.info(`Checking if user with email ${email} already exists`);
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      logger.error(`Error: User with email ${email} already exists`);
      return res.status(400).json({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertResult = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, name]
    );
    logger.info(`User created with email: ${email}`);
    res.status(201).json({ message: 'User registered successfully', user: insertResult.rows[0] });
  } catch (err) {
    logger.error('Error during signup: ', err);  // Log the error
    res.status(500).json({ error: 'Registration failed' });
  }
});


  
// User login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token with a secret key from env variables
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get Profile route (to fetch user profile details)
router.get('/profile', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      const user = result.rows[0];
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    } catch (err) {
      res.status(500).json({ error: 'Profile fetch failed' });
    }
  });
  

module.exports = router;
