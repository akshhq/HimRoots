import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { OrderRow, OrderItemRow } from '@/types/database.types';

export interface UserOrderWithItems extends OrderRow {
  order_items: OrderItemRow[];
}

export const userOrderService = {
  /**
   * Fetches customer order history from Supabase using Row Level Security.
   * Authenticated user automatically receives orders where user_id = auth.uid()
   * or email matches their authenticated token.
   */
  async fetchUserOrders(userId: string, email?: string): Promise<UserOrderWithItems[]> {
    if (!supabase || !isSupabaseConfigured || (!userId && !email)) {
      return [];
    }

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.or(`user_id.eq.${userId},email.eq.${email || ''}`);
      } else if (email) {
        query = query.eq('email', email.trim().toLowerCase());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching user orders from Supabase:', error);
        return [];
      }

      return (data || []) as unknown as UserOrderWithItems[];
    } catch (err) {
      console.error('Unexpected error fetching user orders:', err);
      return [];
    }
  },

  /**
   * Fetches a single user order by UUID or order_number with full line items
   */
  async fetchOrderDetails(orderIdentifier: string): Promise<UserOrderWithItems | null> {
    if (!supabase || !isSupabaseConfigured || !orderIdentifier) {
      return null;
    }

    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderIdentifier);

      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `);

      if (isUuid) {
        query = query.eq('id', orderIdentifier);
      } else {
        query = query.eq('order_number', orderIdentifier);
      }

      const { data, error } = await query.maybeSingle();

      if (error || !data) {
        return null;
      }

      return data as unknown as UserOrderWithItems;
    } catch (err) {
      console.error('Error fetching specific order details:', err);
      return null;
    }
  },
};
