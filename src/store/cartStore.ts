import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../data/products';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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
  syncWithCloud: (userId: string) => Promise<void>;
}

// Helper to push cart items to Supabase cloud cart
async function persistToCloud(items: CartItem[], explicitUserId?: string) {
  if (!supabase || !isSupabaseConfigured) return;
  let userId = explicitUserId;
  if (!userId) {
    try {
      const { data } = await supabase.auth.getSession();
      userId = data?.session?.user?.id;
    } catch {}
  }
  if (!userId) return;

  try {
    await (supabase as any)
      .from('user_carts')
      .upsert(
        {
          user_id: userId,
          items: items as any,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
  } catch (err) {
    console.warn('Failed to sync cart to cloud storage:', err);
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastNotification: null,

      addItem: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        let updatedItems: CartItem[];
        let addedItemData: CartItem;

        if (existingItem) {
          const newQty = existingItem.quantity + quantity;
          addedItemData = { ...existingItem, quantity: newQty };
          updatedItems = items.map((item) =>
            item.id === product.id ? addedItemData : item
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
            notificationId: `${product.id}-${Date.now()}-${Math.random()}`,
          },
        });

        // Sync to cloud if user is logged in
        persistToCloud(updatedItems);
      },

      clearNotification: () => {
        set({ lastNotification: null });
      },

      removeItem: (productId) => {
        const updatedItems = get().items.filter((item) => item.id !== productId);
        set({ items: updatedItems });
        persistToCloud(updatedItems);
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const updatedItems = get().items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
        persistToCloud(updatedItems);
      },

      clearCart: () => {
        set({ items: [] });
        persistToCloud([]);
      },

      getTotals: () => {
        const { items } = get();
        const subtotal = items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        const itemsCount = items.reduce(
          (count, item) => count + item.quantity,
          0
        );
        return { subtotal, itemsCount };
      },

      syncWithCloud: async (userId: string) => {
        if (!supabase || !isSupabaseConfigured || !userId) return;

        try {
          const { data, error } = await (supabase as any)
            .from('user_carts')
            .select('items')
            .eq('user_id', userId)
            .maybeSingle();

          if (!error && data && Array.isArray(data.items)) {
            const cloudItems = data.items as unknown as CartItem[];
            const localItems = get().items;

            // Merge local and cloud carts: keep highest quantity for shared products
            const mergedMap = new Map<string, CartItem>();

            for (const item of cloudItems) {
              mergedMap.set(item.id, { ...item });
            }

            for (const item of localItems) {
              if (mergedMap.has(item.id)) {
                const existing = mergedMap.get(item.id)!;
                mergedMap.set(item.id, {
                  ...existing,
                  quantity: Math.max(existing.quantity, item.quantity),
                });
              } else {
                mergedMap.set(item.id, { ...item });
              }
            }

            const mergedItems = Array.from(mergedMap.values());
            set({ items: mergedItems });

            // Persist merged state back to cloud
            await persistToCloud(mergedItems, userId);
          } else if (get().items.length > 0) {
            // No cloud cart yet, push existing local cart to cloud
            await persistToCloud(get().items, userId);
          }
        } catch (err) {
          console.warn('Error syncing cloud cart:', err);
        }
      },
    }),
    {
      name: 'himroots-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
