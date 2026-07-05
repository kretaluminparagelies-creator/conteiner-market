/**
 * @file archive-labels.ts
 * @description Greek labels for listing archive reasons (CRM history)
 */

import type { ArchiveReason } from "@/lib/types/listing";

export const archiveReasonLabels: Record<ArchiveReason, string> = {
  sold: "Πωλήθηκε",
  rented: "Ενοικιάστηκε",
  withdrawn: "Αποσύρθηκε",
};

export function formatArchiveReason(reason?: ArchiveReason): string {
  if (!reason) return "—";
  return archiveReasonLabels[reason];
}
