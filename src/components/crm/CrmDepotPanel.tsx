/**
 * @file CrmDepotPanel.tsx
 * @description CRM depot inventory overview
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { CrmDepotContainersTable } from "@/components/crm/CrmDepotContainersTable";
import { CrmDepotOffersTable } from "@/components/crm/CrmDepotOffersTable";
import { CrmListPaginationBar } from "@/components/crm/CrmListPaginationBar";
import type { PaginatedSlice } from "@/lib/crm/pagination";
import type { CrmDepotTab } from "@/lib/depot/repository/supabase-depot";
import type { DepotContainer, DepotDispatch } from "@/lib/depot/types";
import { useCrmUrlFilters } from "@/lib/hooks/useCrmUrlFilters";
import { cn } from "@/lib/utils";

type CrmDepotPanelProps = {
  tab: CrmDepotTab;
  tabCounts: Record<CrmDepotTab, number>;
  slice: PaginatedSlice<DepotContainer | DepotDispatch>;
};

const tabs = [
  { id: "available", label: "Διαθέσιμα" },
  { id: "out", label: "Έξω" },
  { id: "offers", label: "Προσφορές" },
] as const;

const emptyMessages: Record<CrmDepotTab, string> = {
  available: "Δεν υπάρχουν διαθέσιμα κοντέινερ στο depo.",
  out: "Δεν υπάρχουν κοντέινερ έξω από το depo.",
  offers: "Δεν έχουν καταγραφεί προσφορές ακόμα.",
};

export function CrmDepotPanel({ tab, tabCounts, slice }: CrmDepotPanelProps) {
  const { pathname, searchParams } = useCrmUrlFilters();

  return (
    <div className="overflow-hidden rounded-xl border border-cm-border bg-cm-card/30">
      <div className="flex flex-wrap gap-1 border-b border-cm-border bg-cm-surf/40 px-3 py-2">
        {tabs.map((item) => (
          <Link
            key={item.id}
            href={`${pathname}?tab=${item.id}`}
            className={cn(
              "rounded-lg px-3 py-1.5 font-display text-sm font-semibold transition-colors",
              tab === item.id
                ? "bg-cm-accent text-white"
                : "text-cm-ink-sub hover:bg-cm-card/80 hover:text-cm-ink",
            )}
          >
            {item.label}
            {tabCounts[item.id] > 0 ? (
              <span
                className={cn(
                  "ml-1.5 font-mono text-[11px]",
                  tab === item.id ? "text-white/85" : "text-cm-muted",
                )}
              >
                {tabCounts[item.id]}
              </span>
            ) : null}
          </Link>
        ))}
      </div>

      {tab === "offers" ? (
        <CrmDepotOffersTable
          dispatches={slice.items as DepotDispatch[]}
          emptyMessage={emptyMessages.offers}
        />
      ) : (
        <CrmDepotContainersTable
          containers={slice.items as DepotContainer[]}
          emptyMessage={emptyMessages[tab]}
        />
      )}

      <CrmListPaginationBar
        slice={slice}
        pathname={pathname}
        searchParams={new URLSearchParams(searchParams.toString())}
      />
    </div>
  );
}
