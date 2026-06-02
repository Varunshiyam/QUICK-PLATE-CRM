import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { getStoredUser } from '../../../services/firebase';

vi.mock('axios');

vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
  },
}));

vi.mock('../../../services/firebase', () => ({
  getStoredUser: vi.fn(),
}));

vi.mock('../../../hooks/useHaptic', () => ({
  default: () => ({
    lightTap: vi.fn(),
    mediumTap: vi.fn(),
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Hoist API base URL definition
vi.mock('../../../services/firebase', () => {
  import.meta.env.VITE_API_BASE_URL = 'https://api.quickplate.com';
  return {
    getStoredUser: vi.fn(),
  };
});

import CustomerWallet from '../CustomerWallet';

describe('CustomerWallet Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders available balance from fallback transactions in mock mode', async () => {
    getStoredUser.mockReturnValue(null);
    const mockTxns = [
      { amount: '50.00', type: 'Wallet', description: 'Added via Card', date: '2026-06-01T12:00:00Z' },
      { amount: '-15.50', type: 'Order Deduct', description: 'Pizza Order', date: '2026-06-02T12:00:00Z' },
    ];
    localStorage.setItem('quickplate_wallet_txns', JSON.stringify(mockTxns));

    render(
      <MemoryRouter>
        <CustomerWallet />
      </MemoryRouter>
    );

    // Initial load: 50.00 - 15.50 = 34.50
    expect(screen.getByText('$34.50')).toBeInTheDocument();
    expect(screen.getByText('Added via Card')).toBeInTheDocument();
    expect(screen.getByText('Pizza Order')).toBeInTheDocument();
  });

  it('calls API to fetch wallet balance when token is present', async () => {
    getStoredUser.mockReturnValue({
      firebaseIdToken: 'token_abc',
    });

    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        availableBalance: 120.75,
      },
    });

    render(
      <MemoryRouter>
        <CustomerWallet />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('wallet/balance?token=token_abc')
      );
      expect(screen.getByText('$120.75')).toBeInTheDocument();
    });
  });

  it('navigates to add funds page on button click', () => {
    render(
      <MemoryRouter>
        <CustomerWallet />
      </MemoryRouter>
    );

    const addFundsBtn = screen.getByText('Add Funds');
    fireEvent.click(addFundsBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/wallet-payment');
  });
});
