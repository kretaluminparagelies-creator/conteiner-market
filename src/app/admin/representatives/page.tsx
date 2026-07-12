/**
 * @file page.tsx
 * @description CRM representatives list
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { notFound } from "next/navigation";
import { CrmRepresentativesPanel } from "@/components/crm/CrmRepresentativesPanel";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { loadCrmRepresentatives } from "@/lib/crm/actions/representative-actions";
import { isDepotEnabled } from "@/lib/depot/config";

export default async function AdminRepresentativesPage() {
  if (!isDepotEnabled()) notFound();

  const representatives = await loadCrmRepresentatives();

  return (
    <CrmShellPage
      title="Αντιπρόσωποι"
      description="Πλήρης διαχείριση — καρτέλα, σημειώσεις, ιστορικό αποστολών."
    >
      <CrmRepresentativesPanel representatives={representatives} />
    </CrmShellPage>
  );
}
