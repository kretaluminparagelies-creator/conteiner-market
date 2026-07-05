/**
 * @file server-auth.ts
 * @description Supabase auth client for Server Components & actions
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { CRM_USER_EMAIL_HEADER } from "@/lib/supabase/crm-session-header";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseReadConfigured } from "@/lib/supabase/env";

export async function createSupabaseAuthServerClient() {
  if (!isSupabaseReadConfigured()) {
    throw new Error("Supabase auth is not configured");
  }

  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component — cookie writes happen in middleware/actions
        }
      },
    },
  });
}

/** Email from proxy header, or Supabase session if header missing (SSR-safe) */
export const getCrmSessionEmail = cache(async (): Promise<string | null> => {
  const headerStore = await headers();
  const fromHeader = headerStore.get(CRM_USER_EMAIL_HEADER);
  if (fromHeader) return fromHeader;

  if (!isSupabaseReadConfigured()) return null;

  const supabase = await createSupabaseAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.email ?? null;
});

export async function getCrmSessionUser() {
  if (!isSupabaseReadConfigured()) return null;

  const supabase = await createSupabaseAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
