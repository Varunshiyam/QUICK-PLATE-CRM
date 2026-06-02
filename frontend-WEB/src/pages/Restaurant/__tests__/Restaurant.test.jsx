import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import useAppStore from '../../../store/useAppStore';

vi.mock('framer-motion', () => ({
  motion: {
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    div: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('../../../hooks/useHaptic', () => ({
  default: () => ({
    lightTap: vi.fn(),
    mediumTap: vi.fn(),
  }),
}));

const mockNavigate = vi.fn();
let mockLocationState = {
  restaurant: {
    name: 'Pizza Palace',
    rating: '4.9',
    time: '15-20 min',
    price: '$$',
    cuisine: 'pizza',
    img: 'pizza.png',
  },
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: mockLocationState }),
  };
});

vi.mock('../../../store/useAppStore', () => ({
  default: vi.fn(),
}));

import Restaurant from '../Restaurant';

describe('Restaurant Page Component Tests', () => {
  const mockAddToCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.mockReturnValue({
      addToCart: mockAddToCart,
      getCartItemCount: vi.fn().mockReturnValue(0),
      getCartTotal: vi.fn().mockReturnValue(0),
      cartRestaurantId: null,
      cartRestaurant: null,
    });
  });

  it('renders restaurant header info and menu categories', () => {
    render(
      <MemoryRouter>
        <Restaurant />
      </MemoryRouter>
    );

    expect(screen.getByText('Pizza Palace')).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('• 15-20 min • $$')).toBeInTheDocument();

    // Verify category tabs exist
    expect(screen.getAllByText('Starters')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Main Course')[0]).toBeInTheDocument();
  });

  it('triggers addToCart when ADD button is clicked', () => {
    render(
      <MemoryRouter>
        <Restaurant />
      </MemoryRouter>
    );

    // Pizza starters have Garlic Butter Knots
    expect(screen.getByText('Garlic Butter Knots')).toBeInTheDocument();

    const addButtons = screen.getAllByText(/ADD/);
    fireEvent.click(addButtons[0]);

    expect(mockAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Garlic Butter Knots' }),
      expect.objectContaining({ name: 'Pizza Palace' })
    );
  });

  it('shows floating cart when cart items exist for this restaurant', () => {
    useAppStore.mockReturnValue({
      addToCart: mockAddToCart,
      getCartItemCount: vi.fn().mockReturnValue(2),
      getCartTotal: vi.fn().mockReturnValue(23.00),
      cartRestaurantId: null,
      cartRestaurant: { name: 'Pizza Palace' },
    });

    render(
      <MemoryRouter>
        <Restaurant />
      </MemoryRouter>
    );

    expect(screen.getByText('2 Items')).toBeInTheDocument();
    expect(screen.getByText('• View Cart')).toBeInTheDocument();
    expect(screen.getByText('$23.00')).toBeInTheDocument();
  });
});
