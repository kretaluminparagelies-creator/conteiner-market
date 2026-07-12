/**
 * @file page.tsx
 * @description Dispatch container to representative
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { DepotMobileDispatchForm } from "@/components/depot/DepotMobileDispatchForm";
import { loadDepotDispatchPageData } from "@/lib/depot/actions/depot-actions";

type DepotDispatchPageProps = {
  searchParams: Promise<{ container?: string }>;
};

export default async function DepotDispatchPage({ searchParams }: DepotDispatchPageProps) {
  const params = await searchParams;
  const { containers, representatives } = await loadDepotDispatchPageData();

  return (
    <DepotMobileDispatchForm
      containers={containers}
      representatives={representatives}
      initialContainerId={params.container}
    />
  );
}
