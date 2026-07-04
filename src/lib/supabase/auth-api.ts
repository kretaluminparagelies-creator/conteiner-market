/**
 * @file auth-api.ts
 * @description Stateless Supabase Auth API (server-side, no browser fetch)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseReadConfigured } from "@/lib/supabase/env";

export function createSupabaseAuthApiClient() {
  if (!isSupabaseReadConfigured()) {
    throw new Error("Supabase auth is not configured");
  }

  return createClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
