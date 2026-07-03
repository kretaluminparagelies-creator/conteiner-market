/**
 * @file connection.ts
 * @description CRM backend connection state (preview until Supabase)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { CrmConnectionStatus } from "@/lib/crm/types";

export function getCrmConnectionStatus(): CrmConnectionStatus {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return "connected";
  }
  return "preview";
}

export const crmPreviewNotice =
  "Preview mode — δεδομένα demo. Η σύνδεση Supabase θα ενεργοποιηθεί χωρίς αλλαγή στο μενού.";
