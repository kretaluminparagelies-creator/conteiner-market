/**
 * @file page.tsx
 * @description CRM representatives list
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CrmRepresentativesPanel } from "@/components/crm/CrmRepresentativesPanel";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { loadCrmRepresentativesPaginated } from "@/lib/crm/actions/representative-actions";
import { isDepotEnabled } from "@/lib/depot/config";

type AdminRepresentativesPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AdminRepresentativesPage({
  searchParams,
}: AdminRepresentativesPageProps) {
  if (!isDepotEnabled()) notFound();

  const { page } = await searchParams;
  const result = await loadCrmRepresentativesPaginated(page);

  return (
    <CrmShellPage
      title="Αντιπρόσωποι"
      description="Πλήρης διαχείριση — καρτέλα, σημειώσεις, ιστορικό αποστολών."
    >
      <Suspense
        fallback={
          <div className="rounded-xl border border-cm-border px-4 py-10 text-center text-sm text-cm-sub">
            Φόρτωση αντιπροσώπων…
          </div>
        }
      >
        <CrmRepresentativesPanel result={result} />
      </Suspense>
    </CrmShellPage>
  );
}
