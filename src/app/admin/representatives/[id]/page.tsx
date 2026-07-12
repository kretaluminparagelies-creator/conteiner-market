/**
 * @file page.tsx
 * @description CRM representative detail card
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { notFound } from "next/navigation";
import { CrmRepresentativeDetailCard } from "@/components/crm/CrmRepresentativeDetailCard";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { loadCrmRepresentativeProfile } from "@/lib/crm/actions/representative-actions";
import { isDepotEnabled } from "@/lib/depot/config";

type RepresentativeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminRepresentativeDetailPage({
  params,
}: RepresentativeDetailPageProps) {
  if (!isDepotEnabled()) notFound();

  const { id } = await params;
  const profile = await loadCrmRepresentativeProfile(id);

  if (!profile) notFound();

  return (
    <CrmShellPage title={profile.representative.name} description="Καρτέλα αντιπροσώπου">
      <CrmRepresentativeDetailCard profile={profile} />
    </CrmShellPage>
  );
}
