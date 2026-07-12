/**
 * @file page.tsx
 * @description CRM archived listings (sold / rented / withdrawn)
 */

import { Suspense } from "react";
import { CrmHistoryPanel } from "@/components/crm/CrmHistoryPanel";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { parsePageParam } from "@/lib/crm/pagination";
import {
  readAdminHistoryPaginated,
  countAdminHistoryListings,
  type AdminHistoryQuery,
} from "@/lib/repositories/listing-store";
import type { ArchiveReason, ListingType, RentalLocation, StockCondition } from "@/lib/types/listing";

type AdminHistoryPageProps = {
  searchParams: Promise<{
    saved?: string;
    page?: string;
    type?: string;
    deal?: string;
    stock?: string;
    reason?: string;
    location?: string;
    offer?: string;
    cn?: string;
  }>;
};

function parseHistoryQuery(params: Awaited<AdminHistoryPageProps["searchParams"]>): AdminHistoryQuery {
  return {
    page: parsePageParam(params.page),
    type: params.type,
    listingType: (params.deal as ListingType | undefined) ?? "",
    stockCondition: (params.stock as StockCondition | undefined) ?? "",
    archiveReason: (params.reason as ArchiveReason | undefined) ?? "",
    rentalLocation: (params.location as RentalLocation | undefined) ?? "",
    isOffer: params.offer === "yes" || params.offer === "no" ? params.offer : "",
    containerNumber: params.cn,
  };
}

export default async function AdminHistoryPage({ searchParams }: AdminHistoryPageProps) {
  const params = await searchParams;
  const query = parseHistoryQuery(params);
  const [result, totalAll] = await Promise.all([
    readAdminHistoryPaginated(query),
    countAdminHistoryListings(),
  ]);

  return (
    <CrmShellPage
      title="Ιστορικό"
      description="Πωλημένα, ενοικιασμένα και αποσυρμένα κοντέινερ — με φίλτρα αναζήτησης."
    >
      {params.saved ? (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Η καταχώριση «{params.saved}» μεταφέρθηκε στο ιστορικό και δεν εμφανίζεται πλέον στο site.
        </div>
      ) : null}

      <Suspense
        fallback={
          <div className="rounded-xl border border-cm-border px-4 py-10 text-center text-sm text-cm-sub">
            Φόρτωση ιστορικού…
          </div>
        }
      >
        <CrmHistoryPanel result={result} totalAll={totalAll} />
      </Suspense>
    </CrmShellPage>
  );
}
