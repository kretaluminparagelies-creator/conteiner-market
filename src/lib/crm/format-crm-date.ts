/**
 * @file format-crm-date.ts
 * @description Greek locale date/time for CRM tables
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export function formatCrmDate(iso: string): string {
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
