
const { registerUser } = require('../services/authService');

async function register(req, res) {
  const { name, email, password } = req.body || {};

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !name.trim() ||
    !email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    password.length < 8
  ) {
    return res.status(400).json({
      message: 'Valid name, email, and password of at least 8 characters are required',
    });
  }

  try {
    const user = await registerUser({ name, email, password });

    return res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    if (error.statusCode === 409) {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error('Registration failed:', error.message);

    return res.status(500).json({
      message: 'An unexpected error occurred',
    });
  }
}

module.exports = { register };
