import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // ১. পার্সিস্ট মিডলওয়্যার ইমপোর্ট করা হলো

// আইডি চেক করার জন্য হেলপার (যা _id বা id যেকোনো একটি নিয়ে কাজ করবে)
const getId = (item) => item._id || item.id;

export const useCartStore = create(
  persist(
    (set) => ({
      isOpen: false,
      cart: [],
      
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addToCart: (product) =>
        set((state) => {
          const pId = getId(product);
          const existingItem = state.cart.find((item) => getId(item) === pId);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                getId(item) === pId ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),

      increaseQty: (id) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            getId(item) === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),

      decreaseQty: (id) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            getId(item) === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
          ),
        })),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => getId(item) !== id),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'megastore-cart-storage', // ২. এই নামে ব্রাউজারের localStorage-এ কার্টের ডাটা সেভ হয়ে থাকবে
    }
  )
);     