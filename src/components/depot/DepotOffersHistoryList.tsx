/**
 * @file DepotOffersHistoryList.tsx
 * @description Expandable offer history grouped by container
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DepotContainerCard } from "@/components/depot/DepotContainerCard";
import { DepotOfferHistoryFilters } from "@/components/depot/DepotOfferHistoryFilters";
import {
  buildContainerOfferHistories,
  collectOfferHistoryRepresentatives,
  dispatchRecipientLabel,
  emptyOfferHistoryFilters,
  filterContainerOfferHistories,
  formatDepotDispatchDate,
} from "@/lib/depot/offer-history";
import type { DepotDispatch } from "@/lib/depot/types";
import { cn } from "@/lib/utils";

type DepotOffersHistoryListProps = {
  dispatches: DepotDispatch[];
};

export function DepotOffersHistoryList({ dispatches }: DepotOffersHistoryListProps) {
  const histories = useMemo(() => buildContainerOfferHistories([], dispatches), [dispatches]);
  const [filters, setFilters] = useState(emptyOfferHistoryFilters);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const representatives = useMemo(() => collectOfferHistoryRepresentatives(histories), [histories]);
  const hasExternalRecipients = useMemo(
    () => histories.some((history) => history.dispatches.some((dispatch) => !dispatch.representativeId)),
    [histories],
  );
  const filteredHistories = useMemo(
    () => filterContainerOfferHistories(histories, filters),
    [histories, filters],
  );

  if (histories.length === 0) {
    return (
      <div className="space-y-4 rounded-2xl border border-cm-light-border-strong bg-white px-4 py-6 text-sm text-cm-ink-sub">
        <p>Δεν έχουν καταγραφεί προσφορές ακόμα.</p>
        <Link href="/depot/dispatch" className="inline-block font-semibold text-cm-accent">
          Στείλε την πρώτη προσφορά →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <DepotOfferHistoryFilters
        value={filters}
        onChange={setFilters}
        representatives={representatives}
        hasExternalRecipients={hasExternalRecipients}
      />

      {filteredHistories.length === 0 ? (
        <div className="rounded-2xl border border-cm-light-border-strong bg-white px-4 py-5 text-sm text-cm-ink-sub">
          Δεν βρέθηκαν προσφορές με αυτά τα φίλτρα.
        </div>
      ) : null}

      {filteredHistories.map((history) => {
        const expanded = expandedId === history.container.id;
        const latestRecipient = dispatchRecipientLabel(history.latestDispatch);

        return (
          <div
            key={history.container.id}
            className="overflow-hidden rounded-2xl border border-cm-light-border-strong bg-white shadow-cm-light-xs"
          >
            <button
              type="button"
              onClick={() =>
                setExpandedId((current) =>
                  current === history.container.id ? null : history.container.id,
                )
              }
              className="w-full text-left"
              aria-expanded={expanded}
            >
              <div className="p-3">
                <DepotContainerCard
                  container={history.container}
                  action={
                    <ChevronDown
                      className={cn(
                        "size-5 text-cm-ink-muted transition-transform",
                        expanded && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  }
                />
                <div className="mt-2 border-t border-cm-light-border-strong/80 px-1 pt-2">
                  <p className="text-sm text-cm-ink">
                    Τελευταία: <span className="font-semibold">{latestRecipient}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-cm-ink-sub">
                    {formatDepotDispatchDate(history.latestDispatch.createdAt)} ·{" "}
                    {history.dispatches.length}{" "}
                    {history.dispatches.length === 1 ? "προσφορά" : "προσφορές"}
                  </p>
                </div>
              </div>
            </button>

            {expanded ? (
              <div className="border-t border-cm-light-border-strong bg-cm-light-bg/60 px-4 py-3">
                <p className="mb-2 font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
                  Ιστορικό αποστολών
                </p>
                <ul className="space-y-2">
                  {history.dispatches.map((dispatch) => (
                    <li
                      key={dispatch.id}
                      className="rounded-xl border border-cm-light-border-strong bg-white px-3 py-2.5"
                    >
                      <p className="font-display text-sm font-semibold text-cm-ink">
                        {dispatchRecipientLabel(dispatch)}
                      </p>
                      <p className="mt-0.5 text-xs text-cm-ink-sub">
                        {formatDepotDispatchDate(dispatch.createdAt)}
                        {dispatch.recipientLabel && !dispatch.representative ? " · Εξωτερικό" : ""}
                      </p>
                      {dispatch.sentByEmail ? (
                        <p className="mt-1 font-mono text-[10px] text-cm-ink-muted">
                          Από: {dispatch.sentByEmail}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/depot/dispatch?container=${history.container.id}`}
                  className="mt-3 inline-block text-sm font-semibold text-cm-accent"
                >
                  Νέα προσφορά για αυτό το κοντέινερ →
                </Link>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
