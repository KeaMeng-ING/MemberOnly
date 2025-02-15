// db/queries.js

const pool = require("./pool");

async function createUser(firstName, lastName, userName, email, password) {
  try {
    const { rows } = await pool.query(
      "INSERT INTO users (firstname, lastname, username, email, password, memberstatus) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [firstName, lastName, userName, email, password, "not member"]
    );
    console.log(rows);
    return rows;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function fetchAllUser() {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    return rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

module.exports = {
  createUser,
  fetchAllUser,
};
