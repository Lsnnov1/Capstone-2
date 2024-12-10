const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // PostgreSQL connection

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, username } = req.body; // Use `username` instead of `name`

  if (!email || !password || !username) {
    console.log('Error: Email, password, or username missing');
    return res.status(400).json({ error: 'Email, password, and username are required' });
  }

  try {
    // Check if user already exists
    console.log(`Checking if user with email ${email} already exists`);
    const result = await pool.query('SELECT * FROM public.users WHERE email = $1', [email]);
    
    if (result.rows.length > 0) {
      console.log('Error: Email already in use');
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password
    console.log('Hashing the password');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    console.log('Inserting new user into the database');
    const insertResult = await pool.query(
      'INSERT INTO public.users (email, password, username) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, username]
    );

    console.log(`User created successfully with ID: ${insertResult.rows[0].id}`);
    res.status(201).json({ message: 'User registered successfully', user: insertResult.rows[0] });
  } catch (err) {
    console.error('Error occurred during registration:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});




// User Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get Profile route (to fetch user profile details)
router.get('/profile', async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch highest quiz score (assuming there's a quiz_scores table)
    const quizResult = await pool.query('SELECT MAX(score) AS highest_score FROM quiz_scores WHERE user_id = $1', [userId]);
    const highestScore = quizResult.rows[0].highest_score || 0;

    res.json({ user, highestScore });
  } catch (err) {
    res.status(500).json({ error: 'Profile fetch failed' });
  }
});

// Edit Profile route (update name)
router.put('/profile', async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query('UPDATE users SET name = $1 WHERE id = $2 RETURNING *', [name, userId]);
    const updatedUser = result.rows[0];
    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Profile update failed' });
  }
});

module.exports = router;
