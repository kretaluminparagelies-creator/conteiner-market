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
  buyback: "Πώληση κοντέινερ σε εμάς",
  rent: "Ενοικίαση",
  space: "Ενοικίαση χώρου",
  listing: "Προσφορά",
};

export const leadStatusStyles: Record<LeadStatus, string> = {
  new: "bg-orange-100 text-orange-800",
  contacted: "bg-sky-100 text-sky-800",
  quoted: "bg-amber-100 text-amber-900",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-slate-100 text-slate-700",
};
