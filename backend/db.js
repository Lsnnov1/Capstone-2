require('dotenv').config(); 

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1); //if DB connection fails
  } else {
    console.log('Database connected at:', res.rows[0].now);
  }
});


module.exports = pool;
