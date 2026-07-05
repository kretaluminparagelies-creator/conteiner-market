/**
 * @file CrmQuickActions.tsx
 * @description Dashboard quick links (CRM)
 */

import Link from "next/link";
import { KeyRound, MessageSquare, Package, PlusCircle } from "lucide-react";

type CrmQuickActionsProps = {
  newLeadsCount: number;
  expiringRentalsCount: number;
};

const actionClass =
  "flex items-center gap-3 rounded-xl border border-cm-border bg-cm-card px-4 py-3 shadow-cm-light-xs transition-colors hover:border-cm-accent/35 hover:bg-cm-accent/5";

export function CrmQuickActions({ newLeadsCount, expiringRentalsCount }: CrmQuickActionsProps) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 font-display text-lg font-semibold text-cm-ink">Γρήγορες ενέργειες</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Link href="/admin/listings/new" className={actionClass}>
          <PlusCircle className="h-5 w-5 shrink-0 text-cm-accent" aria-hidden="true" />
          <span className="font-display text-sm font-semibold">Νέα καταχώριση</span>
        </Link>

        <Link href="/admin/rentals/new" className={actionClass}>
          <KeyRound className="h-5 w-5 shrink-0 text-cm-rent" aria-hidden="true" />
          <span className="font-display text-sm font-semibold">Νέα ενοικίαση</span>
        </Link>

        <Link href="/admin/leads?status=new" className={actionClass}>
          <MessageSquare className="h-5 w-5 shrink-0 text-cm-ink-sub" aria-hidden="true" />
          <span className="font-display text-sm font-semibold">
            Νέα αιτήματα
            {newLeadsCount > 0 ? (
              <span className="ml-1.5 rounded-full bg-orange-100 px-2 py-0.5 font-mono text-[10px] text-orange-800">
                {newLeadsCount}
              </span>
            ) : null}
          </span>
        </Link>

        <Link href="/admin/rentals" className={actionClass}>
          <Package className="h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
          <span className="font-display text-sm font-semibold">
            Λήγουν σύντομα
            {expiringRentalsCount > 0 ? (
              <span className="ml-1.5 rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[10px] text-amber-900">
                {expiringRentalsCount}
              </span>
            ) : null}
          </span>
        </Link>
      </div>
    </section>
  );
}
