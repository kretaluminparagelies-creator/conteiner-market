/**
 * @file page.tsx
 * @description CRM — new listing form
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmListingForm } from "@/components/crm/CrmListingForm";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { loadListingDraftFromDepotContainer } from "@/lib/crm/actions/depot-actions";

type AdminNewListingPageProps = {
  searchParams: Promise<{
    fromDepot?: string;
    active?: string;
    isOffer?: string;
    listingType?: string;
  }>;
};

function parsePublishFlag(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return value === "1" || value === "true";
}

export default async function AdminNewListingPage({ searchParams }: AdminNewListingPageProps) {
  const params = await searchParams;
  const fromDepotId = params.fromDepot?.trim();
  const listingType =
    params.listingType === "rent" || params.listingType === "sale"
      ? params.listingType
      : undefined;
  const depotDraft = fromDepotId
    ? await loadListingDraftFromDepotContainer(fromDepotId, {
        active: parsePublishFlag(params.active, true),
        isOffer: parsePublishFlag(params.isOffer, false),
        listingType,
      })
    : null;

  return (
    <CrmShellPage
      title="Νέα καταχώριση"
      description={
        depotDraft
          ? "Προσχέδιο από αποθήκη — έλεγξε τιμή και περιγραφή πριν αποθηκεύσεις."
          : "Πρόσθεσε κοντέινερ στο catalog — αποθηκεύεται στο Supabase."
      }
    >
      <CrmListingForm mode="create" initial={depotDraft ?? undefined} />
    </CrmShellPage>
  );
}
