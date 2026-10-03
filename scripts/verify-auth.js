/**
 * HimRoots Wellness — Supabase & Authentication Service Verification Script
 * Run with: node scripts/verify-auth.js
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n============================================================');
console.log('  HIMROOTS WELLNESS — AUTHENTICATION SERVICE DIAGNOSTICS');
console.log('============================================================\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const client = createClient(supabaseUrl, supabaseAnonKey);
const adminClient = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

async function runDiagnostics() {
  console.log('1. Connection & Keys:');
  console.log('   - Supabase URL:       ', supabaseUrl);
  console.log('   - Public Anon Key:    ', supabaseAnonKey ? `Present (${supabaseAnonKey.slice(0, 16)}...)` : 'Missing');
  console.log('   - Service Role Key:   ', supabaseServiceKey ? `Present (${supabaseServiceKey.slice(0, 16)}...)` : 'Missing');

  // Check Auth Settings endpoint
  console.log('\n2. Auth Service API Status:');
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: { apikey: supabaseAnonKey },
    });
    if (res.ok) {
      const settings = await res.json();
      console.log('   ✅ Supabase GoTrue Auth service is ONLINE.');
      console.log('   - Email Provider Enabled: ', settings.external?.email ? 'Yes' : 'No');
      console.log('   - Email Auto-Confirm:     ', settings.mailer_autoconfirm ? 'Enabled (instant login)' : 'Disabled (requires confirmation link)');
      console.log('   - Signups Disabled:       ', settings.disable_signup ? 'Yes (signups blocked!)' : 'No (signups open)');
    } else {
      console.warn(`   ⚠️ Auth settings returned HTTP ${res.status}: ${res.statusText}`);
    }
  } catch (err) {
    console.error('   ❌ Failed to reach Auth API:', err.message);
  }

  // Check Schema Tables
  console.log('\n3. Database Tables Inspection:');
  const tables = ['products', 'orders', 'order_items', 'profiles', 'addresses', 'user_carts'];
  const testClient = adminClient || client;

  for (const table of tables) {
    try {
      const { error } = await testClient.from(table).select('count').limit(1);
      if (!error) {
        console.log(`   ✅ public.${table.padEnd(15)} : Table exists and is accessible`);
      } else if (error.code === 'PGRST205') {
        console.log(`   ⚠️ public.${table.padEnd(15)} : Table NOT FOUND (Migration needed)`);
      } else if (error.code === '42501' || error.message?.includes('violates row-level security')) {
        console.log(`   ✅ public.${table.padEnd(15)} : Table exists (Protected by RLS)`);
      } else {
        console.log(`   ℹ️ public.${table.padEnd(15)} : ${error.message} (code: ${error.code})`);
      }
    } catch (err) {
      console.log(`   ❌ public.${table.padEnd(15)} : ${err.message}`);
    }
  }

  // Test End-to-End Registration & Auth Session
  console.log('\n4. End-to-End Auth Verification:');
  const testEmail = `diagnostic_${Date.now()}@gmail.com`;
  const testPassword = 'Password123!';

  try {
    const { data: signUpData, error: signUpError } = await client.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: { full_name: 'Diagnostic Test User', phone: '+919871520888' },
      },
    });

    if (signUpError) {
      console.error('   ❌ Auth signUp test failed:', signUpError.message);
    } else if (signUpData?.user) {
      console.log('   ✅ Client auth.signUp succeeded!');
      console.log('      User ID:', signUpData.user.id);
      console.log('      Session:', signUpData.session ? 'Active (Auto-confirmed)' : 'Pending email confirmation');

      // Admin verification & cleanup if service key is available
      if (adminClient) {
        const { data: userData, error: getUserError } = await adminClient.auth.admin.getUserById(signUpData.user.id);
        if (!getUserError && userData?.user) {
          console.log('   ✅ Admin Client verified user record in auth.users.');
        }

        const { error: deleteError } = await adminClient.auth.admin.deleteUser(signUpData.user.id);
        if (!deleteError) {
          console.log('   ✅ Temporary diagnostic user cleaned up cleanly.');
        }
      }
    }
  } catch (err) {
    console.error('   ❌ Auth diagnostic execution failed:', err.message);
  }

  console.log('\n============================================================');
  console.log('  DIAGNOSTICS COMPLETED');
  console.log('============================================================\n');
}

runDiagnostics().catch(console.error);
