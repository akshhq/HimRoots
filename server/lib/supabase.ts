import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config, isSupabaseAdminConfigured } from '../config/env';
import type { Database } from '../../src/types/database.types';

export let supabaseAdmin: SupabaseClient<Database> | null = null;

if (isSupabaseAdminConfigured) {
  try {
    supabaseAdmin = createClient<Database>(
      config.supabase.url,
      config.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    console.log('✅ Supabase Admin Client initialized successfully (Service Role)');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase Admin Client:', error);
    supabaseAdmin = null;
  }
} else {
  console.warn(
    '⚠️ Supabase Admin credentials not configured in .env. Server will operate with local product catalog fallback.'
  );
}
