/**
 * @file page.tsx
 * @description CRM leads preview
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmLeadsPanel } from "@/components/crm/CrmLeadsPanel";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { readLeads } from "@/lib/crm/lead-store";

type AdminLeadsPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminLeadsPage({ searchParams }: AdminLeadsPageProps) {
  const { status } = await searchParams;
  const leads = await readLeads();

  return (
    <CrmShellPage
      title="Αιτήματα"
      description="Επικοινωνίες, πωλήσεις, ενοικιάσεις — φίλτρα, αναζήτηση, export."
    >
      <CrmLeadsPanel leads={leads} initialStatus={status} />
    </CrmShellPage>
  );
}
