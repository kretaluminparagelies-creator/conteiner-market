/**
 * @file public-reads.ts
 * @description Whether public listing reads should use Supabase
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { isSupabaseReadConfigured } from "@/lib/supabase/env";

export function shouldReadListingsFromSupabase(): boolean {
  return isSupabaseReadConfigured();
}
