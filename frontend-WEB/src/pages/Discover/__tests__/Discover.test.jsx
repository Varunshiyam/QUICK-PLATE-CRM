import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Discover from '../Discover';
import useAppStore from '../../../store/useAppStore';

vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
    section: React.forwardRef(({ children, ...props }, ref) => <section ref={ref} {...props}>{children}</section>),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('../../../services/firebase', () => ({
  getStoredUser: () => ({ address: '123 Discover Lane' }),
}));

vi.mock('../../../services/restaurantService', () => ({
  fetchRestaurants: vi.fn().mockResolvedValue([
    { id: '1', name: 'Sakura Omakase', city: 'Coimbatore', avgPrepTime: 30 },
    { id: '2', name: 'Smokehouse BBQ Co.', city: 'Coimbatore', avgPrepTime: 25 },
  ]),
}));

vi.mock('../../../hooks/useHaptic', () => ({
  default: () => ({
    lightTap: vi.fn(),
    mediumTap: vi.fn(),
  }),
}));

vi.mock('react-hot-toast', () => ({
  default: vi.fn(),
}));

describe('Discover Component Tests', () => {
  beforeEach(() => {
    useAppStore.setState({
      cart: [],
    });
  });

  it('renders categories, search button and address', async () => {
    render(
      <MemoryRouter>
        <Discover />
      </MemoryRouter>
    );

    expect(screen.getByText('123 Discover Lane')).toBeInTheDocument();
    expect(screen.getByText('Trending')).toBeInTheDocument();
    expect(screen.getByText('Healthy')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Sakura Omakase')).toBeInTheDocument();
    });
  });

  it('toggles search bar when clicking search icon button', async () => {
    render(
      <MemoryRouter>
        <Discover />
      </MemoryRouter>
    );

    const searchIconBtn = screen.getByText('search');
    fireEvent.click(searchIconBtn);

    const searchInput = screen.getByPlaceholderText('Search restaurants, dishes...');
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'Sakura' } });
    await waitFor(() => {
      expect(screen.getByText('Sakura Omakase')).toBeInTheDocument();
    });
  });
});
