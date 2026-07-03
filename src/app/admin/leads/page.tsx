/**
 * @file page.tsx
 * @description CRM leads preview
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmLeadsTable } from "@/components/crm/CrmLeadsTable";
import { CrmShell } from "@/components/crm/CrmShell";
import { getMockLeads } from "@/lib/crm/mock-leads";

export default function AdminLeadsPage() {
  const leads = getMockLeads();

  return (
    <CrmShell
      title="Αιτήματα"
      description="Επικοινωνίες, πωλήσεις, ενοικιάσεις — demo leads μέχρι τη σύνδεση."
    >
      <CrmLeadsTable leads={leads} />
    </CrmShell>
  );
}
