const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();
const logger = require('../logger');
const authenticateToken = require('../middleware/authenticateToken');

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
    logger.error('Error during signup: ', err);
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
    // Check if the user exists
    logger.info(`Checking if user with email ${email} exists`);
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('User result:', result.rows);  // Debugging log for user query
    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison:', isMatch);  // Debugging log for password comparison
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    logger.info(`Creating JWT for user with ID: ${user.id}`);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    logger.error('Error during login:', err);
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
  
      // Fetch highest quiz score
      const quizResult = await pool.query('SELECT MAX(score) AS highest_score FROM quiz_scores WHERE user_id = $1', [userId]);
      res.json({ user, highestScore: quizResult.rows[0]?.highest_score || 0 });
    } catch (err) {
      console.error('Profile Fetch Error:', err);
      res.status(500).json({ error: 'Profile fetch failed' });
    }
});

  router.put('/profile', authenticateToken, async (req, res) => {
    const { name } = req.body;
    const userId = req.user.userId;
  
    try {
      const result = await pool.query(
        'UPDATE users SET name = $1 WHERE id = $2 RETURNING *',
        [name, userId]
      );
      const updatedUser = result.rows[0];
      res.json({ user: updatedUser });
    } catch (err) {
      console.error('Profile Update Error:', err);
      res.status(500).json({ error: 'Failed to update profile' });
    }
});
    

module.exports = router;
