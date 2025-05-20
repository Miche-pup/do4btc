// src/lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Fetch environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Perform initial validation for URL and Anon Key as they are broadly used client and server side
if (!supabaseUrl) {
  throw new Error('CRITICAL: Missing environment variable: NEXT_PUBLIC_SUPABASE_URL. Check your .env.local file.');
}
if (!supabaseAnonKey) {
  throw new Error('CRITICAL: Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. Check your .env.local file.');
}

/**
 * Creates a Supabase client instance using the public anonymous key.
 * Suitable for client-side operations or server-side operations that only need public read access
 * and will respect Row Level Security (RLS) policies.
 */
export const getSupabaseAnonClient = (): SupabaseClient => {
  // supabaseUrl and supabaseAnonKey are already validated at the module level.
  return createClient(supabaseUrl!, supabaseAnonKey!);
};

/**
 * Creates a Supabase client instance for server-side operations requiring service_role privileges.
 * This client bypasses Row Level Security. Use with extreme caution and only on the server.
 * Throws an error if SUPABASE_SERVICE_ROLE_KEY is not set.
 */
export const getSupabaseServiceRoleClient = (): SupabaseClient => {
  if (!supabaseServiceRoleKey) {
    // This error is critical if this function is called.
    throw new Error('CRITICAL: Missing environment variable: SUPABASE_SERVICE_ROLE_KEY. Cannot create service role client. Check your .env.local file.');
  }
  // For server-side, especially API routes, we usually don't want client-side session persistence.
  return createClient(supabaseUrl!, supabaseServiceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Optional: A default client instance using the anon key for easy import in client components
// const supabase = getSupabaseAnonClient();
// export default supabase;
// For now, explicitly calling getSupabaseAnonClient() or getSupabaseServiceRoleClient() is clearer.