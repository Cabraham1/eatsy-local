import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  cookId: string;
  cookName: string;
  quantity: number;
  specialInstructions?: string;
  tags?: string[];
}

interface CartStore {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateSpecialInstructions: (id: string, instructions: string) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            // Update quantity if item already exists
            const updatedItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );

            const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = updatedItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            return {
              items: updatedItems,
              totalItems,
              totalAmount,
            };
          } else {
            // Add new item
            const newItem = { ...item, quantity: 1 };
            const updatedItems = [...state.items, newItem];

            const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = updatedItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            return {
              items: updatedItems,
              totalItems,
              totalAmount,
            };
          }
        });
      },

      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id);
          const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalAmount = updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          return {
            items: updatedItems,
            totalItems,
            totalAmount,
          };
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            get().removeItem(id);
            return state;
          }

          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );

          const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalAmount = updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          return {
            items: updatedItems,
            totalItems,
            totalAmount,
          };
        });
      },

      updateSpecialInstructions: (id, instructions) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, specialInstructions: instructions } : item
          ),
        }));
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalAmount: 0,
        });
      },

      getItemQuantity: (id) => {
        const state = get();
        const item = state.items.find((item) => item.id === id);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: "eatsy-cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
