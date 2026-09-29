import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { AddressRow, AddressInsert, AddressUpdate } from '@/types/database.types';

export const addressService = {
  async fetchUserAddresses(userId: string): Promise<AddressRow[]> {
    if (!supabase || !isSupabaseConfigured || !userId) return [];

    try {
      const { data, error } = await (supabase as any)
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching addresses from Supabase:', error);
        return [];
      }

      return (data || []) as unknown as AddressRow[];
    } catch (err) {
      console.error('Unexpected error fetching user addresses:', err);
      return [];
    }
  },

  async createUserAddress(address: AddressInsert): Promise<{ data: AddressRow | null; error: string | null }> {
    if (!supabase || !isSupabaseConfigured) {
      return { data: null, error: 'Database service is not configured' };
    }

    try {
      // If this is the user's first address, mark it as default automatically
      const existing = await this.fetchUserAddresses(address.user_id);
      const isFirst = existing.length === 0;

      const payload = {
        ...address,
        is_default: address.is_default !== undefined ? address.is_default : isFirst,
      };

      const { data, error } = await (supabase as any)
        .from('addresses')
        .insert(payload)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as unknown as AddressRow, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Failed to save address' };
    }
  },

  async updateUserAddress(
    addressId: string,
    updates: AddressUpdate
  ): Promise<{ data: AddressRow | null; error: string | null }> {
    if (!supabase || !isSupabaseConfigured) {
      return { data: null, error: 'Database service is not configured' };
    }

    try {
      const { data, error } = await (supabase as any)
        .from('addresses')
        .update(updates)
        .eq('id', addressId)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data as unknown as AddressRow, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Failed to update address' };
    }
  },

  async deleteUserAddress(addressId: string): Promise<{ success: boolean; error: string | null }> {
    if (!supabase || !isSupabaseConfigured) {
      return { success: false, error: 'Database service is not configured' };
    }

    try {
      const { error } = await (supabase as any)
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete address' };
    }
  },

  async setDefaultAddress(addressId: string, userId: string): Promise<{ success: boolean; error: string | null }> {
    if (!supabase || !isSupabaseConfigured) {
      return { success: false, error: 'Database service is not configured' };
    }

    try {
      // Unset previous defaults
      await (supabase as any)
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Set target address as default
      const { error } = await (supabase as any)
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to set default address' };
    }
  },
};
