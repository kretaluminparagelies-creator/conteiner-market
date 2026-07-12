/**
 * @file DepotAvailableList.tsx
 * @description Filterable list of available depot containers
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useMemo, useState } from "react";
import { DepotContainerCard } from "@/components/depot/DepotContainerCard";
import {
  DepotContainerFilters,
  emptyDepotContainerFilters,
} from "@/components/depot/DepotContainerFilters";
import { DepotListLoadMore } from "@/components/depot/DepotListLoadMore";
import { filterAvailableContainers } from "@/lib/depot/filters";
import { usePagedList } from "@/lib/hooks/usePagedList";
import type { DepotContainer } from "@/lib/depot/types";

type DepotAvailableListProps = {
  containers: DepotContainer[];
  mode?: "navigate" | "select";
  selectedId?: string;
  onSelect?: (container: DepotContainer) => void;
  countLabel?: string;
  emptyLabel?: string;
};

export function DepotAvailableList({
  containers,
  mode = "navigate",
  selectedId,
  onSelect,
  countLabel = "διαθέσιμα",
  emptyLabel = "Δεν βρέθηκαν κοντέινερ με αυτά τα φίλτρα.",
}: DepotAvailableListProps) {
  const [filters, setFilters] = useState(emptyDepotContainerFilters);

  const filtered = useMemo(
    () =>
      filterAvailableContainers(containers, {
        query: filters.query || undefined,
        containerType: filters.containerType || undefined,
        grade: filters.grade ? (filters.grade as "A" | "B" | "C") : undefined,
        maxSalePrice: filters.maxSalePrice ? Number(filters.maxSalePrice) : undefined,
      }),
    [containers, filters],
  );

  const { visibleItems, hasMore, loadMore, total, shown, nextBatch } = usePagedList(filtered);

  return (
    <div className="space-y-4">
      <DepotContainerFilters value={filters} onChange={setFilters} />

      <p className="font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
        {total} {countLabel}
      </p>

      {total === 0 ? (
        <p className="rounded-2xl border border-cm-light-border-strong bg-white px-4 py-6 text-sm text-cm-ink-sub">
          {emptyLabel}
        </p>
      ) : (
        <div className="space-y-3">
          {visibleItems.map((container) => (
            <DepotContainerCard
              key={container.id}
              container={container}
              href={
                mode === "navigate" ? `/depot/dispatch?container=${container.id}` : undefined
              }
              onClick={mode === "select" ? () => onSelect?.(container) : undefined}
              selected={mode === "select" && selectedId === container.id}
            />
          ))}
          <DepotListLoadMore
            shown={shown}
            total={total}
            hasMore={hasMore}
            nextBatch={nextBatch}
            onLoadMore={loadMore}
          />
        </div>
      )}
    </div>
  );
}
