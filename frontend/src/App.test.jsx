import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function openInventory() {
  // The current CARDECK app opens on the homepage when the user is signed out.
  fireEvent.click(screen.getByRole('button', { name: 'Explore cars' }));
  expect(
    await screen.findByRole('heading', { name: /available vehicles/i })
  ).toBeInTheDocument();
}

describe('CARDECK Inventory', () => {
  it('displays the inventory heading and loads vehicles', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          vehicles: [
            {
              id: 1,
              make: 'Toyota',
              model: 'Camry',
              category: 'Sedan',
              price: 2800000,
              quantity: 3,
            },
          ],
        }),
      })
    );

    render(<App />);
    await openInventory();

    await waitFor(() => {
      expect(screen.getByText('Camry')).toBeInTheDocument();
    });
  });

  it('filters vehicles by search text', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          vehicles: [
            {
              id: 1,
              make: 'Toyota',
              model: 'Camry',
              category: 'Sedan',
              price: 2800000,
              quantity: 3,
            },
            {
              id: 2,
              make: 'Honda',
              model: 'Civic',
              category: 'Sedan',
              price: 2400000,
              quantity: 2,
            },
          ],
        }),
      })
    );

    render(<App />);
    await openInventory();

    await waitFor(() => {
      expect(screen.getByText('Camry')).toBeInTheDocument();
      expect(screen.getByText('Civic')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/search make or model/i), {
      target: { value: 'Toyota' },
    });

    await waitFor(() => {
      expect(screen.getByText('Camry')).toBeInTheDocument();
      expect(screen.queryByText('Civic')).not.toBeInTheDocument();
    });
  });

  it('shows a showcase notice when the backend cannot be reached', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error'))
    );

    render(<App />);
    await openInventory();

    expect(
      await screen.findByText(/showing showcase cars\. start the backend/i)
    ).toBeInTheDocument();

    // The app remains browseable using its showcase catalogue.
    expect(screen.getByText('Fortuner')).toBeInTheDocument();
  });
});
