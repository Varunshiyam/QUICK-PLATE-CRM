import { create } from 'zustand';

/**
 * Global application store using Zustand.
 * Manages cart, user, and UI state.
 */
const useAppStore = create((set, get) => ({
  // ─── User State ───
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),

  // ─── Cart State ───
  cart: [],
  cartRestaurantId: null,

  addToCart: (item, restaurantId) => {
    const { cart, cartRestaurantId } = get();

    // If adding from a different restaurant, clear cart first
    if (cartRestaurantId && cartRestaurantId !== restaurantId) {
      set({ cart: [{ ...item, quantity: 1 }], cartRestaurantId: restaurantId });
      return;
    }

    const existingIndex = cart.findIndex((i) => i.id === item.id);
    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
      };
      set({ cart: updated });
    } else {
      set({ cart: [...cart, { ...item, quantity: 1 }], cartRestaurantId: restaurantId });
    }
  },

  removeFromCart: (itemId) => {
    const { cart } = get();
    const existingIndex = cart.findIndex((i) => i.id === itemId);
    if (existingIndex >= 0) {
      const updated = [...cart];
      if (updated[existingIndex].quantity > 1) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity - 1,
        };
        set({ cart: updated });
      } else {
        set({ cart: cart.filter((i) => i.id !== itemId) });
      }
    }
  },

  clearCart: () => set({ cart: [], cartRestaurantId: null }),

  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getCartItemCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  // ─── UI State ───
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));

export default useAppStore;
