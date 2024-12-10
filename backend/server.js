const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const authRoutes = require('./routes/authRoutes');
const logger = require('./logger');  // Import the logger

// Initialize dotenv to access environment variables
dotenv.config();

const app = express();

// Middleware for logging incoming requests
app.use((req, res, next) => {
  logger.info(`Request received: ${req.method} ${req.url}`);
  next();
});

// Middleware for parsing JSON
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://10.100.80.110:3000',
  'http://10.100.68.106:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/auth', authRoutes);

// Example login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate user credentials here (assuming user is found and validated)
  const user = { id: 1, email }; // Placeholder, replace with real user lookup logic

  // Create JWT token for the authenticated user
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Send token back to the client
  res.json({ message: 'Login successful', token });
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Food App API!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(5000, () => {
  logger.info('Server running on http://localhost:5000');
});
