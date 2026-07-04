/**
 * @file page.tsx
 * @description CRM — new listing form
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmListingForm } from "@/components/crm/CrmListingForm";
import { CrmShell } from "@/components/crm/CrmShell";

export default function AdminNewListingPage() {
  return (
    <CrmShell
      title="Νέα καταχώριση"
      description="Πρόσθεσε κοντέινερ στο catalog — αποθηκεύεται στο Supabase."
    >
      <CrmListingForm mode="create" />
    </CrmShell>
  );
}
