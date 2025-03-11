// db/pool.js
const { Pool } = require("pg");
require("dotenv").config(); // Load .env variables

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,

  ssl: {
    rejectUnauthorized: false, // Required for Render.com PostgreSQL
  },
});
