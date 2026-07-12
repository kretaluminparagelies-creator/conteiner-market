/**
 * @file config.ts
 * @description Depot field app feature flag
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

/** Explicit opt-in — set DEPOT_ENABLED or NEXT_PUBLIC_DEPOT_ENABLED=true to expose /depot */
export function isDepotEnabled(): boolean {
  const raw =
    process.env.DEPOT_ENABLED ??
    process.env.NEXT_PUBLIC_DEPOT_ENABLED ??
    "";
  return raw.trim().toLowerCase() === "true";
}

export const depotLoginPath = "/admin/login";
export const depotHomePath = "/depot";
