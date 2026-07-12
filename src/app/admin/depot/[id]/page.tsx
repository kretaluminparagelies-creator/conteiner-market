/**
 * @file page.tsx
 * @description CRM depot container detail
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { notFound } from "next/navigation";
import { CrmDepotContainerDetailCard } from "@/components/crm/CrmDepotContainerDetailCard";
import { CrmShellPage } from "@/components/crm/CrmShellPage";
import { loadCrmDepotContainerDetail } from "@/lib/crm/actions/depot-actions";
import { containerTypeById } from "@/lib/constants/container-types";
import { isDepotEnabled } from "@/lib/depot/config";
import { depotStatusLabels } from "@/lib/depot/status";

type AdminDepotDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
};

export default async function AdminDepotDetailPage({
  params,
  searchParams,
}: AdminDepotDetailPageProps) {
  if (!isDepotEnabled()) notFound();

  const { id } = await params;
  const query = await searchParams;
  const detail = await loadCrmDepotContainerDetail(id);

  if (!detail) notFound();

  const typeLabel =
    containerTypeById[detail.container.containerType]?.name.el ??
    detail.container.containerType;

  return (
    <CrmShellPage
      title={detail.container.containerNumber}
      description={`${typeLabel} · Grade ${detail.container.grade} · ${depotStatusLabels[detail.container.status]}`}
    >
      <CrmDepotContainerDetailCard
        container={detail.container}
        dispatches={detail.dispatches}
        initialEdit={query.edit === "1"}
      />
    </CrmShellPage>
  );
}
