/**
 * @file page.tsx
 * @description Dispatch container to representative
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Link from "next/link";
import { DepotMobileDispatchForm } from "@/components/depot/DepotMobileDispatchForm";
import { loadDepotDispatchPageData } from "@/lib/depot/actions/depot-actions";

type DepotDispatchPageProps = {
  searchParams: Promise<{ container?: string }>;
};

export default async function DepotDispatchPage({ searchParams }: DepotDispatchPageProps) {
  const params = await searchParams;
  const { containers, representatives } = await loadDepotDispatchPageData();

  return (
    <div className="space-y-4">
      <Link
        href="/depot/offers"
        className="inline-flex rounded-xl border border-cm-light-border-strong bg-white px-3 py-2 font-display text-sm font-semibold text-cm-accent transition-colors hover:border-cm-accent/40 hover:bg-cm-accent/5"
      >
        Ιστορικό προσφορών →
      </Link>

      <DepotMobileDispatchForm
        containers={containers}
        representatives={representatives}
        initialContainerId={params.container}
      />
    </div>
  );
}
