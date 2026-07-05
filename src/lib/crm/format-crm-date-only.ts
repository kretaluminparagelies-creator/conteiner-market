/**
 * @file format-crm-date-only.ts
 * @description Date-only display for rental contracts (el-GR)
 */

export function formatCrmDateOnly(isoDate: string): string {
  if (!isoDate) return "—";
  const parsed = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}
