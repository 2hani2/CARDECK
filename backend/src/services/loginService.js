
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const [users] = await pool.query(
    `SELECT id, name, email, password_hash, role
     FROM users
     WHERE email = ?`,
    [normalizedEmail]
  );

  if (users.length === 0) {
    return null;
  }

  const user = users[0];

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    return null;
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = { loginUser };
