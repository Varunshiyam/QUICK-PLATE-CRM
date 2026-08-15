import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Global application store using Zustand.
 * Manages cart, user, theme, and UI state.
 */
const useAppStore = create(
  persist(
    (set, get) => ({
      // ─── Theme State ───
      theme: 'light',

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      // ─── User State ───
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      // ─── Cart State ───
      cart: [],
      cartRestaurantId: null,
      cartRestaurant: null,
      lastCartInteraction: null,

      addToCart: (item, restaurantPayload) => {
        const { cart, cartRestaurantId } = get();

        // Handle both string restaurant IDs and full restaurant objects
        const isObj =
          typeof restaurantPayload === 'object' &&
          restaurantPayload !== null;

        const restId = isObj
          ? restaurantPayload.name
          : restaurantPayload;

        // If adding from a different restaurant, clear the existing cart
        if (cartRestaurantId && cartRestaurantId !== restId) {
          set({
            cart: [{ ...item, quantity: 1 }],
            cartRestaurantId: restId,
            cartRestaurant: isObj ? restaurantPayload : null,
            lastCartInteraction: Date.now(),
          });

          return;
        }

        const existingIndex = cart.findIndex(
          (i) => i.id === item.id
        );

        // Item already exists in cart
        if (existingIndex >= 0) {
          const updated = [...cart];

          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + 1,
          };

          set({
            cart: updated,
            lastCartInteraction: Date.now(),
          });
        } else {
          // Add new item to cart
          set({
            cart: [...cart, { ...item, quantity: 1 }],
            cartRestaurantId: restId,
            ...(isObj && {
              cartRestaurant: restaurantPayload,
            }),
            lastCartInteraction: Date.now(),
          });
        }
      },

      updateCartInteraction: () =>
        set({
          lastCartInteraction: Date.now(),
        }),

      removeFromCart: (itemId) => {
        const { cart } = get();

        const existingIndex = cart.findIndex(
          (i) => i.id === itemId
        );

        if (existingIndex >= 0) {
          const updated = [...cart];

          // Reduce quantity if more than one exists
          if (updated[existingIndex].quantity > 1) {
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity - 1,
            };

            set({
              cart: updated,
              lastCartInteraction: Date.now(),
            });
          } else {
            // Remove item completely
            set({
              cart: cart.filter((i) => i.id !== itemId),
              lastCartInteraction: Date.now(),
            });
          }
        }
      },

      clearCart: () =>
        set({
          cart: [],
          cartRestaurantId: null,
          cartRestaurant: null,
          lastCartInteraction: null,
        }),

      // ─── Cart Calculations ───
      getCartTotal: () => {
        const { cart } = get();

        return cart.reduce((total, item) => {
          // Extract numerical value even if price contains "$"
          const priceVal =
            typeof item.price === 'string'
              ? parseFloat(
                  item.price.replace(/[^0-9.]/g, '')
                )
              : item.price;

          return total + priceVal * item.quantity;
        }, 0);
      },

      getCartItemCount: () => {
        const { cart } = get();

        return cart.reduce(
          (count, item) => count + item.quantity,
          0
        );
      },

      // ─── UI State ───
      isLoading: false,

      setLoading: (isLoading) =>
        set({
          isLoading,
        }),

      searchQuery: '',

      setSearchQuery: (searchQuery) =>
        set({
          searchQuery,
        }),
    }),

    // ─── Persist Configuration ───
    {
      name: 'quick-plate-storage',

      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,

        cart: state.cart,
        cartRestaurantId: state.cartRestaurantId,
        cartRestaurant: state.cartRestaurant,

        // Cart recovery / abandonment tracking
        lastCartInteraction: state.lastCartInteraction,

        // Theme persistence
        theme: state.theme,
      }),
    }
  )
);

export default useAppStore;