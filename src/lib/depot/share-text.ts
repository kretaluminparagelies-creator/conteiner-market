/**
 * @file share-text.ts
 * @description WhatsApp/share message for depot dispatches
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { DepotContainer, DepotDispatchType, DepotRepresentative } from "@/lib/depot/types";

const gradeLabels = { A: "A (χωρίς μπαλώματα)", B: "B (με μπαλώματα)", C: "C" } as const;

const dispatchLabels: Record<DepotDispatchType, string> = {
  offer: "Προσφορά πώλησης/ενοικίασης",
  free_storage: "Προσωρινή δωρεάν αποθήκη",
};

export function buildDepotShareText(
  container: DepotContainer,
  representative: DepotRepresentative,
  dispatchType: DepotDispatchType,
): string {
  const lines = [
    "Container Market GR",
    dispatchLabels[dispatchType],
    `Αντιπρόσωπος: ${representative.name}`,
    `Αριθμός: ${container.containerNumber}`,
    `Τύπος: ${container.containerType}`,
    `Grade: ${gradeLabels[container.grade]}`,
  ];

  if (container.salePrice !== undefined) {
    lines.push(`Τιμή πώλησης: €${container.salePrice.toLocaleString("el-GR")}`);
  }

  if (container.rentPrice !== undefined) {
    lines.push(`Τιμή ενοικίασης: €${container.rentPrice.toLocaleString("el-GR")}/μήνα`);
  }

  if (container.notes?.trim()) {
    lines.push(`Σημειώσεις: ${container.notes.trim()}`);
  }

  if (container.images[0]) {
    lines.push(container.images[0]);
  }

  return lines.join("\n");
}

/** Short caption for depot mobile — photo sent separately, no URL */
export function buildDepotMobileShareText(container: DepotContainer, date: Date = new Date()): string {
  const dateLabel = date.toLocaleDateString("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const lines = [
    "Container Market GR",
    "",
    `📦 Κοντέινερ: ${container.containerNumber}`,
    `🔹 Τύπος: ${container.containerType}`,
    `⭐ Κατάσταση: Grade ${container.grade}`,
  ];

  if (container.salePrice !== undefined) {
    lines.push(`💰 Τιμή πώλησης: €${container.salePrice.toLocaleString("el-GR")}`);
  }

  if (container.rentPrice !== undefined) {
    lines.push(`💰 Ενοικίαση: €${container.rentPrice.toLocaleString("el-GR")}/μήνα`);
  }

  lines.push("", `📅 ${dateLabel}`, "📞 Container Market GR");

  return lines.join("\n");
}
