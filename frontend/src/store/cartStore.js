import { create } from 'zustand';

const useCartStore = create((set) => ({
  cartItems: [],

  // Action to set cart items (e.g., after fetching from the backend)
  setCartItems: (items) =>
    set((state) => ({
      cartItems: items,
    })),

  // Action to add a new item to the cart
  addCartItem: (newItem) =>
    set((state) => {
      const existingItem = state.cartItems.find(
        (item) => item.book._id === newItem.book._id
      );

      if (existingItem) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.book._id === newItem.book._id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          ),
        };
      }

      return {
        cartItems: [...state.cartItems, newItem],
      };
    }),

  // Action to update quantity of an item in the cart
  updateCartItem: (bookId, quantity) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.book._id === bookId ? { ...item, quantity } : item
      ),
    })),

  // Action to remove an item from the cart
  removeCartItem: (bookId) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.book._id !== bookId),
    })),

  // Action to clear all items from the cart
  clearCart: () =>
    set(() => ({
      cartItems: [],
    })),
}));

export default useCartStore;
