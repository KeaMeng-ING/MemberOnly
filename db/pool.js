// db/pool.js
const { Pool } = require("pg");
require("dotenv").config(); // Load .env variables

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Railway's PostgreSQL
  },
});

Pool.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));
