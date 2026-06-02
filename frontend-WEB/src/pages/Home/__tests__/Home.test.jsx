import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home';
import useAppStore from '../../../store/useAppStore';

vi.mock('framer-motion', () => ({
  motion: {
    span: React.forwardRef(({ children, ...props }, ref) => <span ref={ref} {...props}>{children}</span>),
    div: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
    section: React.forwardRef(({ children, ...props }, ref) => <section ref={ref} {...props}>{children}</section>),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('../../../services/firebase', () => ({
  logoutUser: vi.fn(),
  getStoredUser: () => ({ address: '123 Test St' }),
}));

vi.mock('../../../services/restaurantService', () => ({
  fetchRestaurants: vi.fn().mockResolvedValue([
    { id: '1', name: 'Tasty Bites', city: 'Bangalore', avgPrepTime: 25 },
    { id: '2', name: 'Morning Bliss Bakery', city: 'Mumbai', avgPrepTime: 15 },
  ]),
}));

vi.mock('../../../hooks/useHaptic', () => ({
  default: () => ({
    lightTap: vi.fn(),
    mediumTap: vi.fn(),
  }),
}));

describe('Home Component Tests', () => {
  beforeEach(() => {
    useAppStore.setState({
      user: { displayName: 'John Doe' },
      isAuthenticated: true,
      cart: [],
    });
  });

  it('renders loading state initially and then loads restaurants', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading Restaurants...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Tasty Bites')).toBeInTheDocument();
      expect(screen.getByText('Morning Bliss Bakery')).toBeInTheDocument();
    });
  });

  it('filters restaurants based on category', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Tasty Bites')).toBeInTheDocument();
    });

    const bakeryCategory = screen.getByText('Bakery');
    fireEvent.click(bakeryCategory);

    expect(screen.getByText('Morning Bliss Bakery')).toBeInTheDocument();
    expect(screen.queryByText('Tasty Bites')).not.toBeInTheDocument();
  });
});
