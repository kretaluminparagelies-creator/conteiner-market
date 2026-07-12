/**
 * @file page.tsx
 * @description CRM leads preview
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { Suspense } from "react";
import { CrmLeadsPanel } from "@/components/crm/CrmLeadsPanel";
import { CrmLeadsTableSkeleton } from "@/components/crm/CrmLeadsTableSkeleton";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { countAllLeads, readLeadsPaginated } from "@/lib/crm/lead-store";
import { parsePageParam } from "@/lib/crm/pagination";
import type { LeadSource, LeadStatus } from "@/lib/crm/types";

type AdminLeadsPageProps = {
  searchParams: Promise<{ status?: string; source?: string; q?: string; page?: string }>;
};

const statuses: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];
const sources: LeadSource[] = ["contact", "buyback", "rent", "space", "listing"];

function parseLeadStatus(raw?: string): LeadStatus | "" {
  if (raw && statuses.includes(raw as LeadStatus)) return raw as LeadStatus;
  return "";
}

function parseLeadSource(raw?: string): LeadSource | "" {
  if (raw && sources.includes(raw as LeadSource)) return raw as LeadSource;
  return "";
}

export default async function AdminLeadsPage({ searchParams }: AdminLeadsPageProps) {
  const params = await searchParams;
  const [result, totalAll] = await Promise.all([
    readLeadsPaginated({
      page: parsePageParam(params.page),
      status: parseLeadStatus(params.status),
      source: parseLeadSource(params.source),
      query: params.q,
    }),
    countAllLeads(),
  ]);

  return (
    <CrmShellPage
      title="Αιτήματα"
      description="Επικοινωνίες, πωλήσεις, ενοικιάσεις — φίλτρα, αναζήτηση, export."
    >
      <Suspense fallback={<CrmLeadsTableSkeleton rows={8} />}>
        <CrmLeadsPanel result={result} totalAll={totalAll} />
      </Suspense>
    </CrmShellPage>
  );
}
