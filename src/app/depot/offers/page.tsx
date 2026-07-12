/**
 * @file page.tsx
 * @description Depot offer dispatch history by container
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { DepotOffersHistoryList } from "@/components/depot/DepotOffersHistoryList";
import { DepotPrefetchLink } from "@/components/depot/DepotPrefetchLink";
import { loadDepotOffersHistoryData } from "@/lib/depot/actions/depot-actions";

export default async function DepotOffersHistoryPage() {
  const { dispatches } = await loadDepotOffersHistoryData();

  return (
    <div className="space-y-4">
      <DepotPrefetchLink
        href="/depot/dispatch"
        className="rounded-xl border border-cm-light-border-strong bg-white px-3 py-2 font-display text-sm font-semibold text-cm-accent transition-colors hover:border-cm-accent/40 hover:bg-cm-accent/5"
      >
        Νέα προσφορά →
      </DepotPrefetchLink>

      <DepotOffersHistoryList dispatches={dispatches} />
    </div>
  );
}
