import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { getStoredUser } from '../../../services/firebase';

vi.mock('axios');

vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('../../../services/firebase', () => ({
  getStoredUser: vi.fn(),
}));

vi.mock('../../../hooks/useHaptic', () => ({
  default: () => ({
    lightTap: vi.fn(),
    mediumTap: vi.fn(),
    heavyTap: vi.fn(),
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

// Hoist API base URL
vi.mock('../../../services/firebase', () => {
  import.meta.env.VITE_API_BASE_URL = 'https://api.quickplate.com';
  return {
    getStoredUser: vi.fn(),
  };
});

import WalletPayment from '../WalletPayment';
import axiosMock from 'axios';

const originalSetTimeout = global.setTimeout;

describe('WalletPayment Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.spyOn(global, 'setTimeout').mockImplementation((cb, delay) => {
      if (delay === 2000) {
        cb();
        return 123;
      }
      return originalSetTimeout(cb, delay);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('formats card number and expiry input correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <WalletPayment />
      </MemoryRouter>
    );

    const cardInput = container.querySelector('input[placeholder="4000 1234 5678 9010"]');
    fireEvent.change(cardInput, { target: { value: '4111222233334444' } });
    expect(cardInput.value).toBe('4111 2222 3333 4444');

    const expiryInput = container.querySelector('input[placeholder="MM/YY"]');
    fireEvent.change(expiryInput, { target: { value: '1226' } });
    expect(expiryInput.value).toBe('12/26');
  });

  it('submits payment form successfully and triggers wallet top-up API call', async () => {
    getStoredUser.mockReturnValue({ customerId: 'CUST-888' });
    axiosMock.post.mockResolvedValueOnce({ data: { success: true } });

    const { container } = render(
      <MemoryRouter>
        <WalletPayment />
      </MemoryRouter>
    );

    const amountInput = container.querySelector('input[placeholder="0.00"]');
    const cardInput = container.querySelector('input[placeholder="4000 1234 5678 9010"]');
    const expiryInput = container.querySelector('input[placeholder="MM/YY"]');
    const cvvInput = container.querySelector('input[placeholder="123"]');
    const nameInput = container.querySelector('input[placeholder="John Doe"]');

    fireEvent.change(amountInput, { target: { value: '50.00' } });
    fireEvent.change(cardInput, { target: { value: '4111 2222 3333 4444' } });
    fireEvent.change(expiryInput, { target: { value: '12/26' } });
    fireEvent.change(cvvInput, { target: { value: '123' } });
    fireEvent.change(nameInput, { target: { value: 'Alex Walker' } });

    const submitBtn = screen.getByRole('button', { name: /Pay \$50.00/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(axiosMock.post).toHaveBeenCalledWith(
        expect.stringContaining('/wallet/add-funds'),
        expect.objectContaining({
          customerId: 'CUST-888',
          amount: 50.00,
        }),
        expect.any(Object)
      );
      expect(screen.getByText('Payment Successful')).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/customerwallet', { replace: true });
    });

    // Check transaction save in localStorage
    const savedTxns = JSON.parse(localStorage.getItem('quickplate_wallet_txns'));
    expect(savedTxns.length).toBe(1);
    expect(savedTxns[0].amount).toBe(50);
  });
});
