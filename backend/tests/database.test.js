
import { describe, it, expect } from 'vitest';
import pool from '../src/config/db.js';

describe('MySQL database connection', () => {
  it('should connect and select the car_dealership database', async () => {
    const [rows] = await pool.query(
      'SELECT DATABASE() AS databaseName'
    );

    expect(rows[0].databaseName).toBe('car_dealership');
  });
});
