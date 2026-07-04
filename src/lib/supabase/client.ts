/**
 * @file client.ts
 * @description Supabase browser client (auth session in cookies via SSR)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseReadConfigured } from "@/lib/supabase/env";

export function createSupabaseBrowserClient() {
  if (!isSupabaseReadConfigured()) {
    throw new Error(
      "Supabase env λείπουν στο site. Έλεγξε NEXT_PUBLIC_SUPABASE_URL και NEXT_PUBLIC_SUPABASE_ANON_KEY στο Vercel.",
    );
  }

  return createBrowserClient(getSupabaseUrl()!, getSupabaseAnonKey()!);
}
