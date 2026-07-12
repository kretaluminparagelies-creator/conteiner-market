/**
 * @file DepotHomeStats.tsx
 * @description Depot dashboard summary cards
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Link from "next/link";
import { Package, Send, Warehouse } from "lucide-react";
import type { DepotContainer, DepotDispatch } from "@/lib/depot/types";
import { filterAvailableContainers } from "@/lib/depot/filters";
import { isDepotOut } from "@/lib/depot/status";

type DepotHomeStatsProps = {
  containers: DepotContainer[];
  dispatches: DepotDispatch[];
};

export function DepotHomeStats({ containers, dispatches }: DepotHomeStatsProps) {
  const available = filterAvailableContainers(containers);
  const out = containers.filter((item) => isDepotOut(item.status));

  const cards = [
    {
      href: "/depot/dispatch",
      label: "Διαθέσιμα στο depo",
      value: available.length,
      icon: Warehouse,
    },
    {
      href: "/depot/out",
      label: "Έξω / μη διαθέσιμα",
      value: out.length,
      icon: Package,
    },
    {
      href: "/depot/dispatch",
      label: "Προσφορές",
      value: dispatches.length,
      icon: Send,
    },
  ] as const;

  return (
    <div className="grid gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.href}
            href={card.href}
            className="flex items-center justify-between rounded-2xl border border-cm-light-border-strong bg-white px-4 py-4 shadow-cm-light-sm transition-transform active:scale-[0.99]"
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
                {card.label}
              </p>
              <p className="mt-1 font-display text-3xl font-bold text-cm-ink">{card.value}</p>
            </div>
            <Icon className="size-6 text-cm-accent" />
          </Link>
        );
      })}
    </div>
  );
}
