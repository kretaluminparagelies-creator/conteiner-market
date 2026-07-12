/**
 * @file page.tsx
 * @description CRM listings management
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Link from "next/link";
import { CrmListingsFilterTabs } from "@/components/crm/CrmListingsFilterTabs";
import { CrmListingsTable } from "@/components/crm/CrmListingsTable";
import { CrmListPaginationBar } from "@/components/crm/CrmListPaginationBar";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { parsePageParam } from "@/lib/crm/pagination";
import {
  readAdminListingTabCounts,
  readAdminListingsPaginated,
} from "@/lib/repositories/listing-store";

type AdminListingsPageProps = {
  searchParams: Promise<{ saved?: string; filter?: string; page?: string }>;
};

const filterLabels: Record<"offers" | "rent", string> = {
  offers: "ειδικές προσφορές",
  rent: "προς ενοικίαση",
};

function parseListingsFilter(raw?: string): "offers" | "rent" | null {
  if (raw === "offers" || raw === "rent") return raw;
  return null;
}

export default async function AdminListingsPage({ searchParams }: AdminListingsPageProps) {
  const { saved, filter: filterParam, page: pageParam } = await searchParams;
  const filter = parseListingsFilter(filterParam);
  const page = parsePageParam(pageParam);
  const listingQuery =
    filter === "offers"
      ? { page, isOffer: true }
      : filter === "rent"
        ? { page, listingType: "rent" as const }
        : { page };

  const [result, filterCounts] = await Promise.all([
    readAdminListingsPaginated(listingQuery),
    readAdminListingTabCounts(),
  ]);

  const baseParams = new URLSearchParams();
  if (filter) baseParams.set("filter", filter);
  if (saved) baseParams.set("saved", saved);

  const countLabel = filter
    ? `${result.total} ${filterLabels[filter]}`
    : `${result.total} ενεργές καταχωρίσεις στο site`;

  return (
    <CrmShellPage
      title={filter === "offers" ? "Ειδικές προσφορές" : filter === "rent" ? "Προς ενοικίαση" : "Καταχωρίσεις"}
      description={
        filter === "offers"
          ? "Ενεργές καταχωρίσεις με ειδική προσφορά στο site."
          : filter === "rent"
            ? "Ενεργές καταχωρίσεις ενοικίασης στο site."
            : "Ενεργές καταχωρίσεις στο site — νέα, επεξεργασία, πώληση/ενοικίαση."
      }
    >
      {saved ? (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Αποθηκεύτηκε η καταχώριση «{saved}». Εμφανίζεται στο site μετά το cache refresh (~1
          λεπτό).
        </div>
      ) : null}

      <div className="mb-4">
        <CrmListingsFilterTabs active={filter} counts={filterCounts} />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-cm-sub">{countLabel}</p>
        <Link
          href="/admin/listings/new"
          className="rounded-md bg-cm-accent px-4 py-2 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          + Νέα καταχώριση
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-cm-border">
        <CrmListingsTable listings={result.items} rowOffset={result.rowOffset} />
        <CrmListPaginationBar
          slice={result}
          pathname="/admin/listings"
          searchParams={baseParams}
        />
      </div>
    </CrmShellPage>
  );
}
