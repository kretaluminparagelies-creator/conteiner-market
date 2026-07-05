/**
 * @file page.tsx
 * @description CRM — new listing form
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmListingForm } from "@/components/crm/CrmListingForm";
import { CrmShellPage } from "@/components/crm/CrmShellPage";

export default function AdminNewListingPage() {
  return (
    <CrmShellPage
      title="Νέα καταχώριση"
      description="Πρόσθεσε κοντέινερ στο catalog — αποθηκεύεται στο Supabase."
    >
      <CrmListingForm mode="create" />
    </CrmShellPage>
  );
}
