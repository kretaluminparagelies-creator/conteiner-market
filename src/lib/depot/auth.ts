/**
 * @file auth.ts
 * @description Depot session guard — same Supabase login as CRM
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

export { requireCrmSession, isCrmAuthEnabled } from "@/lib/crm/auth";

export function isSafeDepotRedirect(path: string): boolean {
  return path === "/depot" || path.startsWith("/depot/");
}
