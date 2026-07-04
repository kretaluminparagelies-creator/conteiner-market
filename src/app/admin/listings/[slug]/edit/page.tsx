/**
 * @file page.tsx
 * @description CRM — edit listing form
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { notFound } from "next/navigation";
import { CrmListingForm } from "@/components/crm/CrmListingForm";
import { CrmShell } from "@/components/crm/CrmShell";
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
    <CrmShell title="Επεξεργασία καταχώρισης" description={listing.type}>
      <CrmListingForm mode="edit" slug={slug} initial={listingToFormInput(listing)} />
    </CrmShell>
  );
}
