import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

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

import OrderIssue from '../OrderIssue';
import axiosMock from 'axios';

describe('OrderIssue Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders placeholder when no recent orders exist', () => {
    render(
      <MemoryRouter>
        <OrderIssue />
      </MemoryRouter>
    );

    expect(screen.getByText('No recent orders to report issues for.')).toBeInTheDocument();
  });

  it('renders recent orders and submits case to backend', async () => {
    const mockOrders = [
      { id: 'ORD-111', restaurantName: 'Taco Palace', status: 'DELIVERED', date: 'Oct 20, 6:00 PM', image: 'taco.png' },
    ];
    localStorage.setItem('quickplate_orders', JSON.stringify(mockOrders));

    axiosMock.post.mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter>
        <OrderIssue />
      </MemoryRouter>
    );

    // Should load the order
    expect(screen.getByText('Taco Palace')).toBeInTheDocument();

    // Select issue
    const wrongOrderIssue = screen.getByText('Wrong Order');
    fireEvent.click(wrongOrderIssue);

    // Submit form
    const submitBtn = screen.getByText('Continue');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(axiosMock.post).toHaveBeenCalledWith(
        expect.stringContaining('/case/create'),
        expect.objectContaining({
          orderId: 'ORD-111',
          reason: 'Wrong Order',
        }),
        expect.any(Object)
      );
      expect(mockNavigate).toHaveBeenCalledWith('/support');
    });
  });
});
