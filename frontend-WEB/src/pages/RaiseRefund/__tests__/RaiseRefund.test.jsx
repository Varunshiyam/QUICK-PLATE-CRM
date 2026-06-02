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
    success: vi.fn(),
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

import RaiseRefund from '../RaiseRefund';
import axiosMock from 'axios';

describe('RaiseRefund Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders order options and submits refund details successfully', async () => {
    const mockOrders = [
      { id: 'ORD-333', restaurantName: 'Taco Garden', status: 'DELIVERED', date: '2026-06-01', image: 'taco.png', total: 12.50 },
    ];
    localStorage.setItem('quickplate_orders', JSON.stringify(mockOrders));

    axiosMock.post.mockResolvedValueOnce({ data: { success: true } });

    render(
      <MemoryRouter>
        <RaiseRefund />
      </MemoryRouter>
    );

    // Enter email and description
    const emailInput = screen.getByLabelText(/Contact Email/i);
    fireEvent.change(emailInput, { target: { value: 'user@test.com' } });

    const descTextarea = screen.getByPlaceholderText(/Tell us what happened/i);
    fireEvent.change(descTextarea, { target: { value: 'Cold food delivered.' } });

    const submitBtn = screen.getByText('Submit Refund Ticket');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(axiosMock.post).toHaveBeenCalledWith(
        expect.stringContaining('/case/create'),
        expect.objectContaining({
          orderId: 'ORD-333',
          type: 'Refund Request',
          reason: 'Order Item Missing',
          description: expect.stringContaining('Cold food delivered.'),
        }),
        expect.any(Object)
      );
      expect(mockNavigate).toHaveBeenCalledWith('/support');
    });
  });

  it('handles empty state when no recent orders exist', () => {
    render(
      <MemoryRouter>
        <RaiseRefund />
      </MemoryRouter>
    );

    expect(screen.getByText('No recent orders available')).toBeInTheDocument();
  });
});
