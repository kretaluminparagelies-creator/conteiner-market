/**
 * @file page.tsx
 * @description CRM active rental contracts
 */

import Link from "next/link";
import { CrmRentalsPanel } from "@/components/crm/CrmRentalsPanel";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { readAdminActiveRentals } from "@/lib/repositories/listing-store";

type AdminRentalsPageProps = {
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminRentalsPage({ searchParams }: AdminRentalsPageProps) {
  const { saved } = await searchParams;
  const rentals = await readAdminActiveRentals();

  return (
    <CrmShellPage
      title="Ενοικιασμένα"
      description="Ενεργές ενοικιάσεις — πελάτης, τοποθεσία, ημερομηνίες λήξης. Νέα ενοικίαση από depo: διάλεξε υπάρχον κοντέινερ."
    >
      {saved ? (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Η ενοικίαση «{saved}» καταχωρήθηκε. Εμφανίζεται εδώ μέχρι να επιστρέψει στο depo ή να
          αποσυρθεί.
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-cm-ink-sub">
          {rentals.length} ενεργές ενοικιάσεις — δεν φαίνονται πλέον στο site
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

      <CrmRentalsPanel rentals={rentals} />
    </CrmShellPage>
  );
}
