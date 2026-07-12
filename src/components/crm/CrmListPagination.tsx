/**
 * @file CrmListPagination.tsx
 * @description Prev/next pagination bar for CRM record lists
 */

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CrmListPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  rangeStart: number;
  rangeEnd: number;
  canPrev: boolean;
  canNext: boolean;
  prevHref?: string | null;
  nextHref?: string | null;
  onPrev?: () => void;
  onNext?: () => void;
};

const navButtonClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-cm-border bg-cm-card px-3 py-2 font-display text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 hover:border-cm-accent/35 hover:bg-cm-accent/5";

export function CrmListPagination({
  page,
  totalPages,
  total,
  rangeStart,
  rangeEnd,
  canPrev,
  canNext,
  prevHref,
  nextHref,
  onPrev,
  onNext,
}: CrmListPaginationProps) {
  if (total <= 30) {
    return null;
  }

  const summary =
    total === 0
      ? "Καμία εγγραφή"
      : `Εμφανίζονται ${rangeStart}–${rangeEnd} από ${total}`;

  const prevButton =
    prevHref && canPrev ? (
      <Link href={prevHref} className={navButtonClass} aria-label="Προηγούμενη σελίδα">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Προηγ.
      </Link>
    ) : (
      <button
        type="button"
        className={navButtonClass}
        disabled={!canPrev}
        onClick={onPrev}
        aria-label="Προηγούμενη σελίδα"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Προηγ.
      </button>
    );

  const nextButton =
    nextHref && canNext ? (
      <Link href={nextHref} className={navButtonClass} aria-label="Επόμενη σελίδα">
        Επόμ.
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    ) : (
      <button
        type="button"
        className={navButtonClass}
        disabled={!canNext}
        onClick={onNext}
        aria-label="Επόμενη σελίδα"
      >
        Επόμ.
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cm-border/70 bg-cm-surf/20 px-4 py-3">
      <p className="text-sm text-cm-sub">{summary}</p>
      <div className="flex items-center gap-2">
        {prevButton}
        <span className="min-w-[5.5rem] text-center font-mono text-xs text-cm-muted">
          {page} / {totalPages}
        </span>
        {nextButton}
      </div>
    </div>
  );
}
