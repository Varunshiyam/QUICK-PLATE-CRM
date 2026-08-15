import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Checkout from '../Checkout';
import useAppStore from '../../../store/useAppStore';
import axios from 'axios';

vi.mock('axios');

vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
    span: React.forwardRef(({ children, ...props }, ref) => <span ref={ref} {...props}>{children}</span>),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('../../../services/firebase', () => ({
  getStoredUser: () => ({
    firebaseIdToken: 'token123',
    address: '123 Sweet Home Ave',
  }),
}));

vi.mock('../../../hooks/useHaptic', () => ({
  default: () => ({
    lightTap: vi.fn(),
    mediumTap: vi.fn(),
    heavyTap: vi.fn(),
    successTap: vi.fn(),
    errorTap: vi.fn(),
  }),
}));

const mockNavigate = vi.fn();
const mockLocation = {
  state: {
    orderId: 'ORD-12345',
    useWallet: true,
    computedWalletApplied: 10.00,
    computedSubtotal: 25.00,
    computedTaxes: 4.50,
    computedTotalPay: 19.50,
  },
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

describe('Checkout Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({
      cart: [{ id: 'p1', title: 'Pizza', price: '$25.00', quantity: 1 }],
    });
  });

  it('renders billing card and delivery location details', () => {
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    expect(screen.getByText('123 Sweet Home Ave')).toBeInTheDocument();
    expect(screen.getByText('$19.50')).toBeInTheDocument();
    expect(screen.getByText('Confirm & Pay')).toBeInTheDocument();
  });

  it('submits checkout details successfully and redirects to checkout session link for cards', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        checkoutUrl: 'https://stripe.com/checkout/session',
      },
    });

    // Mock window.location.href setter
    const mockWindowLocation = { href: '' };
    vi.stubGlobal('location', mockWindowLocation);

    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );

    const payBtn = screen.getByRole('button', { name: /Confirm & Pay/i });
    fireEvent.click(payBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(mockWindowLocation.href).toBe('https://stripe.com/checkout/session');
    });
  });
});
