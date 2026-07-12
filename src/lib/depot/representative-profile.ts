/**
 * @file representative-profile.ts
 * @description Aggregate representative stats for CRM card
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { DepotDispatch, DepotRepresentative } from "@/lib/depot/types";
import type { PaginatedSlice } from "@/lib/crm/pagination";

export type DepotRepresentativeProfile = {
  representative: DepotRepresentative;
  dispatchSlice: PaginatedSlice<DepotDispatch>;
  totalDispatches: number;
  activeOutCount: number;
};
