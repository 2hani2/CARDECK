
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function registerUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const [existingUsers] = await pool.query(
    'SELECT id FROM users WHERE email = ?',
    [normalizedEmail]
  );

  if (existingUsers.length > 0) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES (?, ?, ?)`,
    [name.trim(), normalizedEmail, passwordHash]
  );

  return {
    id: result.insertId,
    name: name.trim(),
    email: normalizedEmail,
    role: 'user',
  };
}

module.exports = { registerUser };
