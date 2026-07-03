/**
 * @file lead-labels.ts
 * @description Greek labels for lead status & source
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { LeadSource, LeadStatus } from "@/lib/crm/types";

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Νέο",
  contacted: "Επικοινωνία",
  quoted: "Προσφορά",
  won: "Κλειστό",
  lost: "Χαμένο",
};

export const leadSourceLabels: Record<LeadSource, string> = {
  contact: "Επικοινωνία",
  buyback: "Πώληση σε εμάς",
  rent: "Ενοικίαση",
  space: "Ενοικίαση χώρου",
  listing: "Προσφορά",
};

export const leadStatusStyles: Record<LeadStatus, string> = {
  new: "bg-cm-accent/20 text-cm-accent",
  contacted: "bg-cm-rent/20 text-cm-rent",
  quoted: "bg-amber-500/20 text-amber-200",
  won: "bg-emerald-500/20 text-emerald-300",
  lost: "bg-cm-muted/30 text-cm-sub",
};
