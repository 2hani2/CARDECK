
import { describe, it, expect, afterEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import pool from '../src/config/db.js';

const userToken = jwt.sign(
  { id: 123, role: 'user' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

const adminToken = jwt.sign(
  { id: 456, role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

let vehicleIds = [];

async function createTestVehicle(quantity) {
  const [result] = await pool.query(
    `INSERT INTO vehicles (make, model, category, price, quantity)
     VALUES (?, ?, ?, ?, ?)`,
    ['TDD Inventory Motors', 'Stock Test', 'Sedan', 25000, quantity]
  );

  vehicleIds.push(result.insertId);
  return result.insertId;
}

afterEach(async () => {
  if (vehicleIds.length > 0) {
    await pool.query('DELETE FROM vehicles WHERE id IN (?)', [vehicleIds]);
    vehicleIds = [];
  }
});

describe('POST /api/vehicles/:id/purchase', () => {
  it('requires authentication', async () => {
    const id = await createTestVehicle(2);

    const response = await request(app)
      .post(`/api/vehicles/${id}/purchase`);

    expect(response.status).toBe(401);
  });

  it('decreases stock by one for an authenticated user', async () => {
    const id = await createTestVehicle(2);

    const response = await request(app)
      .post(`/api/vehicles/${id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);

    const [rows] = await pool.query(
      'SELECT quantity FROM vehicles WHERE id = ?',
      [id]
    );

    expect(rows[0].quantity).toBe(1);
  });

  it('does not allow a purchase when stock is zero', async () => {
    const id = await createTestVehicle(0);

    const response = await request(app)
      .post(`/api/vehicles/${id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(409);
  });
});

describe('POST /api/vehicles/:id/restock', () => {
  it('rejects a regular user', async () => {
    const id = await createTestVehicle(2);

    const response = await request(app)
      .post(`/api/vehicles/${id}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 3 });

    expect(response.status).toBe(403);
  });

  it('increases stock for an admin', async () => {
    const id = await createTestVehicle(2);

    const response = await request(app)
      .post(`/api/vehicles/${id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 3 });

    expect(response.status).toBe(200);

    const [rows] = await pool.query(
      'SELECT quantity FROM vehicles WHERE id = ?',
      [id]
    );

    expect(rows[0].quantity).toBe(5);
  });
});
