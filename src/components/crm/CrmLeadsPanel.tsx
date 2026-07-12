/**
 * @file CrmLeadsPanel.tsx
 * @description Leads table with filters and search (CRM)
 */

"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { CrmLeadsTable } from "@/components/crm/CrmLeadsTable";
import { CrmListPaginationBar } from "@/components/crm/CrmListPaginationBar";
import { leadSourceLabels, leadStatusLabels } from "@/lib/crm/lead-labels";
import type { PaginatedSlice } from "@/lib/crm/pagination";
import { setSearchParam } from "@/lib/crm/pagination";
import { useCrmUrlFilters } from "@/lib/hooks/useCrmUrlFilters";
import type { Lead, LeadSource, LeadStatus } from "@/lib/crm/types";

type CrmLeadsPanelProps = {
  result: PaginatedSlice<Lead>;
  totalAll: number;
};

const selectClass =
  "rounded-lg border border-cm-border bg-cm-bg px-3 py-2 text-sm text-cm-text outline-none focus:border-cm-accent";

const statuses: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];
const sources: LeadSource[] = ["contact", "buyback", "rent", "space", "listing"];

export function CrmLeadsPanel({ result, totalAll }: CrmLeadsPanelProps) {
  const { pathname, searchParams, pushParams } = useCrmUrlFilters();
  const status = (searchParams.get("status") ?? "") as LeadStatus | "";
  const source = (searchParams.get("source") ?? "") as LeadSource | "";
  const query = searchParams.get("q") ?? "";
  const hasFilters = Boolean(status || source || query);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-cm-ink-sub">
          {result.total} από {totalAll} αιτήματα
        </p>
        <Link
          href="/admin/leads/export"
          className="inline-flex items-center gap-2 rounded-lg border border-cm-border bg-white px-3 py-2 font-mono text-[11px] text-cm-ink-sub transition-colors hover:border-cm-accent/40 hover:text-cm-accent"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          Export CSV
        </Link>
      </div>

      <div className="rounded-xl border border-cm-border bg-cm-card p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-sm font-semibold">Φίλτρα</h2>
          {hasFilters ? (
            <button
              type="button"
              onClick={() => pushParams((params) => {
                params.delete("status");
                params.delete("source");
                params.delete("q");
              })}
              className="font-mono text-[10px] tracking-wide text-cm-muted uppercase hover:text-cm-accent"
            >
              Καθαρισμός
            </button>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-wide text-cm-muted uppercase">
              Κατάσταση
            </label>
            <select
              value={status}
              onChange={(event) =>
                pushParams((params) => {
                  setSearchParam(params, "status", event.target.value);
                })
              }
              className={selectClass}
            >
              <option value="">Όλες</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {leadStatusLabels[item]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-wide text-cm-muted uppercase">
              Πηγή
            </label>
            <select
              value={source}
              onChange={(event) =>
                pushParams((params) => {
                  setSearchParam(params, "source", event.target.value);
                })
              }
              className={selectClass}
            >
              <option value="">Όλες</option>
              {sources.map((item) => (
                <option key={item} value={item}>
                  {leadSourceLabels[item]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-wide text-cm-muted uppercase">
              Αναζήτηση
            </label>
            <input
              type="search"
              value={query}
              onChange={(event) =>
                pushParams((params) => {
                  setSearchParam(params, "q", event.target.value);
                })
              }
              placeholder="Όνομα, email, μήνυμα…"
              className={selectClass}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-cm-border bg-cm-card/30">
        <CrmLeadsTable leads={result.items} bare />
        <CrmListPaginationBar
          slice={result}
          pathname={pathname}
          searchParams={new URLSearchParams(searchParams.toString())}
        />
      </div>
    </div>
  );
}
