
const pool = require('../config/db');

async function getAllVehicles(filters = {}) {
  let sql = `
    SELECT id, make, model, category, price, quantity,
           created_at, updated_at
    FROM vehicles
    WHERE 1 = 1
  `;

  const params = [];

  // Search by make or model
  if (filters.search) {
    sql += ' AND (make LIKE ? OR model LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm);
  }

  // Filter by category
  if (filters.category) {
    sql += ' AND category = ?';
    params.push(filters.category);
  }

  // Filter by minimum price
  if (filters.minPrice !== undefined) {
    sql += ' AND price >= ?';
    params.push(filters.minPrice);
  }

  // Filter by maximum price
  if (filters.maxPrice !== undefined) {
    sql += ' AND price <= ?';
    params.push(filters.maxPrice);
  }

  sql += ' ORDER BY id DESC';

  const [vehicles] = await pool.query(sql, params);

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

async function deleteVehicle(id) {
  const [result] = await pool.query(
    'DELETE FROM vehicles WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
