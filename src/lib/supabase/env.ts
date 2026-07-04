/**
 * @file env.ts
 * @description Supabase environment helpers
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function getSupabaseAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

/** Public site reads — anon key + URL */
export function isSupabaseReadConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

/** CRM admin writes + inactive listings — service role */
export function isSupabaseAdminConfigured(): boolean {
  return isSupabaseReadConfigured() && Boolean(getSupabaseServiceRoleKey());
}
