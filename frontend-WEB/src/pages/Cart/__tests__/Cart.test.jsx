import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Define API base url before importing Cart
import.meta.env.VITE_API_BASE_URL = 'https://api.quickplate.com';

import Cart from '../Cart';
import useAppStore from '../../../store/useAppStore';
import axios from 'axios';
import { auth } from '../../../services/firebase';

vi.mock('axios');

vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('../../../services/firebase', () => ({
  auth: {
    currentUser: null,
  },
}));

vi.mock('../../../hooks/useHaptic', () => ({
  default: () => ({
    lightTap: vi.fn(),
    mediumTap: vi.fn(),
    heavyTap: vi.fn(),
  }),
}));

vi.mock('../../../data/mockMenus', () => ({
  getRestaurantMenu: () => ({
    menu: [
      {
        items: [
          { id: 'add1', title: 'Extra Cheese', price: '$2.00', img: '' },
          { id: 'add2', title: 'Coke', price: '$1.50', img: '' },
        ],
      },
    ],
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

describe('Cart Component Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.currentUser = null;
    useAppStore.setState({
      cart: [],
      cartRestaurant: { id: 'r1', name: 'Tasty Bistro' },
      cartRestaurantId: 'r1',
    });
  });

  it('renders empty cart message when cart is empty', () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('renders cart items and fetches wallet balance when user is logged in', async () => {
    auth.currentUser = {
      getIdToken: vi.fn().mockResolvedValue('token123'),
    };

    axios.get.mockResolvedValueOnce({
      data: {
        success: true,
        availableBalance: 25.50,
      },
    });

    useAppStore.setState({
      cart: [
        { id: 'p1', title: 'Truffle Burger', price: '$15.00', quantity: 2, desc: 'Delicious burger' }
      ],
    });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    expect(screen.getByText('Truffle Burger')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  it('triggers checkout order creation and navigates to checkout details page', async () => {
    auth.currentUser = {
      getIdToken: vi.fn().mockResolvedValue('token123'),
    };

    axios.get.mockResolvedValue({
      data: {
        success: true,
        availableBalance: 10.00,
      },
    });

    axios.post.mockResolvedValueOnce({
      data: {
        success: true,
        orderId: 'ORD-98765',
      },
    });

    useAppStore.setState({
      cart: [
        { id: 'p1', title: 'Truffle Burger', price: '$15.00', quantity: 1, desc: 'Delicious burger' }
      ],
    });

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Truffle Burger')).toBeInTheDocument();
    });

    const checkoutBtn = screen.getByRole('button', { name: /Proceed to Checkout/i });
    fireEvent.click(checkoutBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/checkout', expect.any(Object));
    });
  });
});
