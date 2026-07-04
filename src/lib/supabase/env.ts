/**
 * @file env.ts
 * @description Supabase environment helpers
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

function trim(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function normalizeSupabaseUrl(raw: string | undefined): string | undefined {
  const value = trim(raw);
  if (!value) return undefined;

  const withProtocol =
    value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;

  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return undefined;
    return parsed.origin;
  } catch {
    return undefined;
  }
}

export function getSupabaseUrl(): string | undefined {
  return normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabaseAnonKey(): string | undefined {
  return trim(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return trim(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Public site reads — valid URL + anon key */
export function isSupabaseReadConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

/** CRM admin writes + inactive listings — service role */
export function isSupabaseAdminConfigured(): boolean {
  return isSupabaseReadConfigured() && Boolean(getSupabaseServiceRoleKey());
}
