/**
 * @file representative-profile.ts
 * @description Aggregate representative stats for CRM card
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { DepotDispatch, DepotRepresentative } from "@/lib/depot/types";

export type DepotRepresentativeProfile = {
  representative: DepotRepresentative;
  dispatches: DepotDispatch[];
  totalDispatches: number;
  activeOutCount: number;
};

export function buildRepresentativeProfile(
  representative: DepotRepresentative,
  dispatches: DepotDispatch[],
): DepotRepresentativeProfile {
  const repDispatches = dispatches
    .filter((item) => item.representativeId === representative.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const activeOutCount = repDispatches.filter((item) => {
    const status = item.container?.status;
    return status === "with_rep_storage";
  }).length;

  return {
    representative,
    dispatches: repDispatches,
    totalDispatches: repDispatches.length,
    activeOutCount,
  };
}
