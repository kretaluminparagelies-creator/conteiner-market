/**
 * @file filter-representatives.ts
 * @description Search depot representatives (mobile picker)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { DepotRepresentative } from "@/lib/depot/types";

export function filterRepresentatives(
  representatives: DepotRepresentative[],
  query?: string,
): DepotRepresentative[] {
  const needle = query?.trim().toLowerCase();
  if (!needle) return representatives;

  return representatives.filter((item) => {
    const haystack = [
      item.companyName,
      item.name,
      item.phone,
      item.email,
      item.city,
      item.afm,
      item.doy,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  });
}

export function representativeDisplayLabel(item: DepotRepresentative): string {
  const companyName = item.companyName?.trim() || item.name?.trim() || "—";
  const name = item.name?.trim() || companyName;

  if (companyName.toLowerCase() === name.toLowerCase()) {
    return companyName;
  }
  return `${companyName} — ${name}`;
}

export function representativeSearchSubtitle(item: DepotRepresentative): string | undefined {
  const parts = [item.city, item.phone, item.afm ? `ΑΦΜ ${item.afm}` : undefined].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : undefined;
}
