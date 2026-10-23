
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/config/db.js';

describe('POST /api/auth/register', () => {
  const testEmail = 'registration-test@example.com';

  beforeAll(async () => {
    await pool.query('DELETE FROM users WHERE email = ?', [testEmail]);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = ?', [testEmail]);
    await pool.end();
  });

  it('should register a user with valid details', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: testEmail,
        password: 'StrongPass123!',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.user.email).toBe(testEmail);
    expect(response.body.user.role).toBe('user');
    expect(response.body.user.password_hash).toBeUndefined();
  });

  it('should reject a duplicate email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: testEmail,
        password: 'AnotherPass123!',
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already registered');
  });

  it('should reject invalid input', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: '',
        email: 'not-an-email',
        password: '123',
      });

    expect(response.status).toBe(400);
  });
});
