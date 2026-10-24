import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

const storage = new Map();

const localStorageMock = {
  getItem: vi.fn((key) => storage.get(key) ?? null),
  setItem: vi.fn((key, value) => storage.set(key, String(value))),
  removeItem: vi.fn((key) => storage.delete(key)),
  clear: vi.fn(() => storage.clear()),
};

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: localStorageMock,
});