/**
 * @file connection.ts
 * @description CRM backend connection state
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { CrmConnectionStatus } from "@/lib/crm/types";
import { isSupabaseAdminConfigured, isSupabaseReadConfigured } from "@/lib/supabase/env";

export function getCrmConnectionStatus(): CrmConnectionStatus {
  if (isSupabaseReadConfigured()) {
    return "connected";
  }
  return "preview";
}

export function getCrmListingsSourceLabel(): string {
  if (isSupabaseAdminConfigured()) return "Supabase (read/write)";
  if (isSupabaseReadConfigured()) return "Supabase (read) + JSON fallback (write)";
  return "listings.json";
}

export function getCrmLeadsSourceLabel(): string {
  if (isSupabaseAdminConfigured()) return "Supabase";
  return "mock-leads.ts (demo)";
}

export function isCrmWriteEnabled(): boolean {
  return isSupabaseAdminConfigured();
}

export const crmPreviewNotice =
  "Preview mode — δεδομένα demo. Ρύθμισε Supabase env vars για live backend.";

export const crmServiceRoleNotice =
  "Προσθήκη SUPABASE_SERVICE_ROLE_KEY στο Vercel για CRM εγγραφές (create/update listings & leads).";
