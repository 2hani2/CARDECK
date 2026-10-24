
const { loginUser } = require('../services/loginService');

async function login(req, res) {
  const { email, password } = req.body || {};

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !password.trim()
  ) {
    return res.status(400).json({
      message: 'Valid email and password are required',
    });
  }

  try {
    const result = await loginUser({ email, password });

    if (!result) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    return res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error('Login failed:', error.message);

    return res.status(500).json({
      message: 'An unexpected error occurred',
    });
  }
}

module.exports = { login };
