import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { ProfileRow } from '@/types/database.types';
import { useCartStore } from './cartStore';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: ProfileRow | null;
  isLoading: boolean;
  isInitialized: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName?: string, phone?: string) => Promise<{ error: string | null; needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<ProfileRow>) => Promise<{ error: string | null }>;
  fetchProfile: (userId: string) => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: string | null }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    if (!supabase || !isSupabaseConfigured) {
      set({ isLoading: false, isInitialized: true });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        set({ session, user: session.user });
        await get().fetchProfile(session.user.id);
        useCartStore.getState().syncWithCloud(session.user.id);
      } else {
        set({ session: null, user: null, profile: null });
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (newSession?.user) {
          set({ session: newSession, user: newSession.user });
          await get().fetchProfile(newSession.user.id);
          useCartStore.getState().syncWithCloud(newSession.user.id);
        } else {
          set({ session: null, user: null, profile: null });
        }
      });
    } catch (err) {
      console.error('Failed to initialize Supabase auth session:', err);
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  fetchProfile: async (userId: string) => {
    if (!supabase || !isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        set({ profile: data as unknown as ProfileRow });
      } else if (error && error.code === 'PGRST116') {
        // Profile row might not have been created yet by trigger; fallback create
        const currentUser = get().user;
        if (currentUser) {
          const newProfile = {
            id: userId,
            email: currentUser.email || '',
            full_name: currentUser.user_metadata?.full_name || '',
            phone: currentUser.user_metadata?.phone || '',
          };
          const { data: created } = await (supabase as any)
            .from('profiles')
            .upsert(newProfile)
            .select()
            .single();
          if (created) {
            set({ profile: created as unknown as ProfileRow });
          }
        }
      }
    } catch (err) {
      console.warn('Error fetching customer profile:', err);
    }
  },

  signIn: async (email, password) => {
    if (!supabase || !isSupabaseConfigured) {
      return { error: 'Authentication service is not configured.' };
    }

    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        set({ user: data.user, session: data.session });
        await get().fetchProfile(data.user.id);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'An unexpected error occurred during sign in.' };
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, password, fullName, phone) => {
    if (!supabase || !isSupabaseConfigured) {
      return { error: 'Authentication service is not configured.' };
    }

    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName?.trim() || '',
            phone: phone?.trim() || '',
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        set({ user: data.user, session: data.session });
        if (data.session) {
          await get().fetchProfile(data.user.id);
        }
      }

      // Check if user session was returned or if email confirmation is required
      const needsEmailConfirmation = !data.session;
      return { error: null, needsEmailConfirmation };
    } catch (err: any) {
      return { error: err.message || 'An unexpected error occurred during sign up.' };
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    set({ user: null, session: null, profile: null });
  },

  updateProfile: async (updates) => {
    if (!supabase || !isSupabaseConfigured) {
      return { error: 'Authentication service is not configured.' };
    }

    const { user, profile } = get();
    if (!user) return { error: 'Not authenticated' };

    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      if (data) {
        set({ profile: { ...(profile || {}), ...(data as any) } });
      }

      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Failed to update profile.' };
    }
  },

  resetPasswordForEmail: async (email) => {
    if (!supabase || !isSupabaseConfigured) {
      return { error: 'Authentication service is not configured.' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/account/reset-password`,
        }
      );
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Failed to send password reset email.' };
    }
  },
}));
