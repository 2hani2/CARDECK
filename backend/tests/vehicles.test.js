
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/vehicles', () => {
  it('should return a list of vehicles', async () => {
    const response = await request(app).get('/api/vehicles');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('vehicles');
    expect(Array.isArray(response.body.vehicles)).toBe(true);
  });
});
