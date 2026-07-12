/**
 * @file page.tsx
 * @description CRM active rental contracts
 */

import Link from "next/link";
import { Suspense } from "react";
import { CrmRentalsPanel } from "@/components/crm/CrmRentalsPanel";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { parsePageParam } from "@/lib/crm/pagination";
import {
  countAdminActiveRentals,
  readAdminRentalsPaginated,
  type AdminRentalsQuery,
} from "@/lib/repositories/listing-store";
import type { RentalContractStatus } from "@/lib/crm/rental-contract";
import type { RentalLocation } from "@/lib/types/listing";
import { countExpiredRentals, countExpiringOnlyRentals } from "@/lib/crm/expiring-rentals";

type AdminRentalsPageProps = {
  searchParams: Promise<{
    saved?: string;
    page?: string;
    status?: string;
    location?: string;
    q?: string;
  }>;
};

function parseRentalsQuery(
  params: Awaited<AdminRentalsPageProps["searchParams"]>,
): AdminRentalsQuery {
  const contractStatus = params.status as RentalContractStatus | "" | undefined;
  return {
    page: parsePageParam(params.page),
    contractStatus:
      contractStatus === "active" || contractStatus === "expiring" || contractStatus === "expired"
        ? contractStatus
        : "",
    rentalLocation: (params.location as RentalLocation | undefined) ?? "",
    query: params.q,
  };
}

export default async function AdminRentalsPage({ searchParams }: AdminRentalsPageProps) {
  const params = await searchParams;
  const query = parseRentalsQuery(params);
  const [result, totalAll, expiring, expired] = await Promise.all([
    readAdminRentalsPaginated(query),
    countAdminActiveRentals(),
    countExpiringOnlyRentals(),
    countExpiredRentals(),
  ]);

  return (
    <CrmShellPage
      title="Ενοικιασμένα"
      description="Ενεργές ενοικιάσεις — πελάτης, τοποθεσία, ημερομηνίες λήξης. Νέα ενοικίαση από depo: διάλεξε υπάρχον κοντέινερ."
    >
      {params.saved ? (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Η ενοικίαση «{params.saved}» καταχωρήθηκε. Εμφανίζεται εδώ μέχρι να επιστρέψει στο depo ή να
          αποσυρθεί.
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-cm-ink-sub">
          {totalAll} ενεργές ενοικιάσεις — δεν φαίνονται πλέον στο site
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/rentals/export"
            className="rounded-md border border-cm-border bg-white px-4 py-2 font-mono text-[11px] text-cm-ink-sub transition-colors hover:border-cm-accent/40 hover:text-cm-accent"
          >
            Export CSV
          </Link>
          <Link
            href="/admin/rentals/new"
            className="rounded-md bg-cm-accent px-4 py-2 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            + Νέα ενοικίαση
          </Link>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="rounded-xl border border-cm-border px-4 py-10 text-center text-sm text-cm-sub">
            Φόρτωση ενοικιάσεων…
          </div>
        }
      >
        <CrmRentalsPanel
          result={result}
          stats={{ total: totalAll, expiring, expired }}
        />
      </Suspense>
    </CrmShellPage>
  );
}
