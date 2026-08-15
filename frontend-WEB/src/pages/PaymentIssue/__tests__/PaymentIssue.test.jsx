import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { getStoredUser } from '../../../services/firebase';

vi.mock('axios');

vi.mock('../../../services/firebase', () => ({
  getStoredUser: vi.fn().mockReturnValue({ firebaseIdToken: 'test_token' }),
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

// Hoist API base URL
vi.mock('../../../services/firebase', () => {
  import.meta.env.VITE_API_BASE_URL = 'https://api.quickplate.com';
  return {
    getStoredUser: vi.fn().mockReturnValue({ firebaseIdToken: 'test_token' }),
  };
});

import PaymentIssue from '../PaymentIssue';
import axiosMock from 'axios';

describe('PaymentIssue Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders placeholder when no recent orders exist', () => {
    render(
      <MemoryRouter>
        <PaymentIssue />
      </MemoryRouter>
    );

    expect(screen.getByText('No recent orders to report issues for.')).toBeInTheDocument();
  });

  it('renders orders and submits payment case details', async () => {
    const mockOrders = [
      { id: 'ORD-222', restaurantName: 'Burger Joint', status: 'DELIVERED', date: 'Oct 21, 5:00 PM', image: 'burger.png', total: 20.00 },
    ];
    localStorage.setItem('quickplate_orders', JSON.stringify(mockOrders));

    axiosMock.post.mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter>
        <PaymentIssue />
      </MemoryRouter>
    );

    expect(screen.getByText('Burger Joint')).toBeInTheDocument();

    // Select issue
    const doubleChargedRadio = screen.getByText('Double Charged');
    fireEvent.click(doubleChargedRadio);

    // Enter additional details
    const textDetails = screen.getByPlaceholderText(/Please provide any additional information/i);
    fireEvent.change(textDetails, { target: { value: 'Charged twice on my Visa card.' } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Submit Payment Query/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(axiosMock.post).toHaveBeenCalledWith(
        expect.stringContaining('/case/create'),
        expect.objectContaining({
          orderId: 'ORD-222',
          type: 'Payment Issue',
          reason: 'Double Charged',
        }),
        expect.any(Object)
      );
      expect(mockNavigate).toHaveBeenCalledWith('/support');
    });
  });
});
