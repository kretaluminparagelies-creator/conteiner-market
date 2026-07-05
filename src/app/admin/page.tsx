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

export default async function AdminDashboardPage() {
  const [counts, expiringRentalsCount] = await Promise.all([
    readAdminDashboardCounts(),
    countExpiringRentals(),
  ]);

  return (
    <CrmShellPage title="Πίνακας ελέγχου" description="Επισκόπηση καταχωρίσεων και αιτημάτων.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CrmStatCard label="Ενεργά στο site" value={counts.activeListings} accent="orange" />
        <CrmStatCard
          label="Ειδικές προσφορές"
          value={counts.offerCount}
          hint="Tab Προσφορές"
          accent="orange"
        />
        <CrmStatCard
          label="Προς ενοικίαση"
          value={counts.rentCount}
          hint="Rent listings"
          accent="blue"
        />
        <CrmStatCard
          label="Νέα αιτήματα"
          value={counts.newLeadsCount}
          hint="Από φόρμα επικοινωνίας"
          accent="neutral"
        />
      </div>

      <CrmQuickActions
        newLeadsCount={counts.newLeadsCount}
        expiringRentalsCount={expiringRentalsCount}
      />

      <CrmExpiringRentalsSection />

      <section className="mt-10">
        <h2 className="mb-4 font-display text-lg font-semibold text-cm-ink">Πρόσφατα αιτήματα</h2>
        <Suspense fallback={<CrmLeadsTableSkeleton rows={5} />}>
          <AdminRecentLeadsSection />
        </Suspense>
      </section>
    </CrmShellPage>
  );
}
