
const pool = require('../config/db');

async function getAllVehicles() {
  const [vehicles] = await pool.query(
    `SELECT id, make, model, category, price, quantity,
            created_at, updated_at
     FROM vehicles
     ORDER BY id DESC`
  );

  return vehicles;
}

async function createVehicle({ make, model, category, price, quantity }) {
  const [result] = await pool.query(
    `INSERT INTO vehicles (make, model, category, price, quantity)
     VALUES (?, ?, ?, ?, ?)`,
    [make.trim(), model.trim(), category.trim(), price, quantity]
  );

  const [vehicles] = await pool.query(
    `SELECT id, make, model, category, price, quantity,
            created_at, updated_at
     FROM vehicles
     WHERE id = ?`,
    [result.insertId]
  );

  return vehicles[0];
}

async function updateVehicle(id, { make, model, category, price, quantity }) {
  const [result] = await pool.query(
    `UPDATE vehicles
     SET make = ?, model = ?, category = ?, price = ?, quantity = ?
     WHERE id = ?`,
    [make.trim(), model.trim(), category.trim(), price, quantity, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const [vehicles] = await pool.query(
    `SELECT id, make, model, category, price, quantity,
            created_at, updated_at
     FROM vehicles
     WHERE id = ?`,
    [id]
  );

  return vehicles[0] || null;
}

module.exports = { getAllVehicles, createVehicle, updateVehicle };
