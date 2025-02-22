// db/queries.js

const pool = require("./pool");

async function createUser(firstName, lastName, userName, email, password) {
  try {
    const { rows } = await pool.query(
      "INSERT INTO users (firstname, lastname, username, email, password, memberstatus) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [firstName, lastName, userName, email, password, "Not Member"]
    );
    return rows;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function deleteMessage(headline) {
  try {
    const { rows } = await pool.query(
      "DELETE FROM messages WHERE headline = $1",
      [headline]
    );
    return rows;
  } catch (error) {
    console.error("Error deleting message:", error);
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
      "UPDATE users SET memberstatus = 'Member' WHERE id = $1",
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Error updating membership status:", error);
    throw error;
  }
}

async function updateAdminStatus(id) {
  try {
    const { rows } = await pool.query(
      "UPDATE users SET memberstatus = 'Admin', isAdmin = true WHERE id = $1",
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Error updating admin status:", error);
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

async function getTotalMessageCount() {
  const result = await pool.query("SELECT COUNT(*) as count FROM messages");
  return parseInt(result.rows[0].count);
}

async function getMessagesPaginated(limit, offset) {
  const result = await pool.query(
    `SELECT messages.*, users.username 
     FROM messages 
     LEFT JOIN users ON messages.userid = users.id 
     ORDER BY timecreated DESC 
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
}

async function getMessageById(messageId) {
  const result = await pool.query("SELECT * FROM messages WHERE id = $1", [
    messageId,
  ]);
  return result.rows[0];
}

async function updateMessage(userId, headline, description) {
  await pool.query(
    "UPDATE messages SET headline = $1, description = $2 WHERE userid = $3 AND headline = $4",
    [headline, description, userId, headline]
  );
}

async function getMessageByHeadline(headline) {
  const result = await pool.query(
    "SELECT * FROM messages WHERE headline = $1",
    [headline]
  );
  return result.rows[0];
}

module.exports = {
  getMessageByHeadline,
  updateMessage,
  getMessageById,
  createUser,
  fetchAllUser,
  updateMembershipStatus,
  fetchAllMessage,
  createMessage,
  fetchUserandMessageById,
  updateAdminStatus,
  getTotalMessageCount,
  getMessagesPaginated,
  deleteMessage,
};
