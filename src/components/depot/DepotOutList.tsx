/**
 * @file DepotOutList.tsx
 * @description Containers not at depot — with return action
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { DepotContainerCard } from "@/components/depot/DepotContainerCard";
import { returnDepotContainerAction } from "@/lib/depot/actions/depot-actions";
import { isDepotOut } from "@/lib/depot/status";
import type { DepotContainer } from "@/lib/depot/types";

type DepotOutListProps = {
  containers: DepotContainer[];
};

export function DepotOutList({ containers }: DepotOutListProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const out = containers
    .filter((item) => isDepotOut(item.status))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const handleReturn = (containerId: string) => {
    setError(null);
    setPendingId(containerId);

    startTransition(async () => {
      const result = await returnDepotContainerAction(containerId);
      setPendingId(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  if (out.length === 0) {
    return (
      <p className="rounded-2xl border border-cm-light-border-strong bg-white px-4 py-6 text-sm text-cm-ink-sub">
        Όλα τα κοντέινερ είναι στο depo.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      {out.map((container) => (
        <DepotContainerCard
          key={container.id}
          container={container}
          action={
            container.status === "with_rep_storage" ? (
              <button
                type="button"
                onClick={() => handleReturn(container.id)}
                disabled={pendingId === container.id}
                className="rounded-lg border border-cm-light-border-strong px-2.5 py-2 font-mono text-[10px] font-bold text-cm-accent disabled:opacity-60"
              >
                {pendingId === container.id ? "..." : "Επιστροφή"}
              </button>
            ) : null
          }
        />
      ))}
    </div>
  );
}
