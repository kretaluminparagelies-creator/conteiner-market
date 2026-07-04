/**
 * @file page.tsx
 * @description CRM dashboard
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { Suspense } from "react";
import { AdminRecentLeadsSection } from "@/components/crm/AdminRecentLeadsSection";
import { CrmLeadsTableSkeleton } from "@/components/crm/CrmLeadsTableSkeleton";
import { CrmShell } from "@/components/crm/CrmShell";
import { CrmStatCard } from "@/components/crm/CrmStatCard";
import { readAdminDashboardCounts } from "@/lib/crm/admin-dashboard";

export default async function AdminDashboardPage() {
  const counts = await readAdminDashboardCounts();

  return (
    <CrmShell title="Πίνακας ελέγχου" description="Επισκόπηση καταχωρίσεων και αιτημάτων.">
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

      <section className="mt-10">
        <h2 className="mb-4 font-display text-lg font-semibold">Πρόσφατα αιτήματα</h2>
        <Suspense fallback={<CrmLeadsTableSkeleton rows={5} />}>
          <AdminRecentLeadsSection />
        </Suspense>
      </section>
    </CrmShell>
  );
}
