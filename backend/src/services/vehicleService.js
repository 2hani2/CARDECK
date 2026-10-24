
const pool = require('../config/db');

async function getAllVehicles(filters = {}) {
  let sql = `
    SELECT id, make, model, category, price, quantity,
           created_at, updated_at
    FROM vehicles
    WHERE 1 = 1
  `;

  const params = [];

  if (filters.search) {
    sql += ' AND (make LIKE ? OR model LIKE ?)';
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm);
  }

  if (filters.category) {
    sql += ' AND category = ?';
    params.push(filters.category);
  }

  if (filters.minPrice !== undefined) {
    sql += ' AND price >= ?';
    params.push(filters.minPrice);
  }

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

// Purchase one vehicle by decreasing stock by one.
async function purchaseVehicle(id) {
  const [result] = await pool.query(
    `UPDATE vehicles
     SET quantity = quantity - 1
     WHERE id = ? AND quantity > 0`,
    [id]
  );

  if (result.affectedRows === 0) {
    const [vehicles] = await pool.query(
      'SELECT id FROM vehicles WHERE id = ?',
      [id]
    );

    if (vehicles.length === 0) {
      return { notFound: true };
    }

    return { outOfStock: true };
  }

  return { success: true };
}

// Add the specified number of vehicles back into stock.
async function restockVehicle(id, quantity) {
  const [result] = await pool.query(
    `UPDATE vehicles
     SET quantity = quantity + ?
     WHERE id = ?`,
    [quantity, id]
  );

  if (result.affectedRows === 0) {
    return { notFound: true };
  }

  return { success: true };
}

module.exports = {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
};
