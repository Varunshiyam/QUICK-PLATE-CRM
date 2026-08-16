import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Global application store using Zustand.
 * Manages cart, user, and UI state.
 */
const useAppStore = create(
  persist(
    (set, get) => ({
  // ─── User State ───
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),

  // ─── Cart State ───
  cart: [],
  cartRestaurantId: null,
  cartRestaurant: null,

  addToCart: (item, restaurantPayload) => {
    const { cart, cartRestaurantId } = get();
    // Handle both string fallback mapping and new full object payload models 
    const isObj = typeof restaurantPayload === 'object';
    const restId = isObj ? restaurantPayload.name : restaurantPayload;
    
    // If adding from a different restaurant, clear cart first
    if (cartRestaurantId && cartRestaurantId !== restId) {
      set({ 
        cart: [{ ...item, quantity: 1 }], 
        cartRestaurantId: restId,
        cartRestaurant: isObj ? restaurantPayload : null
      });
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
      set({ 
        cart: [...cart, { ...item, quantity: 1 }], 
        cartRestaurantId: restId,
        ...(isObj && { cartRestaurant: restaurantPayload })
      });
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

  clearCart: () => set({ cart: [], cartRestaurantId: null, cartRestaurant: null }),

  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => {
      // Ensure we extract the numerical value even if price comes formatted with $ 
      const priceVal = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price;
      return total + (priceVal * item.quantity);
    }, 0);
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
    }),
    {
      name: 'quick-plate-storage', // key in localStorage
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated, 
        cart: state.cart, 
        cartRestaurantId: state.cartRestaurantId,
        cartRestaurant: state.cartRestaurant
      }),
    }
  )
);

export default useAppStore;
