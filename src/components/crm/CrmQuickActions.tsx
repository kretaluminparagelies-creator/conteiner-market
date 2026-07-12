/**
 * @file CrmQuickActions.tsx
 * @description Dashboard quick links (CRM)
 */

import Link from "next/link";
import { KeyRound, PlusCircle, Warehouse } from "lucide-react";
import { isDepotEnabled } from "@/lib/depot/config";

const actionClass =
  "flex items-center gap-2.5 rounded-lg border border-cm-border bg-cm-card/50 px-3 py-2.5 text-sm transition-colors hover:border-cm-accent/35 hover:bg-cm-accent/5";

export function CrmQuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/admin/listings/new" className={actionClass}>
        <PlusCircle className="h-4 w-4 shrink-0 text-cm-accent" aria-hidden="true" />
        <span className="font-display font-semibold">Νέα καταχώριση</span>
      </Link>

      <Link href="/admin/rentals/new" className={actionClass}>
        <KeyRound className="h-4 w-4 shrink-0 text-cm-rent" aria-hidden="true" />
        <span className="font-display font-semibold">Νέα ενοικίαση</span>
      </Link>

      {isDepotEnabled() ? (
        <Link href="/admin/depot" className={actionClass}>
          <Warehouse className="h-4 w-4 shrink-0 text-cm-accent" aria-hidden="true" />
          <span className="font-display font-semibold">Αποθήκη</span>
        </Link>
      ) : null}
    </div>
  );
}
