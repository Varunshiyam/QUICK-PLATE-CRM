import { describe, it, expect, beforeEach } from 'vitest';
import useAppStore from '../useAppStore';

describe('useAppStore unit tests', () => {
  beforeEach(() => {
    useAppStore.setState({
      user: null,
      isAuthenticated: false,
      cart: [],
      cartRestaurantId: null,
      cartRestaurant: null,
      isLoading: false,
      searchQuery: ''
    });
  });

  it('should initialize with default states', () => {
    const state = useAppStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.cart).toEqual([]);
    expect(state.cartRestaurantId).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.searchQuery).toBe('');
  });

  it('should set user and update isAuthenticated state', () => {
    useAppStore.getState().setUser({ name: 'John Doe', email: 'john@example.com' });
    
    let state = useAppStore.getState();
    expect(state.user).toEqual({ name: 'John Doe', email: 'john@example.com' });
    expect(state.isAuthenticated).toBe(true);

    useAppStore.getState().logout();
    state = useAppStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should handle adding and removing items from the cart', () => {
    const item1 = { id: 'p1', name: 'Pizza', price: 299 };
    const restaurant = { id: 'r1', name: 'Pizzeria' };

    useAppStore.getState().addToCart(item1, restaurant);

    let state = useAppStore.getState();
    expect(state.cart).toEqual([{ ...item1, quantity: 1 }]);
    expect(state.cartRestaurantId).toBe('Pizzeria');

    // Add same item again to increase quantity
    useAppStore.getState().addToCart(item1, restaurant);
    state = useAppStore.getState();
    expect(state.cart[0].quantity).toBe(2);

    // Add item from a different restaurant
    const item2 = { id: 'b1', name: 'Burger', price: 150 };
    const newRestaurant = { id: 'r2', name: 'Burger Joint' };
    useAppStore.getState().addToCart(item2, newRestaurant);
    
    state = useAppStore.getState();
    expect(state.cart).toEqual([{ ...item2, quantity: 1 }]);
    expect(state.cartRestaurantId).toBe('Burger Joint');

    // Remove from cart
    useAppStore.getState().removeFromCart('b1');
    state = useAppStore.getState();
    expect(state.cart).toEqual([]);
  });

  it('should calculate cart total and item count correctly', () => {
    const item1 = { id: 'p1', name: 'Pizza', price: 299 };
    const item2 = { id: 'b1', name: 'Burger', price: '$150.00' };
    const restaurant = { id: 'r1', name: 'Pizzeria' };

    useAppStore.getState().addToCart(item1, restaurant);
    useAppStore.getState().addToCart(item2, restaurant);

    expect(useAppStore.getState().getCartItemCount()).toBe(2);
    expect(useAppStore.getState().getCartTotal()).toBe(449);

    useAppStore.getState().clearCart();
    expect(useAppStore.getState().getCartItemCount()).toBe(0);
    expect(useAppStore.getState().getCartTotal()).toBe(0);
  });

  it('should set loading and search query', () => {
    useAppStore.getState().setLoading(true);
    expect(useAppStore.getState().isLoading).toBe(true);

    useAppStore.getState().setSearchQuery('Pizza');
    expect(useAppStore.getState().searchQuery).toBe('Pizza');
  });
});
