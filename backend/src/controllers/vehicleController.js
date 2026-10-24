
const {
  getAllVehicles,
  createVehicle,
} = require('../services/vehicleService');

async function listVehicles(req, res) {
  try {
    const vehicles = await getAllVehicles();

    return res.status(200).json({ vehicles });
  } catch (error) {
    console.error('Failed to retrieve vehicles:', error.message);

    return res.status(500).json({
      message: 'An unexpected error occurred',
    });
  }
}

async function addVehicle(req, res) {
  const { make, model, category, price, quantity } = req.body || {};

  if (
    typeof make !== 'string' ||
    typeof model !== 'string' ||
    typeof category !== 'string' ||
    !make.trim() ||
    !model.trim() ||
    !category.trim() ||
    price === undefined ||
    price === null ||
    price === '' ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0 ||
    !Number.isInteger(Number(quantity)) ||
    Number(quantity) < 0
  ) {
    return res.status(400).json({
      message: 'Valid make, model, category, price, and quantity are required',
    });
  }

  try {
    const vehicle = await createVehicle({
      make,
      model,
      category,
      price: Number(price),
      quantity: Number(quantity),
    });

    return res.status(201).json({
      message: 'Vehicle created successfully',
      vehicle,
    });
  } catch (error) {
    console.error('Failed to create vehicle:', error.message);

    return res.status(500).json({
      message: 'An unexpected error occurred',
    });
  }
}

module.exports = { listVehicles, addVehicle };
