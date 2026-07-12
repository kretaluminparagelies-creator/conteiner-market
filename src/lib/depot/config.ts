/**
 * @file config.ts
 * @description Depot field app feature flag
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

/** Explicit opt-in — set NEXT_PUBLIC_DEPOT_ENABLED=true to expose /depot */
export function isDepotEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEPOT_ENABLED === "true";
}

export const depotLoginPath = "/admin/login";
export const depotHomePath = "/depot";
