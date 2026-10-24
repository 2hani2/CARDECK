
const express = require('express');
const {
  listVehicles,
  addVehicle,
  editVehicle,
  removeVehicle,
  purchaseVehicleController,
  restockVehicleController,
} = require('../controllers/vehicleController');

const { authenticateToken } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

// View all vehicles
router.get('/', listVehicles);

// Admin-only vehicle management
router.post('/', authenticateToken, requireAdmin, addVehicle);
router.put('/:id', authenticateToken, requireAdmin, editVehicle);
router.delete('/:id', authenticateToken, requireAdmin, removeVehicle);

// Any authenticated user can purchase a vehicle
router.post('/:id/purchase', authenticateToken, purchaseVehicleController);

// Only administrators can restock vehicles
router.post(
  '/:id/restock',
  authenticateToken,
  requireAdmin,
  restockVehicleController
);

module.exports = router;
