/**
 * @file page.tsx
 * @description CRM — register walk-in rental (depot customer picks container)
 */

import { CrmNewRentalForm } from "@/components/crm/CrmNewRentalForm";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { readAdminAvailableRentListings } from "@/lib/repositories/listing-store";

export default async function AdminNewRentalPage() {
  const available = await readAdminAvailableRentListings();

  return (
    <CrmShellPage
      title="Νέα ενοικίαση"
      description="Πελάτης στο depo — διάλεξε κοντέινερ από τα διαθέσιμα και συμπλήρωσε στοιχεία σύμβασης."
    >
      <CrmNewRentalForm available={available} />
    </CrmShellPage>
  );
}
