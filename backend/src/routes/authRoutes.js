
const express = require('express');
const { register } = require('../controllers/authController');
const { login } = require('../controllers/loginController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticateToken, (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
});

module.exports = router;
