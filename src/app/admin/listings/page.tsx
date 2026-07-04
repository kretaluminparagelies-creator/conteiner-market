/**
 * @file page.tsx
 * @description CRM listings management
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Link from "next/link";
import { CrmListingsTable } from "@/components/crm/CrmListingsTable";
import { CrmShell } from "@/components/crm/CrmShell";
import { readAdminListings } from "@/lib/repositories/listing-store";

type AdminListingsPageProps = {
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminListingsPage({ searchParams }: AdminListingsPageProps) {
  const { saved } = await searchParams;
  const listings = await readAdminListings();

  return (
    <CrmShell
      title="Καταχωρίσεις"
      description="Διαχείριση κοντέινερ — νέα καταχώριση, επεξεργασία, ενεργές/ανενεργές."
    >
      {saved ? (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Αποθηκεύτηκε η καταχώριση «{saved}». Εμφανίζεται στο site μετά το cache refresh (~1
          λεπτό).
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-cm-sub">{listings.length} καταχωρίσεις στο catalog</p>
        <Link
          href="/admin/listings/new"
          className="rounded-md bg-cm-accent px-4 py-2 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          + Νέα καταχώριση
        </Link>
      </div>
      <CrmListingsTable listings={listings} />
    </CrmShell>
  );
}
