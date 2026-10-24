
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import pool from '../src/config/db.js';

describe('DELETE /api/vehicles/:id', () => {
  it('should reject requests without a token', async () => {
    const response = await request(app).delete('/api/vehicles/1');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication token required');
  });

  it('should reject a regular user', async () => {
    const token = jwt.sign(
      { id: 123, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .delete('/api/vehicles/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Administrator access required');
  });

  it('should reject an invalid vehicle ID', async () => {
    const token = jwt.sign(
      { id: 123, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .delete('/api/vehicles/abc')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('A valid vehicle ID is required');
  });

  it('should return 404 when the vehicle does not exist', async () => {
    const token = jwt.sign(
      { id: 123, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .delete('/api/vehicles/2147483647')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Vehicle not found');
  });

  it('should delete a vehicle when an admin provides a valid ID', async () => {
    const token = jwt.sign(
      { id: 123, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    let vehicleId;

    try {
      const [insertResult] = await pool.query(
        `INSERT INTO vehicles (make, model, category, price, quantity)
         VALUES (?, ?, ?, ?, ?)`,
        ['TDD Test Motors', 'Delete Me', 'Sedan', 15000, 2]
      );

      vehicleId = insertResult.insertId;

      const response = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Vehicle deleted successfully');

      const [rows] = await pool.query(
        'SELECT id FROM vehicles WHERE id = ?',
        [vehicleId]
      );

      expect(rows).toHaveLength(0);
    } finally {
      if (vehicleId !== undefined) {
        await pool.query('DELETE FROM vehicles WHERE id = ?', [vehicleId]);
      }
    }
  });
});
