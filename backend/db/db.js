const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Enable ssl if required by your Supabase configuration:
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
