import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

vi.mock('axios');

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
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
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

// Hoist API base URL
vi.mock('react-hot-toast', () => {
  import.meta.env.VITE_API_BASE_URL = 'https://api.quickplate.com';
  return {
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

import Support from '../Support';
import axiosMock from 'axios';

describe('Support Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders loading state initially and then shows empty tickets placeholder', async () => {
    localStorage.setItem('quickplate_user', JSON.stringify({ customerId: 'CUST-111' }));
    axiosMock.get.mockResolvedValueOnce({
      data: { tickets: [] },
    });

    render(
      <MemoryRouter>
        <Support />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading tickets...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('No active tickets.')).toBeInTheDocument();
    });
  });

  it('renders list of active tickets from api and displays their status timeline', async () => {
    localStorage.setItem('quickplate_user', JSON.stringify({ customerId: 'CUST-111' }));
    axiosMock.get.mockResolvedValueOnce({
      data: {
        tickets: [
          {
            ticketId: 'CASE-12345',
            ticketNumber: '12345',
            issueType: 'Refund Request',
            ticketStatus: 'IN_PROGRESS',
            createdAt: 'Oct 25, 2:00 PM',
            description: 'Item missing from burger delivery',
          },
        ],
      },
    });

    render(
      <MemoryRouter>
        <Support />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Refund Request')).toBeInTheDocument();
      expect(screen.getByText('12345 • Oct 25, 2:00 PM')).toBeInTheDocument();
      // Should show current status in timeline
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    // Check notifications click toast
    const notifyBtn = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(notifyBtn);
    expect(toast.success).toHaveBeenCalledWith('You have 1 active tickets', expect.any(Object));
  });

  it('navigates to create pages on clicking quick actions', async () => {
    localStorage.setItem('quickplate_user', JSON.stringify({ customerId: 'CUST-111' }));
    axiosMock.get.mockResolvedValueOnce({ data: { tickets: [] } });

    render(
      <MemoryRouter>
        <Support />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No active tickets.')).toBeInTheDocument();
    });

    const refundBtn = screen.getByText('Raise Refund');
    fireEvent.click(refundBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/raise-refund');
  });
});
