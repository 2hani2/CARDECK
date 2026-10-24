
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import pool from '../src/config/db.js';

describe('POST /api/vehicles', () => {
  it('should reject requests without a token', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .send({
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 20000,
        quantity: 5,
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
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 20000,
        quantity: 5,
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
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${token}`)
      .send({
        make: '',
        model: 'Corolla',
        category: 'Sedan',
        price: -100,
        quantity: 5,
      });

    expect(response.status).toBe(400);
  });

  it('should create a vehicle when an admin provides valid details', async () => {
    const token = jwt.sign(
      { id: 123, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const vehicleDetails = {
      make: 'TDD Test Motors',
      model: 'Test Model',
      category: 'Sedan',
      price: 20000,
      quantity: 5,
    };

    let createdVehicleId;

    try {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${token}`)
        .send(vehicleDetails);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Vehicle created successfully');
      expect(response.body.vehicle.make).toBe(vehicleDetails.make);
      expect(response.body.vehicle.model).toBe(vehicleDetails.model);
      expect(Number(response.body.vehicle.price)).toBe(20000);
      expect(response.body.vehicle.quantity).toBe(5);

      createdVehicleId = response.body.vehicle.id;

      const [rows] = await pool.query(
        'SELECT id FROM vehicles WHERE id = ?',
        [createdVehicleId]
      );

      expect(rows).toHaveLength(1);
    } finally {
      if (createdVehicleId !== undefined) {
        await pool.query(
          'DELETE FROM vehicles WHERE id = ?',
          [createdVehicleId]
        );
      }
    }
  });
});
