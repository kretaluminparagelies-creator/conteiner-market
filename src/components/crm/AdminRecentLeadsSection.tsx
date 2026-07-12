/**
 * @file AdminRecentLeadsSection.tsx
 * @description Dashboard recent leads — streamed separately from stat cards
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmLeadsTable } from "@/components/crm/CrmLeadsTable";
import { readRecentLeads } from "@/lib/crm/lead-store";

export async function AdminRecentLeadsSection() {
  const leads = await readRecentLeads(5);

  return <CrmLeadsTable leads={leads} title="Πρόσφατα αιτήματα" />;
}
