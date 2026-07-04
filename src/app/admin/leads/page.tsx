/**
 * @file page.tsx
 * @description CRM leads preview
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmLeadsTable } from "@/components/crm/CrmLeadsTable";
import { CrmShell } from "@/components/crm/CrmShell";
import { readLeads } from "@/lib/crm/lead-store";

export default async function AdminLeadsPage() {
  const leads = await readLeads();

  return (
    <CrmShell
      title="Αιτήματα"
      description="Επικοινωνίες, πωλήσεις, ενοικιάσεις — από Supabase ή demo."
    >
      <CrmLeadsTable leads={leads} />
    </CrmShell>
  );
}
