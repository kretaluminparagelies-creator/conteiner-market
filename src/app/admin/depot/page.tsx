/**
 * @file page.tsx
 * @description CRM depot inventory overview
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CrmDepotPanel } from "@/components/crm/CrmDepotPanel";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { loadCrmDepotPageData } from "@/lib/crm/actions/depot-actions";
import { isDepotEnabled } from "@/lib/depot/config";

type AdminDepotPageProps = {
  searchParams: Promise<{ tab?: string; page?: string }>;
};

export default async function AdminDepotPage({ searchParams }: AdminDepotPageProps) {
  if (!isDepotEnabled()) notFound();

  const params = await searchParams;
  const { tab, tabCounts, slice } = await loadCrmDepotPageData(params);

  return (
    <CrmShellPage
      title="Αποθήκη"
      description="Κλικ στη γραμμή για καρτέλα κοντέινερ."
    >
      <Suspense
        fallback={
          <div className="rounded-xl border border-cm-border px-4 py-10 text-center text-sm text-cm-sub">
            Φόρτωση αποθήκης…
          </div>
        }
      >
        <CrmDepotPanel tab={tab} tabCounts={tabCounts} slice={slice} />
      </Suspense>
    </CrmShellPage>
  );
}
