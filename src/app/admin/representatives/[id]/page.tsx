/**
 * @file page.tsx
 * @description CRM representative detail card
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CrmRepresentativeDetailCard } from "@/components/crm/CrmRepresentativeDetailCard";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { loadCrmRepresentativeProfile } from "@/lib/crm/actions/representative-actions";
import { isDepotEnabled } from "@/lib/depot/config";
import {
  representativeDisplayLabel,
  representativeSearchSubtitle,
} from "@/lib/depot/filter-representatives";

type RepresentativeDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminRepresentativeDetailPage({
  params,
  searchParams,
}: RepresentativeDetailPageProps) {
  if (!isDepotEnabled()) notFound();

  const [{ id }, { page }] = await Promise.all([params, searchParams]);
  const profile = await loadCrmRepresentativeProfile(id, page);

  if (!profile) notFound();

  return (
    <CrmShellPage
      title={representativeDisplayLabel(profile.representative)}
      description={representativeSearchSubtitle(profile.representative) ?? "Καρτέλα αντιπροσώπου"}
    >
      <Suspense
        fallback={
          <div className="rounded-xl border border-cm-border px-4 py-10 text-center text-sm text-cm-sub">
            Φόρτωση καρτέλας…
          </div>
        }
      >
        <CrmRepresentativeDetailCard profile={profile} />
      </Suspense>
    </CrmShellPage>
  );
}
