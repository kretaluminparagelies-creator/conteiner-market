/**
 * @file intake-options.ts
 * @description Common depot intake select options
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { containerTypes } from "@/lib/constants/container-types";

export const depotGradeOptions = [
  { value: "A", label: "A — χωρίς μπαλώματα" },
  { value: "B", label: "B — με μπαλώματα" },
  { value: "C", label: "C — λίγο χειρότερο" },
] as const;

export const depotTypeOptions = containerTypes.map((spec) => ({
  value: spec.id,
  label: `${spec.isoCode} — ${spec.name.el}`,
}));

export const depotDispatchOptions = [
  { value: "offer", label: "Προσφορά (πώληση / ενοικίαση)" },
  { value: "free_storage", label: "Δωρεάν προσωρινή αποθήκη" },
] as const;
