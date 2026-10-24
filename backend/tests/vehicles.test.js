
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/config/db.js';

describe('GET /api/vehicles', () => {
  let vehicleIds = [];

  beforeAll(async () => {
    const testVehicles = [
      ['TDD Search Motors', 'Search Sedan', 'Sedan', 20000, 3],
      ['TDD Search Motors', 'Search SUV', 'SUV', 35000, 2],
      ['TDD Filter Motors', 'Filter Hatchback', 'Hatchback', 15000, 5],
    ];

    for (const vehicle of testVehicles) {
      const [result] = await pool.query(
        `INSERT INTO vehicles (make, model, category, price, quantity)
         VALUES (?, ?, ?, ?, ?)`,
        vehicle
      );

      vehicleIds.push(result.insertId);
    }
  });

  afterAll(async () => {
    if (vehicleIds.length > 0) {
      await pool.query(
        'DELETE FROM vehicles WHERE id IN (?)',
        [vehicleIds]
      );
    }
  });

  it('should return a list of vehicles', async () => {
    const response = await request(app).get('/api/vehicles');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('vehicles');
    expect(Array.isArray(response.body.vehicles)).toBe(true);
  });

  it('should search vehicles by make or model', async () => {
    const response = await request(app)
      .get('/api/vehicles')
      .query({ search: 'Search SUV' });

    expect(response.status).toBe(200);
    expect(response.body.vehicles.length).toBeGreaterThan(0);
    expect(
      response.body.vehicles.some(
        (vehicle) => vehicle.model === 'Search SUV'
      )
    ).toBe(true);
  });

  it('should filter vehicles by category', async () => {
    const response = await request(app)
      .get('/api/vehicles')
      .query({ category: 'SUV' });

    expect(response.status).toBe(200);
    expect(response.body.vehicles.length).toBeGreaterThan(0);
    expect(
      response.body.vehicles.every(
        (vehicle) => vehicle.category === 'SUV'
      )
    ).toBe(true);
  });

  it('should filter vehicles by minimum and maximum price', async () => {
    const response = await request(app)
      .get('/api/vehicles')
      .query({ minPrice: 18000, maxPrice: 30000 });

    expect(response.status).toBe(200);
    expect(response.body.vehicles.length).toBeGreaterThan(0);
    expect(
      response.body.vehicles.every(
        (vehicle) =>
          Number(vehicle.price) >= 18000 &&
          Number(vehicle.price) <= 30000
      )
    ).toBe(true);
  });

  it('should combine search and category filters', async () => {
    const response = await request(app)
      .get('/api/vehicles')
      .query({ search: 'TDD Search', category: 'SUV' });

    expect(response.status).toBe(200);
    expect(
      response.body.vehicles.some(
        (vehicle) =>
          vehicle.make === 'TDD Search Motors' &&
          vehicle.category === 'SUV'
      )
    ).toBe(true);

    expect(
      response.body.vehicles.every(
        (vehicle) => vehicle.category === 'SUV'
      )
    ).toBe(true);
  });
});
