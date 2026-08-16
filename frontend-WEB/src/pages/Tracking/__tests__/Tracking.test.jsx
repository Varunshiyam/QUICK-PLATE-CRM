import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');

vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('../../../hooks/useHaptic', () => ({
  default: () => ({
    lightTap: vi.fn(),
    heavyTap: vi.fn(),
  }),
}));

const mockNavigate = vi.fn();
let mockParams = { orderId: 'ORD-88241' };
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

// Hoist API base URL
vi.mock('../../../hooks/useHaptic', () => {
  import.meta.env.VITE_API_BASE_URL = 'https://api.quickplate.com';
  return {
    default: () => ({
      lightTap: vi.fn(),
      heavyTap: vi.fn(),
    }),
  };
});

import Tracking from '../Tracking';
import axiosMock from 'axios';

describe('Tracking Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders loading initially and then shows order info and agent name from API', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: {
        orderId: 'ORD-88241',
        orderStatus: 'ASSIGNED',
        agent: {
          name: 'Dave R.',
          rating: '4.8',
          vehicle: 'Toyota Prius',
        },
      },
    });

    render(
      <MemoryRouter>
        <Tracking />
      </MemoryRouter>
    );

    // Verify it loads agent details
    await waitFor(() => {
      expect(screen.getByText('Order #ORD-88241')).toBeInTheDocument();
      expect(screen.getByText('Dave R.')).toBeInTheDocument();
      expect(screen.getByText('Toyota Prius • N/A deliveries')).toBeInTheDocument();
    });
  });

  it('renders fallback assigning agent UI when agent is null', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: {
        orderId: 'ORD-88241',
        orderStatus: 'CONFIRMED',
        agent: null,
      },
    });

    render(
      <MemoryRouter>
        <Tracking />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Assigning Agent...')).toBeInTheDocument();
      expect(screen.getByText('Finding the best driver for you')).toBeInTheDocument();
    });
  });

  it('navigates back when back button is clicked', async () => {
    axiosMock.get.mockResolvedValueOnce({
      data: {
        orderId: 'ORD-88241',
        orderStatus: 'DELIVERED',
        agent: null,
      },
    });

    render(
      <MemoryRouter>
        <Tracking />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Order #ORD-88241')).toBeInTheDocument();
    });

    const backBtn = screen.getAllByRole('button')[0];
    fireEvent.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
