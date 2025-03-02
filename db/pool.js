// db/pool.js
const { Pool } = require("pg");
require("dotenv").config(); // Load .env variables

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Railway's PostgreSQL
  },
});
