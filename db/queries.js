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

async function updateMembershipStatus(id) {
  try {
    const { rows } = await pool.query(
      "UPDATE users SET memberstatus = 'member' WHERE id = $1",
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Error updating membership status:", error);
    throw error;
  }
}

async function fetchAllMessage() {
  try {
    const { rows } = await pool.query(`
      SELECT messages.*, users.username 
      FROM messages 
      JOIN users ON messages.userid = users.id
    `);
    return rows;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

async function createMessage(headline, description, id) {
  try {
    const { rows } = await pool.query(
      "INSERT INTO messages (headline, description, userid) VALUES ($1, $2, $3) RETURNING *",
      [headline, description, id]
    );
    return rows;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
}

async function fetchUserandMessageById(id) {
  try {
    const userQuery = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const messageQuery = await pool.query(
      "SELECT * FROM messages WHERE userid = $1",
      [id]
    );

    return {
      user: userQuery.rows[0],
      messages: messageQuery.rows,
    };
  } catch (error) {
    console.error("Error fetching user and messages by id:", error);
    throw error;
  }
}

module.exports = {
  createUser,
  fetchAllUser,
  updateMembershipStatus,
  fetchAllMessage,
  createMessage,
  fetchUserandMessageById,
};
