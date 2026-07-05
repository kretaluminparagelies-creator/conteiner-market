/**
 * @file page.tsx
 * @description CRM archived listings (sold / rented / withdrawn)
 */

import { CrmHistoryPanel } from "@/components/crm/CrmHistoryPanel";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { readAdminHistoryListings } from "@/lib/repositories/listing-store";

type AdminHistoryPageProps = {
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminHistoryPage({ searchParams }: AdminHistoryPageProps) {
  const { saved } = await searchParams;
  const listings = await readAdminHistoryListings();

  return (
    <CrmShellPage
      title="Ιστορικό"
      description="Πωλημένα, ενοικιασμένα και αποσυρμένα κοντέινερ — με φίλτρα αναζήτησης."
    >
      {saved ? (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Η καταχώριση «{saved}» μεταφέρθηκε στο ιστορικό και δεν εμφανίζεται πλέον στο site.
        </div>
      ) : null}

      <CrmHistoryPanel listings={listings} />
    </CrmShellPage>
  );
}
