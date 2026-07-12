/**
 * @file status.ts
 * @description Depot container status helpers
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { DepotContainerStatus, DepotDispatchType } from "@/lib/depot/types";

export const depotAvailableStatus: DepotContainerStatus = "available";

export const depotOutStatuses: DepotContainerStatus[] = [
  "with_rep_storage",
  "reserved",
  "sold",
  "rented",
  "withdrawn",
];

/** Only physical exit or closed deal removes a container from available stock. */
export function statusAfterDispatch(dispatchType: DepotDispatchType): DepotContainerStatus | null {
  if (dispatchType === "free_storage") return "with_rep_storage";
  return null;
}

export function isDepotAvailable(status: DepotContainerStatus): boolean {
  return status === depotAvailableStatus || status === "sent_offer";
}

export function isDepotOut(status: DepotContainerStatus): boolean {
  return depotOutStatuses.includes(status);
}

export const depotStatusLabels: Record<DepotContainerStatus, string> = {
  available: "Στο depo — διαθέσιμο",
  sent_offer: "Προσφορά — ακόμα στο depo",
  with_rep_storage: "Σε αντιπρόσωπο — δωρεάν αποθήκη",
  reserved: "Δεσμευμένο",
  sold: "Πωλήθηκε",
  rented: "Ενοικιάστηκε",
  withdrawn: "Αποσύρθηκε",
};
