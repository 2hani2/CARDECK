
const express = require('express');
const {
  listVehicles,
  addVehicle,
} = require('../controllers/vehicleController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', listVehicles);
router.post('/', authenticateToken, requireAdmin, addVehicle);

module.exports = router;
