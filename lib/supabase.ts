/**
 * Supabase client configuration
 *
 * This file sets up the Supabase client for use throughout the application.
 * It uses environment variables for the Supabase URL and anonymous key.
 */

import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
// Use placeholder values during build time, real values at runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

/**
 * Supabase client instance
 * This can be used in both client and server components
 *
 * Note: During build time, placeholder values are used.
 * Make sure to set the correct environment variables before running the app.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // For MVP, we're not using Supabase auth
    // This prevents automatic session persistence
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Helper function to create a new Supabase client
 * Useful if you need a fresh client instance
 */
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export default supabase;
