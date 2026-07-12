/**
 * @file page.tsx
 * @description CRM lead detail
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { CrmLeadListingSelect } from "@/components/crm/CrmLeadListingSelect";
import { CrmLeadNotesForm } from "@/components/crm/CrmLeadNotesForm";
import { CrmLeadStatusSelect } from "@/components/crm/CrmLeadStatusSelect";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { getCrmConnectionStatus } from "@/lib/crm/connection";
import { leadSourceLabels } from "@/lib/crm/lead-labels";
import { readLeadById, readLeadListingOptionBySlug } from "@/lib/crm/lead-store";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function AdminLeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const lead = await readLeadById(id);
  if (!lead) notFound();

  const initialOption = lead.listingSlug
    ? await readLeadListingOptionBySlug(lead.listingSlug)
    : null;

  const canEdit = getCrmConnectionStatus() === "connected";

  return (
    <CrmShellPage title={lead.name} description={`Αίτημα από ${leadSourceLabels[lead.source]}`}>
      <div className="max-w-2xl space-y-6">
        <section className="rounded-xl border border-cm-border bg-cm-card/50 p-6">
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between gap-4 border-b border-cm-border/50 pb-3">
              <dt className="text-cm-sub">Ημερομηνία</dt>
              <dd className="font-mono text-xs">{formatDate(lead.createdAt)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-cm-border/50 pb-3">
              <dt className="text-cm-sub">Email</dt>
              <dd>
                <a href={`mailto:${lead.email}`} className="text-cm-accent hover:underline">
                  {lead.email}
                </a>
              </dd>
            </div>
            {lead.phone ? (
              <div className="flex justify-between gap-4 border-b border-cm-border/50 pb-3">
                <dt className="text-cm-sub">Τηλέφωνο</dt>
                <dd>
                  <a href={`tel:${lead.phone}`} className="text-cm-accent hover:underline">
                    {lead.phone}
                  </a>
                </dd>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-4 border-b border-cm-border/50 pb-3">
              <dt className="text-cm-sub">Κατάσταση</dt>
              <dd>
                <CrmLeadStatusSelect leadId={lead.id} status={lead.status} />
              </dd>
            </div>
            {lead.listingSlug ? (
              <div className="flex justify-between gap-4 border-b border-cm-border/50 pb-3">
                <dt className="text-cm-sub">Listing (σύνδεση)</dt>
                <dd>
                  <Link
                    href={`/listings/${lead.listingSlug}`}
                    className="text-cm-accent hover:underline"
                    target="_blank"
                  >
                    {lead.listingSlug}
                  </Link>
                </dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="rounded-xl border border-cm-border bg-cm-card/50 p-6">
          <h2 className="font-display text-base font-semibold">Μήνυμα</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-cm-ink">
            {lead.message}
          </p>
        </section>

        <CrmLeadListingSelect
          leadId={lead.id}
          listingSlug={lead.listingSlug}
          initialOption={initialOption}
          canEdit={canEdit}
        />

        <CrmLeadNotesForm
          leadId={lead.id}
          initialNotes={lead.adminNotes ?? ""}
          canEdit={canEdit}
        />
      </div>
    </CrmShellPage>
  );
}
