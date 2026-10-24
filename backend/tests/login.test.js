
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import pool from '../src/config/db.js';
import app from '../src/app.js';

describe('POST /api/auth/login', () => {
  const testEmail = 'login-test@example.com';
  const testPassword = 'StrongPass123!';

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(testPassword, 12);

    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, 'user')
       ON DUPLICATE KEY UPDATE
       password_hash = VALUES(password_hash)`,
      ['Login Test User', testEmail, passwordHash]
    );
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = ?', [testEmail]);
    await pool.end();
  });

  it('should log in with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user.email).toBe(testEmail);
    expect(response.body.user.password_hash).toBeUndefined();
  });

  it('should reject an incorrect password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'WrongPassword123!',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should reject an email that does not exist', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'no-such-user@example.com',
        password: testPassword,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('should reject invalid input', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'not-an-email',
        password: '',
      });

    expect(response.status).toBe(400);
  });
});
