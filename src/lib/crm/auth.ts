/**
 * @file auth.ts
 * @description CRM session guards for server actions
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { createSupabaseAuthServerClient } from "@/lib/supabase/server-auth";
import { isSupabaseReadConfigured } from "@/lib/supabase/env";

export async function requireCrmSession() {
  if (!isSupabaseReadConfigured()) {
    return null;
  }

  const supabase = await createSupabaseAuthServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export function isCrmAuthEnabled(): boolean {
  return isSupabaseReadConfigured();
}
