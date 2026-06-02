import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import useAppStore from '../../../store/useAppStore';

vi.mock('axios');

vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
  },
}));

vi.mock('../../../hooks/useHaptic', () => ({
  default: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

const mockNavigate = vi.fn();
let mockSearchParams = new URLSearchParams('');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParams, vi.fn()],
  };
});

// Hoist API base URL
vi.mock('../../../store/useAppStore', () => {
  import.meta.env.VITE_API_BASE_URL = 'https://api.quickplate.com';
  return {
    default: vi.fn().mockReturnValue({
      clearCart: vi.fn(),
    }),
  };
});

import PaymentSuccess from '../PaymentSuccess';
import axiosMock from 'axios';

describe('PaymentSuccess Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockSearchParams = new URLSearchParams('orderId=ORD-999');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders verifying state and handles successful payment polling', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: { paymentStatus: 'PENDING' },
    }).mockResolvedValueOnce({
      data: { paymentStatus: 'PAID' },
    });

    render(
      <MemoryRouter>
        <PaymentSuccess />
      </MemoryRouter>
    );

    // Initial check
    expect(screen.getByText('Verifying Payment...')).toBeInTheDocument();

    // Fast-forward interval
    await vi.runOnlyPendingTimersAsync();
    await vi.runOnlyPendingTimersAsync();

    await waitFor(() => {
      expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
    });

    // Verify redirection delay
    await vi.runOnlyPendingTimersAsync();
    expect(mockNavigate).toHaveBeenCalledWith('/tracking/ORD-999', { replace: true });
  });

  it('renders error state if orderId is missing', () => {
    mockSearchParams = new URLSearchParams('');

    render(
      <MemoryRouter>
        <PaymentSuccess />
      </MemoryRouter>
    );

    expect(screen.getByText('Verification Failed')).toBeInTheDocument();
    expect(screen.getByText('No Order ID found in URL.')).toBeInTheDocument();

    const returnBtn = screen.getByText('Return to Home');
    fireEvent.click(returnBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});
