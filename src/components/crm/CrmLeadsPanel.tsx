/**
 * @file CrmLeadsPanel.tsx
 * @description Leads table with filters and search (CRM)
 */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { CrmLeadsTable } from "@/components/crm/CrmLeadsTable";
import { leadSourceLabels, leadStatusLabels } from "@/lib/crm/lead-labels";
import type { Lead, LeadSource, LeadStatus } from "@/lib/crm/types";

type CrmLeadsPanelProps = {
  leads: Lead[];
  initialStatus?: string;
};

type LeadFilters = {
  status: "" | LeadStatus;
  source: "" | LeadSource;
  query: string;
};

const selectClass =
  "rounded-lg border border-cm-border bg-cm-bg px-3 py-2 text-sm text-cm-text outline-none focus:border-cm-accent";

const statuses: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];
const sources: LeadSource[] = ["contact", "buyback", "rent", "space", "listing"];

function resolveInitialStatus(value?: string): "" | LeadStatus {
  if (value && statuses.includes(value as LeadStatus)) {
    return value as LeadStatus;
  }
  return "";
}

export function CrmLeadsPanel({ leads, initialStatus }: CrmLeadsPanelProps) {
  const [filters, setFilters] = useState<LeadFilters>({
    status: resolveInitialStatus(initialStatus),
    source: "",
    query: "",
  });

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    return leads.filter((lead) => {
      if (filters.status && lead.status !== filters.status) return false;
      if (filters.source && lead.source !== filters.source) return false;
      if (!q) return true;

      const haystack = [
        lead.name,
        lead.email,
        lead.phone,
        lead.message,
        lead.listingSlug,
        lead.adminNotes,
        leadSourceLabels[lead.source],
        leadStatusLabels[lead.status],
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [leads, filters]);

  const hasFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-cm-ink-sub">
          {filtered.length} από {leads.length} αιτήματα
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
              onClick={() => setFilters({ status: "", source: "", query: "" })}
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
              value={filters.status}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  status: event.target.value as LeadFilters["status"],
                }))
              }
              className={selectClass}
            >
              <option value="">Όλες</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {leadStatusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-wide text-cm-muted uppercase">
              Πηγή
            </label>
            <select
              value={filters.source}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  source: event.target.value as LeadFilters["source"],
                }))
              }
              className={selectClass}
            >
              <option value="">Όλες</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {leadSourceLabels[source]}
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
              value={filters.query}
              onChange={(event) =>
                setFilters((current) => ({ ...current, query: event.target.value }))
              }
              placeholder="Όνομα, email, μήνυμα…"
              className={selectClass}
            />
          </div>
        </div>
      </div>

      <CrmLeadsTable leads={filtered} />
    </div>
  );
}
