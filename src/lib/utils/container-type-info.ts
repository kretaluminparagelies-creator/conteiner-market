/**
 * @file container-type-info.ts
 * @description Format container catalog specs for customer-facing UI (EU units)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { ContainerTypeSpec } from "@/lib/constants/container-types";

export type ContainerTypeInfoLabels = {
  iso: string;
  internalDims: string;
  volume: string;
  tare: string;
  payload: string;
  notes: string;
};

export type ContainerTypeInfoRow = {
  label: string;
  value: string;
};

/** Prefer metric in parentheses, else use as-is (e.g. "13,6 m") */
function metricFromDimension(raw: string): string {
  const match = raw.match(/\(([^)]+)\)/);
  return match?.[1]?.trim() ?? raw.trim();
}

export function formatInternalDimensions(spec: ContainerTypeSpec): string | null {
  const internal = spec.dimensions?.internal;
  if (!internal) return null;
  return `${metricFromDimension(internal.length)} × ${metricFromDimension(internal.width)} × ${metricFromDimension(internal.height)}`;
}

export function buildContainerTypeInfoRows(
  spec: ContainerTypeSpec,
  labels: ContainerTypeInfoLabels,
  locale: "el" | "en",
): ContainerTypeInfoRow[] {
  const rows: ContainerTypeInfoRow[] = [{ label: labels.iso, value: spec.isoCode }];

  const internal = formatInternalDimensions(spec);
  if (internal) rows.push({ label: labels.internalDims, value: internal });

  if (spec.volume?.m3) {
    const m3 = spec.volume.m3.replace(".", locale === "el" ? "," : ".");
    rows.push({ label: labels.volume, value: `${m3} m³` });
  }

  if (spec.tareWeight?.kg) {
    rows.push({ label: labels.tare, value: `${spec.tareWeight.kg} kg` });
  }

  if (spec.payload?.kg) {
    rows.push({ label: labels.payload, value: `${spec.payload.kg} kg` });
  }

  const notes = spec.specialtyNotes
    ? locale === "en"
      ? spec.specialtyNotes.en
      : spec.specialtyNotes.el
    : null;
  if (notes) rows.push({ label: labels.notes, value: notes });

  return rows;
}
