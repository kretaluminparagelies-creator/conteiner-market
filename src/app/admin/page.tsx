/**
 * @file page.tsx
 * @description CRM dashboard
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CrmLeadsTable } from "@/components/crm/CrmLeadsTable";
import { CrmShell } from "@/components/crm/CrmShell";
import { CrmStatCard } from "@/components/crm/CrmStatCard";
import { countLeadsByStatus, readLeads } from "@/lib/crm/lead-store";
import { readAdminListings } from "@/lib/repositories/listing-store";
import { resolveIsOffer } from "@/lib/utils/listing-carousel-filters";

export default async function AdminDashboardPage() {
  const listings = await readAdminListings();
  const leads = await readLeads();
  const activeListings = listings.filter((l) => l.active).length;
  const offerCount = listings.filter((l) => l.active && resolveIsOffer(l)).length;
  const rentCount = listings.filter((l) => l.active && l.listingType === "rent").length;

  return (
    <CrmShell
      title="Πίνακας ελέγχου"
      description="Επισκόπηση προσφορών και αιτημάτων — preview mode."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CrmStatCard label="Ενεργά στο site" value={activeListings} accent="orange" />
        <CrmStatCard label="Ειδικές προσφορές" value={offerCount} hint="Tab Προσφορές" accent="orange" />
        <CrmStatCard label="Προς ενοικίαση" value={rentCount} hint="Rent listings" accent="blue" />
        <CrmStatCard
          label="Νέα αιτήματα"
          value={await countLeadsByStatus("new")}
          hint="Demo δεδομένα"
          accent="neutral"
        />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-lg font-semibold">Πρόσφατα αιτήματα</h2>
        <CrmLeadsTable leads={leads.slice(0, 5)} />
      </section>
    </CrmShell>
  );
}
