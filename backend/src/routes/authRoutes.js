
const express = require('express');
const { register } = require('../controllers/authController');
const { login } = require('../controllers/loginController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = router;
