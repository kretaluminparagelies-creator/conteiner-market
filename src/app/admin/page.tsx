/**
 * @file page.tsx
 * @description CRM dashboard
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { Suspense } from "react";
import { AdminRecentLeadsSection } from "@/components/crm/AdminRecentLeadsSection";
import { CrmExpiringRentalsSection } from "@/components/crm/CrmExpiringRentalsSection";
import { CrmLeadsTableSkeleton } from "@/components/crm/CrmLeadsTableSkeleton";
import { CrmQuickActions } from "@/components/crm/CrmQuickActions";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { CrmStatCard } from "@/components/crm/CrmStatCard";
import { readAdminDashboardCounts } from "@/lib/crm/admin-dashboard";
import { countExpiringRentals } from "@/lib/crm/expiring-rentals";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const [counts, expiringRentalsCount] = await Promise.all([
    readAdminDashboardCounts(),
    countExpiringRentals(),
  ]);

  return (
    <CrmShellPage title="Πίνακας ελέγχου" description="Επισκόπηση καταχωρίσεων και αιτημάτων.">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <CrmStatCard
            label="Ενεργά στο site"
            value={counts.activeListings}
            hint="Κλικ για λίστα"
            accent="orange"
            href="/admin/listings"
          />
          <CrmStatCard
            label="Ειδικές προσφορές"
            value={counts.offerCount}
            hint="Κλικ για λίστα"
            accent="orange"
            href="/admin/listings?filter=offers"
          />
          <CrmStatCard
            label="Προς ενοικίαση"
            value={counts.rentCount}
            hint="Κλικ για λίστα"
            accent="blue"
            href="/admin/listings?filter=rent"
          />
          <CrmStatCard
            label="Νέα αιτήματα"
            value={counts.newLeadsCount}
            hint="Κλικ για λίστα"
            accent="neutral"
            href="/admin/leads?status=new"
          />
          <CrmStatCard
            label="Λήγουν σύντομα"
            value={expiringRentalsCount}
            hint="Κλικ για λίστα"
            accent="amber"
            href="/admin/rentals"
          />
        </div>

        <CrmQuickActions />

        <Suspense
          fallback={
            <div className="rounded-xl border border-cm-border px-4 py-8 text-center text-sm text-cm-sub">
              Φόρτωση ληγμένων ενοικιάσεων…
            </div>
          }
        >
          <CrmExpiringRentalsSection page={page} />
        </Suspense>

        <Suspense fallback={<CrmLeadsTableSkeleton rows={5} />}>
          <AdminRecentLeadsSection />
        </Suspense>
      </div>
    </CrmShellPage>
  );
}
