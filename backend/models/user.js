const bcrypt = require('bcryptjs');
const pool = require('../db');

// Find user by email
const findUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      'SELECT id, password FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0]; // Return the user or null if not found
  } catch (err) {
    throw new Error('Error finding user by email');
  }
};

// Find user by ID
const findUserById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0]; // Return the user or null if not found
  } catch (err) {
    throw new Error('Error finding user by ID');
  }
};

// Register a new user with hashed password
const registerUser = async (username, email, password) => {
  // Check if the email is already registered
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error('Email is already in use');
  
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    return result.rows[0]; // Return the newly created user
  } catch (err) {
    throw new Error('Error registering user');
  }
};

// Verify password when logging in
const verifyPassword = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('User not found');
  
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Incorrect password');
  return user;
};

// Secure password hashing
const hashPassword = async (password) => {
  return bcrypt.hash(password, 12); // Increase the salt rounds for better security
};

module.exports = { registerUser, findUserByEmail, findUserById, verifyPassword, hashPassword };
