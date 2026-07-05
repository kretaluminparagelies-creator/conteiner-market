/**
 * @file page.tsx
 * @description CRM — edit listing form
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { notFound } from "next/navigation";
import { CrmListingForm } from "@/components/crm/CrmListingForm";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { formatCrmDate } from "@/lib/crm/format-crm-date";
import { listingToFormInput } from "@/lib/crm/listing-form";
import { readAdminListingBySlug } from "@/lib/repositories/listing-store";

type EditListingPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminEditListingPage({ params }: EditListingPageProps) {
  const { slug } = await params;
  const listing = await readAdminListingBySlug(slug);

  if (!listing) notFound();

  return (
    <CrmShellPage title="Επεξεργασία καταχώρισης" description={listing.type}>
      {listing.createdAt ? (
        <p className="mb-6 font-mono text-xs text-cm-muted">
          Καταχώρηση: {formatCrmDate(listing.createdAt)}
          {listing.updatedAt && listing.updatedAt !== listing.createdAt
            ? ` · Τελευταία αλλαγή: ${formatCrmDate(listing.updatedAt)}`
            : null}
        </p>
      ) : null}
      <CrmListingForm mode="edit" slug={slug} initial={listingToFormInput(listing)} />
    </CrmShellPage>
  );
}
