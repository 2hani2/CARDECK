
const express = require('express');
const {
  listVehicles,
  addVehicle,
  editVehicle,
  removeVehicle,
} = require('../controllers/vehicleController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', listVehicles);
router.post('/', authenticateToken, requireAdmin, addVehicle);
router.put('/:id', authenticateToken, requireAdmin, editVehicle);
router.delete('/:id', authenticateToken, requireAdmin, removeVehicle);

module.exports = router;
