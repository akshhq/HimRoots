import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../data/products';

export interface CartItem extends Product {
  quantity: number;
}

export interface AddedItemNotification {
  item: CartItem;
  addedQuantity: number;
  notificationId: string;
}

interface CartState {
  items: CartItem[];
  lastNotification: AddedItemNotification | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  clearNotification: () => void;
  getTotals: () => { subtotal: number; itemsCount: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastNotification: null,
      
      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === product.id);
        
        let updatedItems: CartItem[];
        let addedItemData: CartItem;

        if (existingItem) {
          const newQty = existingItem.quantity + quantity;
          addedItemData = { ...existingItem, quantity: newQty };
          updatedItems = items.map(item => 
            item.id === product.id 
              ? addedItemData
              : item
          );
        } else {
          addedItemData = { ...product, quantity };
          updatedItems = [...items, addedItemData];
        }

        set({
          items: updatedItems,
          lastNotification: {
            item: addedItemData,
            addedQuantity: quantity,
            notificationId: `${product.id}-${Date.now()}-${Math.random()}`
          }
        });
      },

      clearNotification: () => {
        set({ lastNotification: null });
      },
      
      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) });
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotals: () => {
        const { items } = get();
        const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const itemsCount = items.reduce((count, item) => count + item.quantity, 0);
        return { subtotal, itemsCount };
      }
    }),
    {
      name: 'himroots-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
