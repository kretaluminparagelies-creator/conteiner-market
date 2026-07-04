/**
 * @file CrmLeadStatusSelect.tsx
 * @description Inline lead status editor
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useTransition } from "react";
import { updateLeadStatusAction } from "@/lib/crm/actions/lead-actions";
import { leadStatusLabels, leadStatusStyles } from "@/lib/crm/lead-labels";
import type { LeadStatus } from "@/lib/crm/types";

const statuses: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];

type CrmLeadStatusSelectProps = {
  leadId: string;
  status: LeadStatus;
};

export function CrmLeadStatusSelect({ leadId, status }: CrmLeadStatusSelectProps) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(event) => {
        const next = event.target.value as LeadStatus;
        startTransition(() => updateLeadStatusAction(leadId, next));
      }}
      className={[
        "rounded-full border-0 px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase outline-none",
        leadStatusStyles[status],
        pending ? "opacity-60" : "",
      ].join(" ")}
      aria-label="Κατάσταση αιτήματος"
    >
      {statuses.map((item) => (
        <option key={item} value={item}>
          {leadStatusLabels[item]}
        </option>
      ))}
    </select>
  );
}
