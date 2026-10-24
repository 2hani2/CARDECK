
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import pool from '../src/config/db.js';

describe('PUT /api/vehicles/:id', () => {
  it('should reject requests without a token', async () => {
    const response = await request(app)
      .put('/api/vehicles/1')
      .send({
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 22000,
        quantity: 4,
      });

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
      .put('/api/vehicles/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 22000,
        quantity: 4,
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Administrator access required');
  });

  it('should reject invalid vehicle details', async () => {
    const token = jwt.sign(
      { id: 123, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .put('/api/vehicles/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        make: '',
        model: 'Corolla',
        category: 'Sedan',
        price: -10,
        quantity: 4,
      });

    expect(response.status).toBe(400);
  });

  it('should return 404 when the vehicle does not exist', async () => {
    const token = jwt.sign(
      { id: 123, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .put('/api/vehicles/2147483647')
      .set('Authorization', `Bearer ${token}`)
      .send({
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 22000,
        quantity: 4,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Vehicle not found');
  });

  it('should update a vehicle when an admin provides valid details', async () => {
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
        ['TDD Test Motors', 'Old Model', 'Sedan', 15000, 2]
      );

      vehicleId = insertResult.insertId;

      const response = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          make: 'TDD Test Motors',
          model: 'Updated Model',
          category: 'SUV',
          price: 25000,
          quantity: 7,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Vehicle updated successfully');
      expect(response.body.vehicle.id).toBe(vehicleId);
      expect(response.body.vehicle.model).toBe('Updated Model');
      expect(response.body.vehicle.category).toBe('SUV');
      expect(Number(response.body.vehicle.price)).toBe(25000);
      expect(response.body.vehicle.quantity).toBe(7);

      const [rows] = await pool.query(
        'SELECT model, quantity FROM vehicles WHERE id = ?',
        [vehicleId]
      );

      expect(rows[0].model).toBe('Updated Model');
      expect(rows[0].quantity).toBe(7);
    } finally {
      if (vehicleId !== undefined) {
        await pool.query(
          'DELETE FROM vehicles WHERE id = ?',
          [vehicleId]
        );
      }
    }
  });
});
